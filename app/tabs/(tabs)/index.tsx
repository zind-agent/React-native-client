import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
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
  type: 'header' | 'addTodo' | 'progress' | 'todosHeader' | 'todoList' | 'emptyState';
  data?: any;
}

const ITEM_HEIGHTS = {
  header: 60,
  addTodo: 80,
  progress: 120,
  todosHeader: 50,
  todoList: 300,
  emptyState: 200,
};

const Home: React.FC = () => {
  const { loadPendingTodayTasks, pendingTodayTasks, getCompletionPercentage } = useTodoStore();
  const percentage = useMemo(() => getCompletionPercentage(), [getCompletionPercentage]);

  useEffect(() => {
    loadPendingTodayTasks();
  }, [loadPendingTodayTasks]);

  const sections: HomeSection[] = useMemo(() => {
    const base: HomeSection[] = [
      { id: 'header', type: 'header' },
      { id: 'addTodo', type: 'addTodo' },
      { id: 'progress', type: 'progress' },
    ];
    return [...base, { id: 'todosHeader', type: 'todosHeader' }, { id: 'todoList', type: 'todoList' }];
  }, []);

  const renderItem: ListRenderItem<HomeSection> = useCallback(({ item }) => {
    switch (item.type) {
      case 'header':
        return <UserHeaderTitle />;

      case 'addTodo':
        return <AddTodoInTime />;

      case 'progress':
        return (
          <Center style={styles.progressContainer}>
            <Text style={styles.progressText}>{t('home.today_progress_summery')}</Text>
            <HStack style={styles.progressStats}>
              <Text style={styles.statText}>
                {t('home.task')} {pendingTodayTasks.length}
              </Text>
              <Text style={styles.statText}>{percentage}%</Text>
            </HStack>
            <Progress style={styles.progressBar} value={percentage} size="md" orientation="horizontal">
              <ProgressFilledTrack style={styles.progressFilled} />
            </Progress>
          </Center>
        );

      case 'todosHeader':
        return (
          <VStack style={styles.todosHeader}>
            <HStack style={styles.headerRow}>
              <Heading style={styles.heading} size="2xl">
                {t('home.today_task')}
              </Heading>
              <Button style={styles.viewAllButton} onPress={() => router.push('/tabs/(tabs)/todos')}>
                <ButtonText style={styles.viewAllText}>{t('home.view_all')}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        );

      case 'todoList':
        return <TodoListView mode="flat" enableSwipeActions={true} />;

      case 'emptyState':
        return (
          <VStack style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('home.no_task')}</Text>
          </VStack>
        );

      default:
        return null;
    }
  }, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHTS[sections[index].type],
      offset: sections.slice(0, index).reduce((sum, section) => sum + ITEM_HEIGHTS[section.type], 0),
      index,
    }),
    [sections],
  );

  return (
    <Box style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </Box>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginTop: 12,
    height: 120,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 40,
    gap: 16,
    backgroundColor: Colors.main.primaryDark,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.main.textPrimary,
  },
  progressStats: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  statText: {
    color: Colors.main.textPrimary,
    fontSize: 16,
  },
  progressBar: {
    backgroundColor: Colors.main.background,
  },
  progressFilled: {
    backgroundColor: Colors.main.primary,
  },
  todosHeader: {
    marginTop: 20,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  heading: {
    color: Colors.main.textPrimary,
  },
  viewAllButton: {
    backgroundColor: 'transparent',
  },
  viewAllText: {
    color: Colors.main.textPrimary,
    fontSize: 14,
  },
  emptyState: {
    marginTop: 20,
    height: '100%',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
    fontSize: 18,
    color: Colors.main.textSecondary,
  },
});
