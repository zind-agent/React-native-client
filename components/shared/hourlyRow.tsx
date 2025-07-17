import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from 'react-native';
import { ScrollView } from 'react-native';
import ScheduleCard from './scheduleCard';
import { Colors } from '@/constants/Colors';

interface HourlyRowProps {
  hour: string;
  tasks: any[];
  isCurrentHour?: boolean;
}

const HourlyRow = ({ hour, tasks, isCurrentHour = false }: HourlyRowProps) => {
  return (
    <VStack
      className="border-b border-slate-200 py-3 px-4"
      style={{
        backgroundColor: isCurrentHour ? Colors.main.background : 'transparent',
        borderLeftWidth: isCurrentHour ? 3 : 0,
        borderLeftColor: isCurrentHour ? Colors.main.info : 'transparent',
      }}
    >
      <HStack className="items-start space-x-4">
        <Text
          className="text-slate-800 font-semibold text-base w-14 text-left"
          style={{
            color: isCurrentHour ? Colors.main.info : Colors.maintextPrimary,
            fontWeight: isCurrentHour ? '700' : '600',
          }}
        >
          {hour}
        </Text>

        <VStack className="flex-1">
          {
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
              <HStack className="space-x-3 items-center">
                {tasks.map((task, idx) => (
                  <ScheduleCard key={idx} task={task} style={{ borderRadius: 12 }} />
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
