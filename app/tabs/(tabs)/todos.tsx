import SelectYearWithMonth from '@/components/shared/form/selectYearWithMonth';
import WeeklyDatePicker from '@/components/shared/form/weekDatePicker';
import UserHeaderTitle from '@/components/shared/userHeaderTitle';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { useState } from 'react';
import { ScrollView } from 'react-native';

const Todos = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString();

  const [selectedYear, setSelectedYear] = useState<string | null>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <ScrollView className="flex-1 bg-white px-5">
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
    </ScrollView>
  );
};

export default Todos;
