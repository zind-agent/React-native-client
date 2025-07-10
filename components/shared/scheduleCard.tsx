import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text, Pressable } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Box } from '../ui/box';
import { Colors } from '@/constants/Colors';
import { tags as todoTags } from '@/constants/TodoAddTags';

interface ScheduleCardProps {
  task: {
    id: string;
    title: string;
    tags: string[];
    start_time: string;
    end_time: string;
    date: string;
    isCompleted: boolean;
  };
  onPress?: () => void;
}

const ScheduleCard = ({ task, onPress }: ScheduleCardProps) => {
  const CardContent = () => (
    <Card className="min-w-56 w-max rounded-r-lg p-2 px-3 mx-1 my-1" style={{ backgroundColor: Colors.light.surface, elevation: 2 }}>
      <Box className="p-1">
        <HStack className="items-start px-2" style={{ borderLeftWidth: 1, borderColor: task.isCompleted ? Colors.light.light : Colors.light.primary }}>
          <VStack className="flex-1">
            <Text className="text-base font-semibold text-slate-800 mb-1">{task.title}</Text>
            <Text className="text-xs mb-2" style={{ color: Colors.light.light }}>
              {task.start_time} - {task.end_time}
            </Text>
            <HStack className="flex-wrap" style={{ gap: 4 }}>
              {task.tags.map((tag, idx) => (
                <Badge key={idx} className="text-xs px-2 rounded-md" variant="solid" style={{ backgroundColor: todoTags.find((t) => t.value === tag)?.color || Colors.light.tag.homeOpacity }}>
                  <Text
                    style={{
                      color: Colors.light.surface,

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
