import React from 'react';
import { MotiView } from 'moti';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { TaskStatus } from '@/constants/TaskEnum';
import { Text } from '../Themed';
import { Task } from '@/storage/todoStorage';

interface HiddenItemProps {
  item: Task;
  swipedRows: Set<string>;
  onCompleteTask: (item: Task) => void;
  onCancelTask: (item: Task) => void;
}

const HiddenItem = React.memo(({ item, swipedRows, onCompleteTask, onCancelTask }: HiddenItemProps) => {
  const { language } = useAppStore();
  const isRowSwiped = swipedRows.has(item.id);

  if (!isRowSwiped) {
    return null;
  }

  return (
    <HStack className="w-full h-full items-center justify-center gap-1" style={{ flexDirection: language === 'fa' ? 'row-reverse' : 'row' }}>
      <MotiView
        className="w-1/2 h-[90%]"
        style={{
          justifyContent: 'center',
          alignItems: language === 'fa' ? 'flex-end' : 'flex-start',
          paddingHorizontal: 10,
        }}
        from={{
          opacity: 0,
          translateX: language === 'fa' ? 50 : -50,
        }}
        animate={{
          opacity: isRowSwiped ? 1 : 0,
          translateX: isRowSwiped ? 0 : language === 'fa' ? 50 : -50,
        }}
        transition={{
          type: 'timing',
          duration: 100,
        }}
      >
        <Button
          onPress={() => onCompleteTask(item)}
          disabled={item.status === TaskStatus.COMPLETED}
          className="h-full w-full"
          style={{
            backgroundColor: item.status === TaskStatus.COMPLETED ? Colors.main.border : Colors.main.primary,
            justifyContent: language === 'fa' ? 'flex-end' : 'flex-start',
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: Colors.main.textPrimary,
              fontSize: 12,
              textAlign: language === 'fa' ? 'left' : 'right',
              paddingHorizontal: 10,
            }}
          >
            ✔ {language === 'fa' ? 'تکمیل' : 'Done'}
          </Text>
        </Button>
      </MotiView>

      <MotiView
        className="w-1/2 h-[90%]"
        style={{
          justifyContent: 'center',
          alignItems: language === 'fa' ? 'flex-start' : 'flex-end',
          paddingHorizontal: 10,
        }}
        from={{
          opacity: 0,
          translateX: language === 'fa' ? -50 : 50,
        }}
        animate={{
          opacity: isRowSwiped ? 1 : 0,
          translateX: isRowSwiped ? 0 : language === 'fa' ? -50 : 50,
        }}
        transition={{
          type: 'timing',
          duration: 100,
        }}
      >
        <Button
          onPress={() => onCancelTask(item)}
          disabled={item.status === TaskStatus.CANCELLED}
          className="h-full w-full"
          style={{
            backgroundColor: item.status === TaskStatus.CANCELLED ? Colors.main.border : Colors.main.accent,
            justifyContent: language === 'fa' ? 'flex-start' : 'flex-end',
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: Colors.main.textPrimary,
              fontSize: 12,
              textAlign: language === 'fa' ? 'right' : 'left',
              paddingHorizontal: 10,
            }}
          >
            ✖ {language === 'fa' ? 'لغو' : 'Canceled'}
          </Text>
        </Button>
      </MotiView>
    </HStack>
  );
});

HiddenItem.displayName = 'HiddenItem';

export default HiddenItem;
