import { Drawer, DrawerBackdrop, DrawerContent, DrawerBody } from '@/components/ui/drawer';
import { Colors } from '@/constants/Colors';
import React, { memo, useEffect } from 'react';
import { useTodoStore } from '@/store/todoState';
import { useDrawerStore } from '@/store/drawerState';
import Loading from '../Loading';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/Themed';

interface EditTodoProps {
  id: number;
}

const DetailTaskTodo = memo(({ id }: EditTodoProps) => {
  const { getTodoById, todo } = useTodoStore();
  const { detailDrawer, setDetailDrawer } = useDrawerStore();

  useEffect(() => {
    if (id) {
      getTodoById(id.toString());
    }
  }, [id]);

  return (
    <Drawer isOpen={detailDrawer} onClose={setDetailDrawer} size="sm" anchor="bottom" className="bg-black/30">
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.main.cardBackground }} className="h-max rounded-t-[30px] border-t-0">
        {!todo && <Loading />}
        <DrawerBody>
          {todo && (
            <Box className="flex flex-col items-center justify-center gap-4 p-4">
              <Text className="text-xl font-bold" style={{ color: Colors.main.textPrimary }}>
                {todo.title}
              </Text>
              <Text className="text-sm" style={{ color: Colors.main.textSecondary }}>
                {todo.description}
              </Text>
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});

export default DetailTaskTodo;
