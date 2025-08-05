import { HStack } from '@/components/ui/hstack';
import { Text, Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { Box } from '../ui/box';
import { Colors } from '@/constants/Colors';
import { Icon } from '../ui/icon';
import { ClockIcon } from '@/assets/Icons/Clock';
import { Task } from '@/storage/todoStorage';
import { useAppStore } from '@/store/appState';

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

  const styleBorderHandler = () => {
    if (task.status === 'COMPLETED') {
      return styles.textContainerIsCompleted;
    } else if (task.status === 'CANCELLED') {
      return styles.textContainerIsCancel;
    }
    return language === 'fa' ? styles.textRightContainer : styles.textLeftContainer;
  };

  const CardContent = () => (
    <Box className="min-w-56 min-h-[70px] w-max h-max mx-1 my-1 p-4  justify-between" style={[style, styleBorderHandler()]}>
      <Box className="px-2 mb-3" style={styleBorderHandler()}>
        <Text className="text-md mb-1" style={styles.titleStyle}>
          {task.title}
        </Text>
        {task.description && task.description !== '' && (
          <Text className="text-sm mb-1" style={styles.descriptionStyle}>
            {task.description}
          </Text>
        )}
      </Box>
      <HStack className="flex-wrap items-center gap-4" style={{ gap: 4 }}>
        <Icon as={ClockIcon} />
        <Text className="text-sm mb-2" style={{ color: Colors.main.textSecondary }}>
          {task.startTime} - {task.endTime}
        </Text>
      </HStack>
    </Box>
  );

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.8 : 1 }],
      })}
    >
      <CardContent />
    </Pressable>
  );
};

export default ScheduleCard;

const styles = StyleSheet.create({
  textLeftContainer: {
    borderColor: Colors.main.textPrimary,
    borderLeftWidth: 3,
  },
  textRightContainer: {
    borderColor: Colors.main.textPrimary,
    borderRightWidth: 3,
  },
  textContainerIsCompleted: {
    borderColor: Colors.main.primary,
    borderLeftWidth: 3,
  },
  textContainerIsCancel: {
    borderColor: Colors.main.accent,
    borderLeftWidth: 3,
  },
  titleStyle: {
    color: Colors.main.textPrimary,
  },
  descriptionStyle: {
    color: Colors.main.textSecondary,
  },
});
