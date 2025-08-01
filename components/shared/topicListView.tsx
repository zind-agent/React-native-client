import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Loading } from '../common/Loading';
import { useTopicStore } from '@/store/topcisState';
import { Topic } from '@/storage/topicStorage';
import TopicsCard from './topicsCard';

interface TopicListViewProps {
  data: Topic[];
}

const TopicListView = ({ data }: TopicListViewProps) => {
  const { isLoading } = useTopicStore();

  const renderItem = useCallback(({ item }: { item: Topic }) => <TopicsCard data={item} />, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
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
};

export default TopicListView;
