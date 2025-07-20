import React, { useEffect } from 'react';
import SelectYearWithMonth from '@/components/shared/form/selectYearWithMonth';
import WeeklyDatePicker from '@/components/shared/form/weekDatePicker';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { useDateTime } from '@/hooks/useDateTime';
import { Box } from '@/components/ui/box';
import HeaderPage from '@/components/shared/headerPage';
import TodoListView from '@/components/shared/todoListView';
import { useTodoStore } from '@/store/todoState';

const Todos = () => {
  const { loadTodos } = useTodoStore();
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate } = useDateTime();

  useEffect(() => {
    loadTodos(selectedDate);
  }, [loadTodos]);

  return (
    <Box style={{ flex: 1, backgroundColor: 'white' }}>
      <Box
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          backgroundColor: 'white',
          zIndex: 1,
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <HeaderPage title={t('todos.todo_list')} />
        <VStack className="mt-5">
          <HStack className="items-center justify-between mb-2">
            <Heading
              style={{
                color: Colors.main.textSecondary,
                fontSize: 18,
              }}
            >
              {t('todos.day_of_week')}
            </Heading>
            <SelectYearWithMonth selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </HStack>
          <WeeklyDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </VStack>

        <HStack className="items-center justify-between mb-2 mt-5 pb-3">
          <Heading
            style={{
              color: Colors.main.textPrimary,
              fontSize: 20,
            }}
          >
            {t('todos.today')}
          </Heading>
          <Heading style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{selectedDate ?? '-'}</Heading>
        </HStack>
      </Box>
      <VStack>
        <TodoListView mode="grouped" />
      </VStack>
    </Box>
  );
};

export default Todos;
