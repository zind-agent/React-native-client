import React, { useEffect } from 'react';
import SelectYearWithMonth from '@/components/shared/forms/selectYearWithMonth';
import WeeklyDatePicker from '@/components/shared/forms/weekDatePicker';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { useDateTime } from '@/hooks/useDateTime';
import { Box } from '@/components/ui/box';
import TodoListView from '@/components/shared/todoListView';
import { useTodoStore } from '@/store/todoState';
import jalaliMoment from 'jalali-moment';
import { useAppStore } from '@/store/appState';
import { Button, ButtonText } from '@/components/ui/button';
import HeaderPage from '@/components/common/headerPage';

const Todos = () => {
  const { loadTasks } = useTodoStore();
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate } = useDateTime();
  const { calender } = useAppStore();

  useEffect(() => {
    loadTasks(selectedDate);
  }, [loadTasks, selectedDate]);

  const today = jalaliMoment();
  const todayDate = calender === 'jalali' ? today.format('jYYYY-jMM-jDD') : today.format('YYYY-MM-DD');
  const todayYear = calender === 'jalali' ? today.jYear().toString() : today.year().toString();
  const todayMonth = calender === 'jalali' ? (today.jMonth() + 1).toString() : (today.month() + 1).toString();
  const selectedWeekStart = selectedDate ? (calender === 'jalali' ? jalaliMoment(selectedDate, 'jYYYY-jMM-jDD').startOf('week') : jalaliMoment(selectedDate, 'YYYY-MM-DD').startOf('week')) : null;
  const todayWeekStart = calender === 'jalali' ? jalaliMoment().startOf('week') : jalaliMoment().startOf('week');
  const isCurrentWeek = selectedWeekStart && selectedWeekStart.isSame(todayWeekStart, 'day');
  const isCurrentMonth = selectedYear === todayYear && selectedMonth === todayMonth;
  const isToday = selectedDate === todayDate;

  const goToToday = () => {
    setSelectedYear(todayYear);
    setSelectedMonth(todayMonth);
    setSelectedDate(todayDate);
  };

  const shouldShowTodayButton = !isCurrentWeek || !isCurrentMonth || !isToday;

  return (
    <Box style={{ flex: 1, backgroundColor: Colors.main.background }}>
      <Box
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
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

          <WeeklyDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} year={selectedYear ?? undefined} month={selectedMonth ?? undefined} />

          {shouldShowTodayButton && (
            <Box className="items-center mt-3">
              <Button variant="link" onPress={goToToday}>
                <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{t('todos.today')}</ButtonText>
              </Button>
            </Box>
          )}
        </VStack>

        <HStack className="items-center justify-between mb-2 mt-5 pb-3">
          <Heading
            style={{
              color: Colors.main.textPrimary,
              fontSize: 20,
            }}
          >
            {isToday ? t('todos.today') : t('todos.selected_date')}
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
