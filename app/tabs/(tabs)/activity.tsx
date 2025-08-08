import Search from '@/components/shared/search';
import TopicListView from '@/components/shared/topicListView';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useTopicStore } from '@/store/topcisState';
import { router } from 'expo-router';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

const Activity = () => {
  const { loadUserTopics, loadPublicTopics, userTopics } = useTopicStore();
  const { user } = useAppStore();
  useEffect(() => {
    const userIdStr: string = user!.id.toString();
    loadUserTopics(userIdStr);
  }, [loadUserTopics, loadPublicTopics]);

  return (
    <Box style={styles.container}>
      <HStack className="items-center justify-between gap-4">
        <Heading style={styles.title} size="2xl">
          {t('activity.title')}
        </Heading>
        <Button className="rounded-lg px-7" style={styles.addButton} onPress={() => router.push('/tabs/(tabs)/createTopics')}>
          <Heading size="sm" style={styles.title}>
            {t('activity.add_topic')}
          </Heading>
        </Button>
      </HStack>
      <Search />
      <TopicListView data={userTopics} />
    </Box>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
    padding: 16,
  },
  title: {
    color: Colors.main.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.main.button,
  },
});
