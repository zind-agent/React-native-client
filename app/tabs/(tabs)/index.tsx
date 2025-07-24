import React, { useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { useTodoStore } from '@/store/todoState';
import TodoListView from '@/components/shared/todoListView';
import AddTodoInTime from '@/components/shared/forms/addTodo/addTodoInTime';
import { Center } from '@/components/ui/center';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import UserHeaderTitle from '@/components/common/userHeaderTitle';

interface HomeSection {
  id: string;
  type: 'header' | 'addTodo' | 'progress' | 'todosHeader' | 'todo' | 'emptyState';
  data?: any;
}

const Home: React.FC = () => {
  const { todayInprogressTodos, todos, loadTodayInprogressTodos, loadTodos } = useTodoStore();

  const percentage = todos.length === 0 ? 0 : Math.round(((todos.length - todayInprogressTodos.length) / todos.length) * 100);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    loadTodayInprogressTodos(false, false);
    loadTodos(today);
  }, [loadTodayInprogressTodos, loadTodos]);

  const sections: HomeSection[] = [
    { id: 'header', type: 'header' },
    { id: 'addTodo', type: 'addTodo' },
    { id: 'progress', type: 'progress' },
  ];

  if (todos.length === 0 && todayInprogressTodos.length === 0) {
    sections.push({ id: 'emptyState', type: 'emptyState' });
  } else {
    sections.push({ id: 'todosHeader', type: 'todosHeader' });
    todos.forEach((todo) => {
      sections.push({ id: todo.id, type: 'todo', data: todo });
    });
  }

  const renderItem: ListRenderItem<HomeSection> = ({ item }) => {
    switch (item.type) {
      case 'header':
        return <UserHeaderTitle />;

      case 'addTodo':
        return <AddTodoInTime />;

      case 'progress':
        return (
          <Center className="mt-3 h-36 w-full rounded-lg px-10 gap-4" style={{ backgroundColor: Colors.main.primaryDark }}>
            <Text className="text-center text-xl" style={{ color: Colors.main.textPrimary }}>
              {t('home.today_progress_summery')}
            </Text>
            <HStack className="justify-between items-start w-full">
              <Text style={{ color: Colors.main.textPrimary }}>
                {t('home.task')} {todos.length - todayInprogressTodos.length} / {todos.length}
              </Text>
              <Text style={{ color: Colors.main.textPrimary }}>{percentage}%</Text>
            </HStack>
            <Progress style={{ backgroundColor: Colors.main.background }} value={percentage} size="md" orientation="horizontal">
              <ProgressFilledTrack style={{ backgroundColor: Colors.main.primary }} />
            </Progress>
          </Center>
        );

      case 'todosHeader':
        return (
          <VStack className="mt-5">
            <HStack className="justify-between items-center px-1">
              <Heading style={{ color: Colors.main.textPrimary }} size="2xl">
                {t('home.today_task')}
              </Heading>
              <Button className="bg-transparent" onPress={() => router.push('/tabs/(tabs)/todos')}>
                <ButtonText style={{ color: Colors.main.textPrimary }} className="text-sm">
                  {t('home.view_all')}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        );

      case 'todo':
        return <TodoListView mode="flat" enableSwipeActions={true} />;

      case 'emptyState':
        return (
          <VStack className="mt-5 h-full">
            <Text className="text-center mt-10 px-10 text-lg" style={{ color: Colors.main.textSecondary }}>
              {t('home.no_task')}
            </Text>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box style={{ flex: 1, backgroundColor: Colors.main.background }}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </Box>
  );
};

export default Home;
