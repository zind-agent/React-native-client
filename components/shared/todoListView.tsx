import React, { useCallback, useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FlatList } from 'react-native';
import { useTodoStore } from '@/store/todoState';
import { useGroupedTodos } from '@/hooks/useGroupedTodos';
import ScheduleCard from './scheduleCard';
import HourlyRow from './hourlyRow';
import Loading from './Loading';
import { Todo } from '@/storage/todoStorage';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { useEditTaskDrawer } from '@/hooks/useEditTaskDrawer';
import HiddenItem from './hiddenItem';

interface TodoListViewProps {
  mode: 'flat' | 'grouped';
  date?: string;
  enableSwipeActions?: boolean;
}

const TodoListView = ({ mode, enableSwipeActions = true }: TodoListViewProps) => {
  const { todos, loading, updateTodo, todayInprogressTodos } = useTodoStore();
  const { openEditDrawer } = useEditTaskDrawer();
  const groupedTodos = useGroupedTodos(mode === 'grouped' ? todos : []);
  const [swipedRows, setSwipedRows] = useState<Set<string>>(new Set());

  const handleCompleteTask = useCallback(
    async (task: Todo) => {
      try {
        await updateTodo({ ...task, isCompleted: true, isCancel: false });
        setSwipedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      } catch (error) {
        console.error('Error completing task:', error);
      }
    },
    [updateTodo],
  );

  const handleCancelTask = useCallback(
    async (task: Todo) => {
      try {
        await updateTodo({ ...task, isCompleted: false, isCancel: true });
        setSwipedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      } catch (error) {
        console.error('Error canceling task:', error);
      }
    },
    [updateTodo],
  );

  const renderItem = useCallback(
    ({ item }: { item: Todo }) => (
      <ScheduleCard
        task={item}
        onPress={() => openEditDrawer(item.id)}
        style={{
          opacity: item.isCompleted || item.isCancel ? 0.6 : 1,
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
    ({ item }: { item: Todo }) => <HiddenItem item={item} swipedRows={swipedRows} onCompleteTask={handleCompleteTask} onCancelTask={handleCancelTask} />,
    [swipedRows, handleCompleteTask, handleCancelTask],
  );

  const renderGroupedItem = useCallback(
    ({ item }: { item: any }) => (
      <HourlyRow hour={item.hour} tasks={item.tasks} onEditTask={(task) => openEditDrawer(task.id)} isCurrentHour={item.hour.split(':')[0] === new Date().getHours().toString().padStart(2, '0')} />
    ),
    [openEditDrawer],
  );

  if (loading) {
    return <Loading />;
  }

  if (todos.length === 0) {
    return (
      <VStack className="mt-5 mb-10 h-full">
        <Text className="text-center mt-10 px-10 text-2xl" style={{ color: Colors.main.background }}>
          {t('home.no_task')}
        </Text>
        <Button onPress={() => openEditDrawer()} className="mt-5 w-40 mx-auto" style={{ backgroundColor: Colors.main.primary }}>
          <ButtonText style={{ color: Colors.main.background }}>{t('home.add_task')}</ButtonText>
        </Button>
      </VStack>
    );
  }

  if (mode === 'flat') {
    return (
      <SwipeListView
        data={todayInprogressTodos}
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
