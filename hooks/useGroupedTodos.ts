import { Task } from '@/storage/todoStorage';
import { useMemo } from 'react';

export const useGroupedTodos = (todos: Task[]) => {
  return useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    todos.forEach((todo) => {
      const hour = todo.startTime?.split(':')[0] || '00';
      const hourLabel = `${hour.padStart(2, '0')}:00`;
      grouped[hourLabel] = grouped[hourLabel] || [];
      grouped[hourLabel].push(todo);
    });

    return Object.keys(grouped)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((hour) => ({
        hour,
        tasks: grouped[hour].sort((a, b) => {
          const getMinutes = (time: string) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
          };
          return getMinutes(a.startTime || '00:00') - getMinutes(b.startTime || '00:00');
        }),
      }));
  }, [todos]);
};
