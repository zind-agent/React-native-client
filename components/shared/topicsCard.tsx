import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { HStack } from '../ui/hstack';
import { TaskIcon } from '@/assets/Icons/TaskIcon';
import { Box } from '../ui/box';
import { Topic } from '@/storage/topicStorage';
import { Category } from '@/constants/Category';

type TopicsCardProps = {
  color?: string;
  data?: Topic;
};

const TopicsCard: React.FC<TopicsCardProps> = ({ data }) => {
  const gradientColors: [string, string] = [Colors.main.cardBackground, Colors.main.background];
  const cateogry = Category[data?.category as any];

  return (
    <Box className="rounded-lg" style={[styles.container, { backgroundColor: cateogry.color }]}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="h-22 p-5" style={{ borderRadius: 16 }}>
        <Text style={styles.title} className="text-xl mb-1">
          {data?.title}
        </Text>
        <Text style={[styles.description, { display: data?.description ? 'flex' : 'none' }]} className="text-sm" numberOfLines={2} ellipsizeMode="tail">
          {data?.description}
        </Text>
      </LinearGradient>
      <HStack className="justify-between gap-2 items-center py-3 px-6">
        <Text className="text-md text-center" style={styles.title}>
          {cateogry.name}
        </Text>
        <HStack className="items-center gap-2">
          <TaskIcon color={Colors.main.textPrimary} size={20} />
          <Text className="text-lg" style={styles.title}>
            10
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default TopicsCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  title: {
    color: Colors.main.textPrimary,
  },
  description: {
    color: Colors.main.textSecondary,
  },
});
