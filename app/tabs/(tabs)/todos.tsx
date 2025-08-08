import React, { useEffect, useCallback, useMemo } from 'react';
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
import { Image, StyleSheet } from 'react-native';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/Themed';
import emptyTaskImage from '@/assets/images/notTaskToday.png';
import { router } from 'expo-router';

const Todos = () => {
  const { loadTasks, tasks } = useTodoStore();
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate, isCurrentMonth, isToday, goToToday } = useDateTime();
  const { calender } = useAppStore();

  useEffect(() => {
    if (selectedDate) {
      loadTasks(selectedDate);
    }
  }, [loadTasks, selectedDate]);

  const weekComparison = useMemo(() => {
    if (!selectedDate) return { isCurrentWeek: false };

    const selectedWeekStart = jalaliMoment.utc(selectedDate, 'YYYY-MM-DD').startOf('week');
    const todayWeekStart = jalaliMoment.utc().startOf('week');
    const isCurrentWeek = selectedWeekStart.isSame(todayWeekStart, 'day');

    return { isCurrentWeek };
  }, [selectedDate]);

  const shouldShowTodayButton = useMemo(() => {
    return !weekComparison.isCurrentWeek || !isCurrentMonth || !isToday;
  }, [weekComparison.isCurrentWeek, isCurrentMonth, isToday]);

  const getDisplayDate = useCallback(
    (gregorianDate: string | null) => {
      if (!gregorianDate) return '-';

      try {
        const moment = jalaliMoment.utc(gregorianDate, 'YYYY-MM-DD');
        return calender === 'jalali' ? moment.format('jYYYY/jMM/jDD') : moment.format('YYYY/MM/DD');
      } catch (error) {
        console.warn('Error formatting date:', error);
        return '-';
      }
    },
    [calender],
  );

  const displayDate = useMemo(() => getDisplayDate(selectedDate), [getDisplayDate, selectedDate]);

  const EmptyTaskList = () => {
    return (
      <Center className="p-10" style={styles.emptyContainer}>
        <Image source={emptyTaskImage} style={{ width: 200, height: 200 }} />
        <Text className="text-xl">{t('todos.create_your_task_for_now_time')}</Text>
        <Button onPress={() => router.push('/tabs/(tabs)/createTask')} style={{ backgroundColor: Colors.main.tag.work }} className="px-10 text-xl mt-5 rounded-xl">
          <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{t('task_detail.add_task')}</ButtonText>
        </Button>
      </Center>
    );
  };

  const headerComponent = useMemo(
    () => (
      <Box style={styles.container}>
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
                <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{t('todos.go_to_today')}</ButtonText>
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
            {isToday ? t('todos.today') : t('todos.select_date')}
          </Heading>
          <Heading style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{displayDate}</Heading>
        </HStack>
      </Box>
    ),
    [selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate, shouldShowTodayButton, goToToday, isToday, displayDate],
  );

  return (
    <Box style={{ flex: 1, backgroundColor: Colors.main.background }}>
      {headerComponent}
      <VStack className="px-4">{tasks.length > 0 ? <TodoListView mode="grouped" /> : <EmptyTaskList />}</VStack>
    </Box>
  );
};

export default Todos;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.main.border,
  },
});
