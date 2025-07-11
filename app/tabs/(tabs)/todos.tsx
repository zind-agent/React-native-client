import React from 'react';
import { View } from 'react-native';
import SelectYearWithMonth from '@/components/shared/form/selectYearWithMonth';
import WeeklyDatePicker from '@/components/shared/form/weekDatePicker';
import UserHeaderTitle from '@/components/shared/userHeaderTitle';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import ScheduleList from '@/components/shared/scheduleList';
import AddTodoInTime from '@/components/shared/form/addTodoInTime';
import { useDateTime } from '@/hooks/useDateTime';

const Todos = () => {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate } = useDateTime();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
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
        <UserHeaderTitle />
        <VStack className="mt-5">
          <HStack className="items-center justify-between mb-2">
            <Heading
              style={{
                color: Colors.light.darkBlue,
                fontSize: 28,
              }}
            >
              {t('todos.task')}
            </Heading>
            <SelectYearWithMonth selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </HStack>
          <WeeklyDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </VStack>

        <HStack className="items-center justify-between mb-2 mt-5 pb-3">
          <Heading
            style={{
              color: Colors.light.darkBlue,
              fontSize: 20,
            }}
          >
            {t('todos.today')}
          </Heading>
          <Heading style={{ color: Colors.light.darkBlue, fontSize: 16 }}>{selectedDate ?? '-'}</Heading>
        </HStack>
      </View>

      <VStack>
        <ScheduleList date={selectedDate} />
        <AddTodoInTime date={selectedDate} />
      </VStack>
    </View>
  );
};

export default Todos;
