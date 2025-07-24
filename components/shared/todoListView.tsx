import React, { useCallback, useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FlatList } from 'react-native';
import { useGroupedTodos } from '@/hooks/useGroupedTodos';
import ScheduleCard from './scheduleCard';
import { Colors } from '@/constants/Colors';
import { useEditTaskDrawer } from '@/hooks/useEditTaskDrawer';
import HiddenItem from '../common/hiddenItem';
import HourlyRow from '../common/hourlyRow';
import Loading from '../common/Loading';
import { useTodoStore } from '@/store/todoState';
import { Task } from '@/storage/todoStorage';
import { TaskStatus } from '@/constants/TaskEnum';

interface TodoListViewProps {
  mode: 'flat' | 'grouped';
  date?: string;
  enableSwipeActions?: boolean;
}

const TodoListView = ({ mode, enableSwipeActions = true }: TodoListViewProps) => {
  const { tasks, isLoading, updateTask, pendingTodayTasks } = useTodoStore();
  const { openEditDrawer } = useEditTaskDrawer();
  const groupedTodos = useGroupedTodos(mode === 'grouped' ? tasks : []);
  const [swipedRows, setSwipedRows] = useState<Set<string>>(new Set());

  const handleCompleteTask = useCallback(
    async (task: Task) => {
      try {
        await updateTask({ ...task, status: TaskStatus.COMPLETED });
        setSwipedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      } catch (error) {
        console.error('Error completing task:', error);
      }
    },
    [updateTask],
  );

  const handleCancelTask = useCallback(
    async (task: Task) => {
      try {
        await updateTask({ ...task, status: TaskStatus.CANCELLED });
        setSwipedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      } catch (error) {
        console.error('Error canceling task:', error);
      }
    },
    [updateTask],
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <ScheduleCard
        task={item}
        onPress={() => item.id && openEditDrawer(item.id)}
        style={{
          opacity: item.status === TaskStatus.COMPLETED || item.status === TaskStatus.CANCELLED ? 0.6 : 1,
          backgroundColor: Colors.main.cardBackground,
          marginVertical: 2,
          borderRadius: 10,
          padding: 10,
        }}
      />
    ),
    [openEditDrawer],
  );

  const handleRowOpen = useCallback((rowKey: string) => {
    setSwipedRows((prev) => new Set(prev).add(rowKey));
  }, []);

  const handleRowClose = useCallback(() => {
    setSwipedRows(new Set());
  }, []);

  const renderHiddenItemWrapper = useCallback(
    ({ item }: { item: Task }) => <HiddenItem item={item} swipedRows={swipedRows} onCompleteTask={handleCompleteTask} onCancelTask={handleCancelTask} />,
    [swipedRows, handleCompleteTask, handleCancelTask],
  );

  const renderGroupedItem = useCallback(
    ({ item }: { item: any }) => (
      <HourlyRow
        hour={item.hour}
        tasks={item.tasks}
        onEditTask={(task: Task) => task.id && openEditDrawer(task.id)}
        isCurrentHour={item.hour.split(':')[0] === new Date().getHours().toString().padStart(2, '0')}
      />
    ),
    [openEditDrawer],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (mode === 'flat') {
    return (
      <SwipeListView
        data={pendingTodayTasks}
        renderItem={renderItem}
        renderHiddenItem={enableSwipeActions ? renderHiddenItemWrapper : undefined}
        leftOpenValue={100}
        rightOpenValue={-100}
        keyExtractor={(item) => item.id}
        onRowOpen={handleRowOpen}
        onRowClose={handleRowClose}
        disableLeftSwipe={!enableSwipeActions}
        disableRightSwipe={!enableSwipeActions}
        closeOnRowBeginSwipe={true}
        closeOnRowPress={true}
        closeOnScroll={true}
        recalculateHiddenLayout={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        swipeToOpenPercent={15}
        swipeToClosePercent={15}
      />
    );
  }

  if (mode === 'grouped') {
    return (
      <FlatList
        data={groupedTodos}
        renderItem={renderGroupedItem}
        keyExtractor={(item) => item.hour}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />
    );
  }

  return null;
};

export default TodoListView;
