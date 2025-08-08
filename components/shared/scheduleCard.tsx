import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text, Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { Box } from '../ui/box';
import { Colors } from '@/constants/Colors';
import { Icon } from '../ui/icon';
import { ClockIcon } from '@/assets/Icons/Clock';
import { Task } from '@/storage/todoStorage';
import { useAppStore } from '@/store/appState';
import { TaskStatus } from '@/constants/TaskEnum';

interface ScheduleCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  style?: StyleProp<ViewStyle>;
}

const ScheduleCard = ({ task, onPress, style }: ScheduleCardProps) => {
  const { language } = useAppStore();

  const handlePress = () => {
    if (onPress && task.id != null) {
      onPress(task);
    }
  };

  const getStatusConfig = () => {
    switch (task.status) {
      case TaskStatus.COMPLETED:
        return {
          borderColor: Colors.main.primary,
          backgroundColor: Colors.main.primary + '10',
          statusIcon: '✓',
          statusTextColor: Colors.main.primary,
        };
      case TaskStatus.CANCELLED:
        return {
          borderColor: Colors.main.accent,
          backgroundColor: Colors.main.accent + '10',
          statusIcon: '✗',
          statusTextColor: Colors.main.accent,
        };
      default:
        return {
          borderColor: Colors.main.textPrimary,
          backgroundColor: Colors.main.cardBackground,
          statusIcon: '○',
          statusTextColor: Colors.main.textSecondary,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getBorderStyle = () => {
    const isRTL = language === 'fa';
    return {
      [isRTL ? 'borderRightWidth' : 'borderLeftWidth']: 4,
      [isRTL ? 'borderRightColor' : 'borderLeftColor']: statusConfig.borderColor,
    };
  };

  const CardContent = () => (
    <Box style={[styles.cardContainer, getBorderStyle(), { backgroundColor: statusConfig.backgroundColor }, style]} className="min-w-56 min-h-[70px] w-max h-max p-4">
      <HStack style={styles.cardHeader}>
        <VStack style={{ flex: 1 }}>
          <Text style={styles.titleText} numberOfLines={2}>
            {task.title}
          </Text>
          {task.description && task.description !== '' && (
            <Text style={styles.descriptionText} numberOfLines={2}>
              {task.description}
            </Text>
          )}
        </VStack>

        <Box style={[styles.statusBadge, { backgroundColor: statusConfig.statusTextColor + '20' }]}>
          <Text style={[styles.statusIcon, { color: statusConfig.statusTextColor }]}>{statusConfig.statusIcon}</Text>
        </Box>
      </HStack>

      <HStack style={styles.cardFooter}>
        <HStack style={styles.timeContainer}>
          <Icon as={ClockIcon} size="sm" color={Colors.main.textSecondary} />
          <Text style={styles.timeText}>
            {task.startTime} - {task.endTime}
          </Text>
        </HStack>
      </HStack>

      {task.status === TaskStatus.PENDING && (
        <Box style={styles.progressIndicator}>
          <Box style={styles.progressBar} />
        </Box>
      )}
    </Box>
  );

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressableContainer,
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <CardContent />
    </Pressable>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  pressableContainer: {
    marginVertical: 4,
  },
  cardContainer: {
    minHeight: 85,
    marginHorizontal: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.main.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.main.textPrimary,
    lineHeight: 22,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.main.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  statusBadge: {
    width: 25,
    height: 25,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statusIcon: {
    fontSize: 14,
  },
  cardFooter: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeContainer: {
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: Colors.main.textSecondary,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.main.textPrimary + '20',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.main.primary,
    opacity: 0.6,
  },
});
