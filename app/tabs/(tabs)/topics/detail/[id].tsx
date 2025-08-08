import TrashIcon from '@/assets/Icons/TrushIcon';
import HeaderTitle from '@/components/common/headerTitle';
import { Loading } from '@/components/common/Loading';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Category } from '@/constants/Category';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useTopicStore } from '@/store/topcisState';
import { router, useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TopicDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { language } = useAppStore();
  const { getTopicById, topic, isLoading, removeTopic } = useTopicStore();

  useEffect(() => {
    getTopicById(id as string);
  }, [id]);

  if (topic === null || isLoading) return <Loading />;
  const category = Category.find((c) => c.id === topic?.category);

  const removeTopicHandler = () => {
    removeTopic(topic.id);
    router.push('/tabs/(tabs)/activity');
  };

  return (
    <GestureHandlerRootView style={styles.screenContainer}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <VStack space="xl">
          <HStack className="w-full justify-between items-center">
            <HeaderTitle title={topic.title} path={'../../activity'} />
            <Button className="flex mt-6 items-center justify-center w-12 h-12 rounded-lg bg-transparent" onPress={removeTopicHandler}>
              <TrashIcon size={48} />
            </Button>
          </HStack>

          <Box style={styles.mainCard} className="p-5 px-7">
            <Heading style={styles.headerTitle}>{t('task_detail.description')}</Heading>
            <Text className="mt-4 text-[14px]  rounded-lg px-4">{topic?.description || t('task_detail.no_description_todo')}</Text>
          </Box>

          <Box style={styles.mainCard} className="p-5 px-7">
            <Heading style={styles.headerTitle}>{t('task_detail.category')}</Heading>
            <Text className="mt-4 text-[14px] p-2 w-max rounded-lg px-5" style={{ backgroundColor: category?.color + '20' }}>
              {language === 'fa' ? category?.fa : category?.name}
            </Text>
          </Box>
          <HStack style={styles.mainCard} className="p-3 px-7 items-center justify-between">
            <Heading style={styles.headerTitle}>{t('activity.is_public')}</Heading>
            <Text className="text-[14px] p-2 rounded-lg px-5">{topic?.isPublic ? t('activity.yes') : t('activity.no')}</Text>
          </HStack>
        </VStack>
      </ScrollView>
      <Box className="px-5 mb-5">
        <Button className="h-16 rounded-lg" style={{ backgroundColor: Colors.main.button }} onPress={() => router.push(`/tabs/(tabs)/topics/edit/${id}`)}>
          <ButtonText className="text-xl">{t('button.edit')}</ButtonText>
        </Button>
      </Box>
    </GestureHandlerRootView>
  );
};

export default TopicDetail;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160,
  },
  mainCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  headerTitle: {
    color: Colors.main.textPrimary,
    fontSize: 16,
  },
});
