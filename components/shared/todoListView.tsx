import React, { useCallback, useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FlatList } from 'react-native';
import { useGroupedTodos } from '@/hooks/useGroupedTodos';
import ScheduleCard from './scheduleCard';
import { Colors } from '@/constants/Colors';
import HiddenItem from '../common/hiddenItem';
import HourlyRow from '../common/hourlyRow';
import { useTodoStore } from '@/store/todoState';
import { Task } from '@/storage/todoStorage';
import { TaskStatus } from '@/constants/TaskEnum';
import { router } from 'expo-router';
import { Loading } from '../common/Loading';
import { Center } from '../ui/center';
import { Text } from '../Themed';
import { t } from 'i18next';
import { useAppStore } from '@/store/appState';

interface TodoListViewProps {
  mode: 'flat' | 'grouped';
  enableSwipeActions?: boolean;
}

const TodoListView = ({ mode, enableSwipeActions = true }: TodoListViewProps) => {
  const { tasks, isLoading, updateTask, loadTasks } = useTodoStore();
  const groupedTodos = useGroupedTodos(mode === 'grouped' ? tasks : []);
  const [swipedRows, setSwipedRows] = useState<Set<string>>(new Set());
  const { activeTab } = useAppStore();

  const handleUpdateTaskStatus = useCallback(
    async (task: Task, newStatus: TaskStatus) => {
      try {
        await updateTask({ ...task, status: newStatus });
        switch (activeTab) {
          case TaskStatus.COMPLETED:
            loadTasks(task.date, TaskStatus.COMPLETED);
            break;
          case TaskStatus.PENDING:
            loadTasks(task.date, TaskStatus.PENDING);
            break;
          default:
            loadTasks(task.date);
            break;
        }
        setSwipedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      } catch (error) {
        console.error(`Error updating task status to ${newStatus}:`, error);
      }
    },
    [updateTask, activeTab, loadTasks],
  );

  const handleCompleteTask = (task: Task) => handleUpdateTaskStatus(task, TaskStatus.COMPLETED);

  const handleCancelTask = (task: Task) => handleUpdateTaskStatus(task, TaskStatus.CANCELLED);

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <ScheduleCard
        task={item}
        onPress={() => router.push(`/tabs/(tabs)/${item.id}`)}
        style={{
          backgroundColor: Colors.main.cardBackground,
          marginVertical: 4,
          borderRadius: 10,
          padding: 10,
        }}
      />
    ),
    [],
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
    ({ item }: { item: any }) => <HourlyRow hour={item.hour} tasks={item.tasks} isCurrentHour={item.hour.split(':')[0] === new Date().getHours().toString().padStart(2, '0')} />,
    [],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (mode === 'flat') {
    if (tasks.length === 0) {
      return (
        <Center style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: Colors.main.textSecondary }}>{t('home.no_tasks_today')}</Text>
        </Center>
      );
    }
    return (
      <SwipeListView
        data={tasks}
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
        closeOnRowPress={false}
        closeOnScroll={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        swipeToOpenPercent={10}
        swipeToClosePercent={10}
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
