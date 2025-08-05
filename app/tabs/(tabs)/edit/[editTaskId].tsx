import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { useTodoStore } from '@/store/todoState';
import { t } from 'i18next';
import { useTodoForm } from '@/hooks/useTodoForm';
import { Box } from '@/components/ui/box';
import { TodoBasicFields } from '@/components/shared/forms/todoBaseField';
import { TodoAdvancedFields } from '@/components/shared/forms/todoAdvancedField';
import HeaderTitle from '@/components/common/headerTitle';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useLocalSearchParams } from 'expo-router';
import { Task } from '@/storage/todoStorage';

const EditTask = () => {
  const { taskId } = useLocalSearchParams();
  const { getTaskById, updateTask } = useTodoStore();
  const [initialTask, setInitialTask] = useState<Task | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch task data
  const fetchTask = useCallback(async () => {
    if (taskId) {
      const task = await getTaskById(taskId.toString());
      setInitialTask(task);
    }
  }, [taskId, getTaskById]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const { form, onSubmit } = useTodoForm(initialTask?.date, {
    defaultValues: initialTask
      ? {
          title: initialTask.title || '',
          date: initialTask.date || '',
          startTime: initialTask.startTime || '',
          endTime: initialTask.endTime || '',
          reminderDays: initialTask.reminderDays || [],
          description: initialTask.description || '',
        }
      : undefined,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  // Handle form submission for updating task
  const handleUpdate = async (data: any) => {
    if (!taskId || !initialTask) return;
    await updateTask({ ...initialTask, ...data, id: taskId.toString() });
    onSubmit(data);
  };

  if (!initialTask) {
    return (
      <Box style={styles.container}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </Box>
    );
  }

  return (
    <LinearGradient colors={[Colors.main.background, Colors.main.background + 'D0']} style={styles.gradientContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Box style={styles.container}>
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
          <HeaderTitle title={t('edit_task.edit_task')} path={'../(tabs)/'} />
        </MotiView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }} style={styles.formContainer}>
              <TodoBasicFields control={control} errors={errors} startTime={startTime} endTime={endTime} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />

              <Box style={styles.divider} />

              <TodoAdvancedFields control={control} />
            </MotiView>
          </ScrollView>

          <Box style={styles.buttonContainer}>
            <LinearGradient colors={[Colors.main.primary, Colors.main.primary + 'B0']} style={styles.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MotiView from={{ scale: 1 }} animate={{ scale: 1.02 }} transition={{ type: 'spring', damping: 20, stiffness: 300, loop: true, delay: 1000 }}>
                <Button onPress={handleSubmit(handleUpdate)} style={styles.buttonStyle}>
                  <ButtonText style={styles.buttonText}>{t('update')}</ButtonText>
                </Button>
              </MotiView>
            </LinearGradient>
          </Box>
        </KeyboardAvoidingView>
      </Box>
    </LinearGradient>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: Colors.main.cardBackground + '90',
    borderRadius: 28,
    padding: 24,
    marginVertical: 20,
    shadowColor: Colors.main.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: Colors.main.primary + '30',
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.main.primaryLight + '40',
    marginVertical: 24,
    marginHorizontal: 12,
    borderRadius: 2,
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: Colors.main.background + '80',
    borderRadius: 24,
    shadowColor: Colors.main.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.main.primaryLight + '20',
  },
  gradientButton: {
    borderRadius: 24,
    shadowColor: Colors.main.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 14,
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 68,
    borderRadius: 24,
  },
  buttonText: {
    color: Colors.main.textPrimary,
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 0.8,
  },
  loadingText: {
    color: Colors.main.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
