import React, { useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import HourlyRow from './hourlyRow';
import { useTodoStore } from '@/store/todoState';
import Loading from './Loading';
import { Text } from '../Themed';
import { VStack } from '../ui/vstack';
import { Heading } from '../ui/heading';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';

interface ScheduleListProps {
  date: string;
}

const ScheduleList = ({ date }: ScheduleListProps) => {
  const { todos, loadTodos, loading, refreshTodos } = useTodoStore();

  useEffect(() => {
    loadTodos(date);
  }, [date]);

  useEffect(() => {
    refreshTodos();
  }, []);

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

  if (todos.length === 0) {
    return (
      <VStack className="mt-5 mb-10 h-full">
        <Text className="text-center mt-10 px-10 text-2xl" style={{ color: Colors.light.subtext }}>
          {t('home.no_task')}
        </Text>
      </VStack>
    );
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
