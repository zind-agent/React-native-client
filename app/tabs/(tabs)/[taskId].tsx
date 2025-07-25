import HeaderTitle from '@/components/common/headerTitle';
import { ImageLoading } from '@/components/common/Loading';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { Task } from '@/storage/todoStorage';
import { useTodoStore } from '@/store/todoState';
import { router, useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Dimensions, Vibration } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MotiView, useAnimationState } from 'moti';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import { TaskStatus } from '@/constants/TaskEnum';
import { ArrowRightIcon } from '@/assets/Icons/ArrowRight';
import { Button } from '@/components/ui/button';
import { useShowToast } from '@/components/common/customToast';
import TrashIcon from '@/assets/Icons/TrushIcon';
import EditIcon from '@/assets/Icons/EditIcon';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.4;

const TaskDetail = () => {
  const { taskId } = useLocalSearchParams();
  const { getTaskById, updateTask, isLoading } = useTodoStore();
  const [task, setTask] = useState<Task | null>(null);
  const showToast = useShowToast();
  const [translateX, setTranslateX] = useState(0);

  const animationState = useAnimationState({
    idle: {
      translateX: 0,
      scale: 1,
    },
    scaleDown: {
      scale: 0.95,
    },
    scaleUp: {
      scale: 1,
    },
  });

  const fetchTask = useCallback(async () => {
    if (taskId) {
      const res = await getTaskById(taskId.toString());
      setTask(res);
    }
  }, [taskId, getTaskById]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleSwipeAction = async (action: TaskStatus.COMPLETED | TaskStatus.CANCELLED | TaskStatus.PENDING) => {
    if (!task) return;

    await updateTask({ ...task, status: action }).then(() => {
      showToast(action === TaskStatus.COMPLETED ? t('task_completed_successfully') : action === TaskStatus.CANCELLED ? t('task_cancelled_successfully') : t('task_pending_successfully'), 'success');
      router.push('/tabs/(tabs)/todos');
    });
    setTask({ ...task, status: action });
  };

  const handleEdit = () => {
    router.push(`/tabs/(tabs)/edit/${taskId}`);
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    setTranslateX(event.nativeEvent.translationX);
  };

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX: translateXValue } = event.nativeEvent;
      const swipeOptions = getSwipeOptions();

      if (translateXValue > SWIPE_THRESHOLD) {
        Vibration.vibrate(50);
        handleSwipeAction(swipeOptions.right.action);
        animationState.transitionTo('scaleDown');
        setTimeout(() => animationState.transitionTo('scaleUp'), 150);
      } else if (translateXValue < -SWIPE_THRESHOLD) {
        Vibration.vibrate(50);
        handleSwipeAction(swipeOptions.left.action);
        animationState.transitionTo('scaleDown');
        setTimeout(() => animationState.transitionTo('scaleUp'), 150);
      }
      setTranslateX(0);
    }
  };

  if (isLoading || isEmpty(task)) {
    return (
      <Box style={styles.screenContainer}>
        <ImageLoading />
      </Box>
    );
  }

  const StatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
      COMPLETED: {
        bg: Colors.main.success,
        text: Colors.main.textPrimary,
        label: t('status_enum.completed'),
        icon: '✓',
      },
      CANCELLED: {
        bg: Colors.main.accent,
        text: Colors.main.textPrimary,
        label: t('status_enum.canceled'),
        icon: '✕',
      },
      PENDING: {
        bg: Colors.main.primary,
        text: Colors.main.textPrimary,
        label: t('status_enum.pending'),
        icon: '⏳',
      },
    };

    const config = statusConfig[status] ?? statusConfig['PENDING'];

    return (
      <Box style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusText, { color: config.text }]}>
          {config.icon} {config.label}
        </Text>
      </Box>
    );
  };

  const uniqueTags = uniq(get(task, 'tags', []));
  const taskStatus = get(task, 'status', 'PENDING');

  const buttonBackgroundColor =
    {
      COMPLETED: Colors.main.success,
      CANCELLED: Colors.main.accent,
      PENDING: Colors.main.primary,
    }[taskStatus] || Colors.main.primary;

  // Determine swipe button labels and actions based on current task status
  const getSwipeOptions = () => {
    switch (taskStatus) {
      case TaskStatus.COMPLETED:
        return {
          left: { label: t('status_enum.canceled'), icon: '✕', color: Colors.main.accent, action: TaskStatus.CANCELLED },
          right: { label: t('status_enum.pending'), icon: '⏳', color: Colors.main.primary, action: TaskStatus.PENDING },
        };
      case TaskStatus.CANCELLED:
        return {
          left: { label: t('status_enum.pending'), icon: '⏳', color: Colors.main.primary, action: TaskStatus.PENDING },
          right: { label: t('status_enum.completed'), icon: '✓', color: Colors.main.success, action: TaskStatus.COMPLETED },
        };
      case TaskStatus.PENDING:
      default:
        return {
          left: { label: t('status_enum.canceled'), icon: '✕', color: Colors.main.accent, action: TaskStatus.CANCELLED },
          right: { label: t('status_enum.completed'), icon: '✓', color: Colors.main.success, action: TaskStatus.COMPLETED },
        };
    }
  };

  const swipeOptions = getSwipeOptions();

  return (
    <GestureHandlerRootView style={styles.screenContainer}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <VStack space="xl">
          <HStack className="w-full justify-between items-center">
            <HeaderTitle title={get(task, 'title', t('task_detail.no_title'))} path={'../(tabs)/'} />
            <Button className="flex mt-6 items-center justify-center w-12 h-12 rounded-lg bg-transparent" onPress={() => router.push('/tabs/(tabs)')}>
              <TrashIcon size={48} />
            </Button>
          </HStack>

          {/* Main Info Card */}
          <Box style={styles.mainCard}>
            <VStack space="lg">
              {/* Status */}
              <HStack className="justify-between items-center">
                <Text style={styles.sectionTitle}>{t('task_detail.status')}</Text>
                {StatusBadge(taskStatus)}
              </HStack>

              <Box style={styles.divider} />

              {/* Category & Goal */}
              <VStack space="md">
                <HStack className="justify-between items-center">
                  <Text style={styles.label}>{t('task_detail.category')}</Text>
                  <Text style={styles.value}>{get(task, 'categoryId', '') !== '' ? get(task, 'categoryId', '') : t('task_detail.no_category')}</Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text style={styles.label}>{t('task_detail.goal')}</Text>
                  <Text style={styles.value}>{get(task, 'goalId', '') !== '' ? get(task, 'goalId', '') : t('task_detail.no_goal')}</Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Tags Card */}
          <Box style={styles.card}>
            <Text style={styles.sectionTitle}>{t('task_detail.tags')}</Text>
            <HStack style={styles.tagsContainer}>
              {uniqueTags.length > 0 ? (
                uniqueTags.map((tag) => (
                  <Box key={tag} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </Box>
                ))
              ) : (
                <Text style={styles.emptyText}>{t('task_detail.no_tags')}</Text>
              )}
            </HStack>
          </Box>

          {/* Time Information */}
          <HStack className="justify-between gap-2">
            <Box style={[styles.timeCard, { flex: 1 }]}>
              <Text style={styles.timeLabel}>{t('task_detail.start_date')}</Text>
              <Text style={styles.timeValue}>{get(task, 'date', '-')}</Text>
            </Box>

            <Box style={[styles.timeCard, { flex: 1 }]}>
              <Text style={styles.timeLabel}>{t('task_detail.start_time')}</Text>
              <Text style={styles.timeValue}>{get(task, 'startTime', '-')}</Text>
            </Box>

            <Box style={[styles.timeCard, { flex: 1 }]}>
              <Text style={styles.timeLabel}>{t('task_detail.end_time')}</Text>
              <Text style={styles.timeValue}>{get(task, 'endTime', '-')}</Text>
            </Box>
          </HStack>

          {/* Description Card */}
          <Box style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>{t('task_detail.description')}</Text>
            <Box style={styles.descriptionContent}>
              <Text style={styles.descriptionText}>{get(task.description, 'description', t('task_detail.no_description_todo'))}</Text>
            </Box>
          </Box>
        </VStack>

        <Button style={styles.editButton} onPress={handleEdit}>
          <HStack style={styles.editButtonInner}>
            <Text style={styles.editButtonText}>{t('task_detail.need_edit')}</Text>
          </HStack>
          <EditIcon />
        </Button>
      </ScrollView>

      <Box style={styles.swipeAreaContainer}>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <MotiView
            state={animationState}
            style={[
              styles.swipeHandle,
              {
                transform: [{ translateX }],
                backgroundColor: buttonBackgroundColor,
              },
            ]}
          >
            <HStack style={styles.handleInner}>
              <HStack style={styles.swipeSection}>
                <Box className="rotate-180">
                  <ArrowRightIcon color={swipeOptions.left.color} />
                </Box>
                <Text style={[styles.handleText, { color: swipeOptions.left.color }]}>
                  {swipeOptions.left.icon} {swipeOptions.left.label}
                </Text>
              </HStack>
              <HStack style={styles.swipeSection}>
                <Text style={[styles.handleText, { color: swipeOptions.right.color }]}>
                  {swipeOptions.right.label} {swipeOptions.right.icon}
                </Text>
                <ArrowRightIcon color={swipeOptions.right.color} />
              </HStack>
            </HStack>
          </MotiView>
        </PanGestureHandler>
      </Box>
    </GestureHandlerRootView>
  );
};

export default TaskDetail;

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
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
  },
  timeCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.main.textPrimary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.main.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.main.textPrimary,
    textAlign: 'right',
    maxWidth: '60%',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.main.textSecondary,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    backgroundColor: Colors.main.primary + '20',
    borderColor: Colors.main.primary + '40',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.main.primary,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.main.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.main.textPrimary,
  },
  descriptionContent: {
    backgroundColor: Colors.main.background + '80',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.main.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.main.textSecondary + '20',
    marginVertical: 8,
  },
  editButton: {
    backgroundColor: Colors.main.background,
    borderRadius: 25,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    borderBottomColor: Colors.main.border,
    borderBottomWidth: 1,
  },
  editButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.main.textPrimary,
  },
  swipeAreaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeHandle: {
    height: 65,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  handleInner: {
    backgroundColor: Colors.main.cardBackground,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
  },
  swipeSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  handleText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
