import React from 'react';
import { MotiView } from 'moti';
import { Colors } from '@/constants/Colors';
import { Todo } from '@/storage/todoStorage';
import { useAppStore } from '@/store/appState';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';

interface HiddenItemProps {
  item: Todo;
  swipedRows: Set<string>;
  onCompleteTask: (item: Todo) => void;
  onCancelTask: (item: Todo) => void;
}

const HiddenItem = React.memo(({ item, swipedRows, onCompleteTask, onCancelTask }: HiddenItemProps) => {
  const { language } = useAppStore();
  const isRowSwiped = swipedRows.has(item.id);

  if (!isRowSwiped) {
    return null;
  }

  return (
    <HStack className="w-full h-full items-center justify-center gap-1">
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
          disabled={item.isCompleted || item.isCancel}
          className="h-full w-full"
          style={{
            backgroundColor: Colors.main.success,
            justifyContent: language === 'fa' ? 'flex-end' : 'flex-start',
            borderRadius: 10,
          }}
        >
          <ButtonText
            style={{
              color: Colors.main.cardBackground,
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: language === 'fa' ? 'right' : 'left',
              paddingHorizontal: 10,
            }}
          >
            ✔ {language === 'fa' ? 'تکمیل' : 'Done'}
          </ButtonText>
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
          disabled={item.isCompleted || item.isCancel}
          className="h-full w-full"
          style={{
            backgroundColor: Colors.main.accent,
            justifyContent: language === 'fa' ? 'flex-start' : 'flex-end',
            borderRadius: 10,
          }}
        >
          <ButtonText
            style={{
              color: Colors.main.cardBackground,
              fontWeight: 'bold',
              fontSize: 12,
              textAlign: language === 'fa' ? 'left' : 'right',
              paddingHorizontal: 10,
            }}
          >
            ✖ {language === 'fa' ? 'لغو' : 'Cancel'}
          </ButtonText>
        </Button>
      </MotiView>
    </HStack>
  );
});

HiddenItem.displayName = 'HiddenItem';

export default HiddenItem;
