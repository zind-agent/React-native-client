import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { FlatList, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import ScheduleCard from '../shared/scheduleCard';
import { Task } from '@/storage/todoStorage';
import { router } from 'expo-router';

interface HourlyRowProps {
  hour: string;
  tasks: any[];
  isCurrentHour?: boolean;
  onEditTask?: (task: Task) => void;
}

interface StyleType {
  contariner: ViewStyle;
  isCurrentHourContainer: ViewStyle;
  scrollView: ViewStyle;
  textStyle: TextStyle;
  isCurrentHourText: TextStyle;
  cardStyle: ViewStyle;
}

const HourlyRow = ({ hour, tasks, isCurrentHour = false }: HourlyRowProps) => {
  return (
    <VStack className="py-3 px-4" style={isCurrentHour ? style.isCurrentHourContainer : style.contariner}>
      <HStack className="items-start space-x-4">
        <Text className="w-14 text-left" style={isCurrentHour ? style.isCurrentHourText : style.textStyle}>
          {hour}
        </Text>

        <VStack className="flex-1">
          {
            <FlatList
              data={tasks}
              horizontal
              keyExtractor={(item) => item.id}
              style={style.scrollView}
              renderItem={({ item }) => <ScheduleCard task={item} onPress={() => router.push(`/tabs/(tabs)/${item.id}`)} style={style.cardStyle} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, alignItems: 'center' }}
              initialNumToRender={6}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews
              decelerationRate="fast"
              snapToAlignment="start"
              snapToInterval={150}
            />
          }
        </VStack>
      </HStack>
    </VStack>
  );
};

export default HourlyRow;

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
  cardStyle: {
    borderRadius: 10,
    backgroundColor: Colors.main.cardBackground,
    marginHorizontal: 6,
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
