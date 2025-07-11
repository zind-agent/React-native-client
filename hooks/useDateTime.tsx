import { useState } from 'react';

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useDateTime = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentDateString = formatDateToString(currentDate);

  const [selectedYear, setSelectedYear] = useState<string | null>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string>(currentDateString);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
  };
};
