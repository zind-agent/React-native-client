import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Box } from '../ui/box';
import { Colors } from '@/constants/Colors';
import { tags as todoTags } from '@/constants/TodoAddTags';
import { Todo } from '@/storage/todoStorage';

interface ScheduleCardProps {
  task: Todo;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ScheduleCard = ({ task, onPress, style }: ScheduleCardProps) => {
  const CardContent = () => (
    <Card className="min-w-56 min-h-[80px] w-max mx-1 my-1" style={[{ backgroundColor: Colors.main.background, elevation: 2 }, style]}>
      <Box className="p-1">
        <HStack className="items-start px-2" style={{ borderLeftWidth: 1, borderColor: task.isCompleted ? Colors.main.primaryLight : Colors.main.primary }}>
          <VStack className="flex-1">
            <Text className="text-base font-semibold text-slate-800 mb-1">{task.title}</Text>
            <Text className="text-xs mb-2" style={{ color: Colors.main.primaryLight }}>
              {task.start_time} - {task.end_time}
            </Text>
            <HStack className="flex-wrap" style={{ gap: 4 }}>
              {task.tags.map((tag, idx) => (
                <Badge key={idx} className="text-xs px-2 rounded-md" variant="solid" style={{ backgroundColor: todoTags.find((t) => t.key === tag)?.color || Colors.main.tag.homeOpacity }}>
                  <Text
                    style={{
                      color: Colors.main.background,

                      fontSize: 8,
                    }}
                  >
                    {tag}
                  </Text>
                </Badge>
              ))}
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <CardContent />
      </Pressable>
    );
  }

  return <CardContent />;
};

export default ScheduleCard;
