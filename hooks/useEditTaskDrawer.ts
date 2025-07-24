import { useCallback } from 'react';
import _ from 'lodash';
import { useTodoStore } from '@/store/todoState';

export const useEditTaskDrawer = () => {
  const { editDrawer, openEditDrawerById } = useTodoStore();

  const openEditDrawer = useCallback(
    _.debounce((taskId?: string) => {
      if (!editDrawer && taskId) {
        openEditDrawerById({ taskId });
      }
    }, 300),
    [openEditDrawerById, editDrawer],
  );

  return { openEditDrawer };
};
