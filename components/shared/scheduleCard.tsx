import { HStack } from '@/components/ui/hstack';
import { Text, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Box } from '../ui/box';
import { Colors } from '@/constants/Colors';
import { tags as todoTags } from '@/constants/TodoAddTags';
import { Todo } from '@/storage/todoStorage';
import { Icon } from '../ui/icon';
import { ClockIcon } from '@/assets/Icons/Clock';
import { useDrawerStore } from '@/store/drawerState';
import DetailTaskTodo from './form/detailTodo';

interface ScheduleCardProps {
  task: Todo;
  onPress?: (task: Todo) => void;
  style?: StyleProp<ViewStyle>;
}

const ScheduleCard = ({ task, onPress, style }: ScheduleCardProps) => {
  const { setDetailDrawer, detailDrawer } = useDrawerStore();
  const handlePress = () => {
    if (onPress) {
      if (task.id != null) {
        setDetailDrawer();
      }
    }
  };

  const CardContent = () => (
    <Box className="min-w-56 min-h-[70px] w-max h-max mx-1 my-1 p-4 justify-between" style={[style]}>
      <Box
        className="px-2 mb-3"
        style={{
          borderColor: task.isCompleted ? Colors.main.primaryLight : Colors.main.primary,
          borderLeftWidth: 3,
        }}
      >
        <Text className="text-md mb-1" style={{ color: Colors.main.textSecondary }}>
          {task.title}
        </Text>
        <Text className={'text-sm font-semibold mb-1 ' + task.description == '' || task.description == null ? 'hidden' : 'none'}>{task.description}</Text>
      </Box>
      <HStack className="flex-wrap items-center gap-4" style={{ gap: 4 }}>
        <Icon as={ClockIcon} />
        <Text className="text-sm mb-2" style={{ color: Colors.main.textSecondary }}>
          {task.start_time} - {task.end_time}
        </Text>

        {task.tags.map((tag, idx) => {
          const tagColor = todoTags.find((t) => t.key === tag)?.color;
          return (
            <Badge key={idx} className="text-xs px-2 rounded-lg" variant="solid" style={{ backgroundColor: tagColor }}>
              <Text
                style={{
                  color: Colors.main.background,
                  fontSize: 10,
                }}
              >
                {tag}
              </Text>
            </Badge>
          );
        })}
      </HStack>
    </Box>
  );

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <CardContent />
      </Pressable>

      {detailDrawer && <DetailTaskTodo id={Number(task.id)} />}
    </>
  );
};

export default ScheduleCard;
