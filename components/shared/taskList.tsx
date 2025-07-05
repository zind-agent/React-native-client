import React from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Button } from '../ui/button';
import { Text } from '../Themed';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import TaskCard from './taskCard';

const tasks = [
  { id: '1', title: 'Design Meeting', startTime: '09:00', endTime: '10:00', tags: ['office', 'urgent'] },
  { id: '2', title: 'Code Review', startTime: '11:00', endTime: '12:00', tags: ['work'] },
  { id: '3', title: 'Lunch with Client', startTime: '13:00', endTime: '14:00', tags: ['home'] },
];

const TaskList: React.FC = () => {
  const { language } = useAppStore();

  const renderHiddenItem = (_: any) => (
    <React.Fragment>
      <Button
        style={{
          backgroundColor: Colors.light.success,
          justifyContent: language === 'fa' ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          width: '50%',
          height: '90%',
          position: 'absolute',
          left: 0,
          borderRadius: 20,
        }}
        onPress={() => {}}
        className="my-2"
      >
        <Text style={{ color: Colors.light.card, fontWeight: 'bold' }}>✔ {language === 'fa' ? 'تکمیل' : 'Complete'}</Text>
      </Button>
      <Button
        style={{
          backgroundColor: Colors.light.accent,
          justifyContent: language === 'fa' ? 'flex-start' : 'flex-end',
          alignItems: 'center',
          width: '50%',
          height: '90%',
          position: 'absolute',
          right: 0,
          borderRadius: 20,
        }}
        onPress={() => {}}
        className="my-2"
      >
        <Text style={{ color: Colors.light.card, fontWeight: 'bold' }}>✖ {language === 'fa' ? 'لغو' : 'Cancel'}</Text>
      </Button>
    </React.Fragment>
  );

  return (
    <SwipeListView
      data={tasks}
      renderItem={({ item }) => <TaskCard key={item.id} {...item} />}
      renderHiddenItem={renderHiddenItem}
      leftOpenValue={100}
      rightOpenValue={-100}
      disableLeftSwipe={false}
      disableRightSwipe={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TaskList;
