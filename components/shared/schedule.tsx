import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';

interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'Urgent' | 'Home' | 'Work' | 'Personal';
  color: string;
}

interface HourlyScheduleProps {
  selectedDate: string;
  tasks: Task[];
  onAddTask: (hour: number) => void;
  onTaskPress: (task: Task) => void;
}

const HourlySchedule = ({ tasks, onAddTask, onTaskPress }: HourlyScheduleProps) => {
  const categoryColors = {
    Urgent: '#FF6B6B',
    Home: '#4ECDC4',
    Work: '#45B7D1',
    Personal: '#96CEB4',
  };

  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0') + ':00';
  };

  const getTasksForHour = (hour: number) => {
    return tasks.filter((task) => {
      const taskHour = parseInt(task.startTime.split(':')[0]);
      return taskHour === hour;
    });
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <Pressable
      onPress={() => onTaskPress(task)}
      style={{
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: categoryColors[task.category],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <HStack className="items-center justify-between">
        <VStack className="flex-1">
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: Colors.light.darkBlue,
              marginBottom: 4,
            }}
          >
            {task.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.light.darkBlue,
              opacity: 0.7,
            }}
          >
            {task.startTime} - {task.endTime}
          </Text>
        </VStack>
        <Text
          style={{
            fontSize: 12,
            color: 'white',
            backgroundColor: categoryColors[task.category],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          {task.category}
        </Text>
      </HStack>
    </Pressable>
  );

  const EmptySlot = ({ hour }: { hour: number }) => (
    <Pressable
      onPress={() => onAddTask(hour)}
      style={{
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.light.light,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: Colors.light.light,
          marginBottom: 8,
        }}
      >
        {t('todos.any_schedule')}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: Colors.light.darkBlue,
          fontWeight: '600',
        }}
      >
        + {t('add')}
      </Text>
    </Pressable>
  );

  const HourRow = ({ hour }: { hour: number }) => {
    const hourTasks = getTasksForHour(hour);

    return (
      <HStack className="items-start" style={{ paddingVertical: 8 }}>
        <Box style={{ width: 60, paddingTop: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: Colors.light.darkBlue,
            }}
          >
            {formatHour(hour)}
          </Text>
        </Box>

        <Box style={{ flex: 1, paddingLeft: 16 }}>
          {hourTasks.length === 0 ? (
            <EmptySlot hour={hour} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
              {hourTasks.map((task, index) => (
                <View
                  key={task.id}
                  style={{
                    width: 280,
                    marginRight: index < hourTasks.length - 1 ? 12 : 0,
                  }}
                >
                  <TaskItem task={task} />
                </View>
              ))}
            </ScrollView>
          )}
        </Box>
      </HStack>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Box style={{ padding: 16 }}>
        {Array.from({ length: 24 }, (_, index) => (
          <View key={index}>
            <HourRow hour={index} />
            {index < 23 && (
              <Box
                style={{
                  height: 1,
                  backgroundColor: Colors.light.light,
                  marginVertical: 8,
                  marginLeft: 76,
                }}
              />
            )}
          </View>
        ))}
      </Box>
    </View>
  );
};

export default HourlySchedule;
