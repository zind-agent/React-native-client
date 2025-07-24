import { useMemo } from 'react';
import { Todo } from '@/storage/todoStorage';

export const useGroupedTodos = (todos: Todo[]) => {
  return useMemo(() => {
    const grouped: Record<string, Todo[]> = {};

    todos.forEach((todo) => {
      const hour = todo.start_time?.split(':')[0] || '00';
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
          return getMinutes(a.start_time || '00:00') - getMinutes(b.start_time || '00:00');
        }),
      }));
  }, [todos]);
};
