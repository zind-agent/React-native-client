import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { TaskIcon } from '@/assets/Icons/TaskIcon';
import { Topic } from '@/storage/topicStorage';
import { Category } from '@/constants/Category';
import { Pressable } from '../ui/pressable';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appState';
import { Text } from '../Themed';

type TopicsCardProps = {
  color?: string;
  data?: Topic;
};

const TopicsCard: React.FC<TopicsCardProps> = ({ data }) => {
  const { language } = useAppStore();
  const category = Category.find((c) => c.id === data?.category);
  const gradientColors: [string, string] = [Colors.main.background, Colors.main.cardBackground];

  return (
    <Pressable onPress={() => router.push(`/tabs/(tabs)/topics/detail/${data?.id}`)} style={styles.container}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {data?.title || 'Untitled Topic'}
            </Text>
            {data?.description && (
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {data.description}
              </Text>
            )}
          </View>

          <View style={[styles.categoryBadge, { backgroundColor: category?.color + '20' }]}>
            <View style={[styles.categoryDot, { backgroundColor: category?.color }]} />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.categoryTag, { backgroundColor: category?.color + '15' }]}>
            <Text style={[styles.categoryText, { color: category?.color }]}>{language === 'fa' ? category?.fa : category?.name}</Text>
          </View>

          <View style={styles.taskCounter}>
            <TaskIcon color={Colors.main.textSecondary} size={16} />
            <Text style={styles.taskCount}>10</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default TopicsCard;

const styles = StyleSheet.create({
  container: {
    height: 140,
    width: '100%',
  },
  gradient: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    marginVertical: 4,
    borderColor: Colors.main.border,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.main.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.main.textSecondary,
    lineHeight: 20,
    opacity: 0.8,
  },
  categoryBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  taskCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.main.textSecondary,
  },
});
