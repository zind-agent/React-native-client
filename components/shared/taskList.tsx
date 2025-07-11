import React, { memo } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Button } from '../ui/button';
import { Text } from '../Themed';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { Todo } from '@/storage/todoStorage';
import ScheduleCard from './scheduleCard';

const TaskList = memo(({ task }: { task: Todo[] }) => {
  const { language } = useAppStore();

  const renderHiddenItem = (_: any) => (
    <>
      <Button
        style={{
          backgroundColor: Colors.light.success,
          justifyContent: language === 'fa' ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          width: '50%',
          height: '90%',
          position: 'absolute',
          left: 0,
          borderRadius: 10,
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
          borderRadius: 10,
        }}
        onPress={() => {}}
        className="my-2"
      >
        <Text style={{ color: Colors.light.card, fontWeight: 'bold' }}>✖ {language === 'fa' ? 'لغو' : 'Cancel'}</Text>
      </Button>
    </>
  );

  return (
    <SwipeListView
      data={task}
      renderItem={({ item }) => <ScheduleCard style={{ padding: 10, borderRadius: 10 }} key={item.id} task={item} />}
      renderHiddenItem={renderHiddenItem}
      leftOpenValue={100}
      rightOpenValue={-100}
      disableLeftSwipe={false}
      disableRightSwipe={false}
      showsVerticalScrollIndicator={false}
    />
  );
});

export default TaskList;
