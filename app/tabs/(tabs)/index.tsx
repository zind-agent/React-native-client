import React, { useEffect, useRef } from 'react';
import { CumpouterIcons } from '@/assets/Icons/ComputerIcons';
import { GradientCard } from '@/components/shared/gradientCard';
import TaskList from '@/components/shared/taskList';
import UserHeaderTitle from '@/components/shared/userHeaderTitle';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { FlatList } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appState';
import { useTodoStore } from '@/store/todoState';
import AddTodoInTime from '@/components/shared/form/addTodoInTime';

const Home: React.FC = () => {
  const { selectedDate } = useTodoStore();
  const { loadTodos, todos } = useTodoStore();
  useEffect(() => {
    loadTodos(selectedDate);
  }, [selectedDate]);
  const { setHideTabBar } = useAppStore();
  const lastOffset = useRef(0);

  return (
    <FlatList
      data={[{ key: 'content' }]}
      scrollsToTop={false}
      renderItem={() => (
        <Box className="px-5">
          <AddTodoInTime date={selectedDate} />
          <UserHeaderTitle />

          {/*  section one for my Card  */}
          <VStack className="mt-5">
            <GradientCard colors={[Colors.main.info, Colors.main.success]} height={140}>
              <CumpouterIcons />
              <VStack className="pr-5">
                <Heading style={{ color: Colors.main.background }} size="lg">
                  {t('home.completed')}
                </Heading>
                <Text className="text-center" style={{ color: Colors.main.background, fontSize: 17 }}>
                  0 {t('home.task')}
                </Text>
              </VStack>
            </GradientCard>
          </VStack>

          {/*  section two for today task  */}
          {todos.length === 0 ? (
            <VStack className="mt-5 mb-10 h-full">
              <Heading style={{ color: Colors.main.textSecondary }} size="2xl">
                {t('home.today_task')}
              </Heading>
              <Text className="text-center mt-10 px-10 text-lg" style={{ color: Colors.main.textSecondary }}>
                {t('home.no_task')}
              </Text>
            </VStack>
          ) : (
            <VStack className="mt-5 mb-10">
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
              <TaskList task={todos} />
            </VStack>
          )}
        </Box>
      )}
      showsVerticalScrollIndicator={false}
      onScroll={(e) => {
        const currentOffset = e.nativeEvent.contentOffset.y;
        const direction = currentOffset > lastOffset.current ? 'down' : 'up';
        lastOffset.current = currentOffset;

        if (direction === 'down' && currentOffset > 10) {
          setHideTabBar(true);
        } else if (direction === 'up') {
          setHideTabBar(false);
        }
      }}
      scrollEventThrottle={16}
    />
  );
};

export default Home;
