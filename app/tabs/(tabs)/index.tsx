import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { FlatList, Image, ListRenderItem, StyleSheet } from 'react-native';
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
import { Text } from '@/components/Themed';
import emptyTask from '@/assets/images/emptyHome.png';

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
  emptyState: 500,
};

const Home: React.FC = () => {
  const { loadPendingTodayTasks, pendingTodayTasks, getCompletionPercentage } = useTodoStore();
  const percentage = useMemo(() => getCompletionPercentage(), [getCompletionPercentage]);

  const hasTasks = useMemo(() => pendingTodayTasks && pendingTodayTasks.length > 0, [pendingTodayTasks]);

  useEffect(() => {
    loadPendingTodayTasks();
  }, [loadPendingTodayTasks]);

  const sections: HomeSection[] = useMemo(() => {
    const baseSections: HomeSection[] = [
      { id: 'header', type: 'header' },
      { id: 'addTodo', type: 'addTodo' },
    ];

    if (hasTasks) {
      return [...baseSections, { id: 'progress', type: 'progress' }, { id: 'todosHeader', type: 'todosHeader' }, { id: 'todoList', type: 'todoList' }];
    } else {
      return [...baseSections, { id: 'emptyState', type: 'emptyState' }];
    }
  }, [hasTasks]);

  const renderItem: ListRenderItem<HomeSection> = useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'header':
          return <UserHeaderTitle />;
        case 'addTodo':
          return <AddTodoInTime />;
        case 'progress':
          return (
            <Center style={styles.progressContainer} className="p-10 rounded-xl mt-6 gap-3">
              <Heading style={styles.progressText}>{t('home.today_progress_summery')}</Heading>
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
            <Center style={styles.emptyStateContainer}>
              <VStack style={styles.emptyState}>
                <Image source={emptyTask} style={{ height: 400, width: 400, objectFit: 'contain' }} />
                <Text style={styles.emptyStateText}>{t('home.no_data_message', 'هنوز هیچ تسکی برای امروز ندارید\nشروع کنید و اولین تسک خود را اضافه کنید!')}</Text>
              </VStack>
            </Center>
          );

        default:
          return null;
      }
    },
    [pendingTodayTasks.length, percentage, hasTasks],
  );

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
        contentContainerStyle={[styles.listContent, !hasTasks && styles.listContentEmpty]}
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
  listContentEmpty: {
    flexGrow: 1,
  },
  progressContainer: {
    height: 130,
    width: '100%',
    backgroundColor: Colors.main.cardBackground + 80,
    borderColor: Colors.main.textPrimary,
    borderWidth: 1,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
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
    backgroundColor: Colors.main.textPrimary + 40,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.main.textSecondary,
    marginBottom: 24,
  },
});
