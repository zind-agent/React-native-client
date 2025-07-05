import React, { useRef } from 'react';
import { ArrowRightIcon } from '@/assets/Icons/ArrowRight';
import { CancelIcon } from '@/assets/Icons/Cancel';
import { ClockIcon } from '@/assets/Icons/ClockIcon';
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
import { ArrowDownIcon, Icon } from '@/components/ui/icon';

const Home: React.FC = () => {
  const { setHideTabBar } = useAppStore();
  const [task, setTask] = React.useState<Number>(0);
  const lastOffset = useRef(0);

  return (
    <FlatList
      data={[{ key: 'content' }]}
      scrollsToTop={false}
      renderItem={() => (
        <Box className="px-5 bg-white">
          <UserHeaderTitle />

          {/*  section one for my Card  */}
          <VStack className="mt-5">
            <Heading style={{ color: Colors.light.darkBlue }} size="2xl" className="px-3">
              {t('home.my_task')}
            </Heading>
            <GradientCard colors={[Colors.light.info, Colors.light.success]} height={140}>
              <CumpouterIcons />
              <VStack className="pr-5">
                <Heading style={{ color: Colors.light.darkBlue }} size="lg">
                  {t('home.completed')}
                </Heading>
                <Text className="text-center" style={{ color: Colors.light.darkBlue, fontSize: 17 }}>
                  0 {t('home.task')}
                </Text>
              </VStack>
            </GradientCard>
            <HStack space="md" className="mt-3">
              <GradientCard colors={[Colors.light.accent, Colors.light.tag.home]} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }} width="50%" height={130}>
                <VStack space="sm" className="justify-start items-start">
                  <HStack className="justify-between items-center w-full">
                    <CancelIcon />
                    <ArrowRightIcon />
                  </HStack>
                  <VStack className="justify-between">
                    <Text className="text-center" style={{ color: Colors.light.card, fontSize: 16 }}>
                      {t('home.cancel')}
                    </Text>
                    <Text className="text-center" style={{ color: Colors.light.card, fontSize: 12 }}>
                      0 {t('home.task')}
                    </Text>
                  </VStack>
                </VStack>
              </GradientCard>
              <GradientCard colors={[Colors.light.primary, Colors.light.button]} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }} width="50%" height={130}>
                <VStack space="sm" className="justify-start items-start">
                  <HStack className="justify-between items-center w-full">
                    <ClockIcon />
                    <ArrowRightIcon />
                  </HStack>
                  <VStack className="justify-between">
                    <Text className="text-center" style={{ color: Colors.light.card, fontSize: 16 }}>
                      {t('home.pending')}
                    </Text>
                    <Text className="text-center" style={{ color: Colors.light.card, fontSize: 12 }}>
                      0 {t('home.task')}
                    </Text>
                  </VStack>
                </VStack>
              </GradientCard>
            </HStack>
          </VStack>

          {/*  section two for today task  */}
          {task === 0 ? (
            <VStack className="mt-5 mb-10 h-full">
              <Heading style={{ color: Colors.light.darkBlue }} size="2xl">
                {t('home.today_task')}
              </Heading>
              <Text className="text-center mt-10 px-10 text-2xl" style={{ color: Colors.light.subtext }}>
                {t('home.no_task')}
              </Text>
              <Icon className="mt-10 mx-auto" size="xl" as={ArrowDownIcon} color={Colors.light.subtext} />
            </VStack>
          ) : (
            <VStack className="mt-5 mb-10">
              <HStack className="justify-between items-center px-1">
                <Heading style={{ color: Colors.light.darkBlue }} size="2xl">
                  {t('home.today_task')}
                </Heading>
                <Button className="bg-transparent" onPress={() => router.push('/tabs/(tabs)/todos')}>
                  <ButtonText style={{ color: Colors.light.darkBlue }} className="text-sm">
                    {t('home.view_all')}
                  </ButtonText>
                </Button>
              </HStack>
              <TaskList />
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
