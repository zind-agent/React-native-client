import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import emptyTaskImage from '@/assets/images/notTaskToday.png';

const EmptyTaskList = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/tabs/(tabs)/createTask')} activeOpacity={0.8}>
      <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}>
        <Image source={emptyTaskImage} style={{ width: 200, height: 200 }} />
        <Text style={styles.title}>{t('todos.create_your_task_for_now_time')}</Text>
      </MotiView>
    </TouchableOpacity>
  );
};

export default EmptyTaskList;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main.cardBackground,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.main.textPrimary,
    marginBottom: 20,
  },
});
