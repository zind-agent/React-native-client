import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Todo } from '@/storage/todoStorage';
import ScheduleCard from '../shared/scheduleCard';

interface HourlyRowProps {
  hour: string;
  tasks: any[];
  isCurrentHour?: boolean;
  onEditTask?: (task: Todo) => void;
}

interface StyleType {
  contariner: ViewStyle;
  isCurrentHourContainer: ViewStyle;
  scrollView: ViewStyle;
  textStyle: TextStyle;
  isCurrentHourText: TextStyle;
}

const style = StyleSheet.create<StyleType>({
  contariner: {
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomWidth: 1,
  },
  isCurrentHourContainer: {
    backgroundColor: Colors.main.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.main.textSecondary,
    borderBottomColor: Colors.main.textSecondary,
    borderBottomWidth: 1,
  },
  scrollView: {
    paddingRight: 16,
  },
  textStyle: {
    color: Colors.main.textPrimary,
    fontWeight: 600,
  },
  isCurrentHourText: {
    color: Colors.main.info,
    fontWeight: 700,
  },
});

const HourlyRow = ({ hour, tasks, isCurrentHour = false, onEditTask }: HourlyRowProps) => {
  const handleEditTask = (task: Todo) => {
    onEditTask?.(task);
  };

  return (
    <VStack className="py-3 px-4" style={isCurrentHour ? style.isCurrentHourContainer : style.contariner}>
      <HStack className="items-start space-x-4">
        <Text className="w-14 text-left" style={isCurrentHour ? style.isCurrentHourText : style.textStyle}>
          {hour}
        </Text>

        <VStack className="flex-1">
          {
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={style.scrollView}>
              <HStack className="space-x-3 items-center">
                {tasks.map((task, idx) => (
                  <ScheduleCard key={idx} task={task} onPress={handleEditTask} style={{ borderRadius: 10, backgroundColor: Colors.main.cardBackground }} />
                ))}
              </HStack>
            </ScrollView>
          }
        </VStack>
      </HStack>
    </VStack>
  );
};

export default HourlyRow;
