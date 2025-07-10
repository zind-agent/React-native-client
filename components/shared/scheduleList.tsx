import React, { useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import HourlyRow from './hourlyRow';
import { useTodoStore } from '@/store/todoState';
import Loading from './Loading';

interface ScheduleListProps {
  date: string;
}

const ScheduleList = ({ date }: ScheduleListProps) => {
  const { todos, loadTodos, loading } = useTodoStore();

  useEffect(() => {
    loadTodos(date);
  }, [date]);

  const hourlyData = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};

    todos.forEach((todo) => {
      const hour = todo.start_time ? todo.start_time.split(':')[0] : '00';
      const hourLabel = `${hour.padStart(2, '0')}:00`;
      if (!grouped[hourLabel]) {
        grouped[hourLabel] = [];
      }
      grouped[hourLabel].push(todo);
    });
    const sortedHours = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));
    return sortedHours.map((hour) => ({
      hour,
      tasks: grouped[hour],
    }));
  }, [todos]);

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={hourlyData}
      keyExtractor={(item) => item.hour}
      renderItem={({ item }) => <HourlyRow hour={item.hour} tasks={item.tasks} isCurrentHour={item.hour.split(':')[0] === new Date().getHours().toString().padStart(2, '0')} />}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

export default ScheduleList;
