import React, { memo, useEffect, useMemo, useState, useRef } from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { PanResponder, Text, ScrollView } from 'react-native';
import { ArrowLeftIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import { useAppStore } from '@/store/appState';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { MotiView } from 'moti';
import jalaliMoment from 'jalali-moment';

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  year?: string | string | undefined;
  month?: number | string | undefined;
}

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate, year, month }: Props) => {
  if (!year || !month) return null;

  const { calender } = useAppStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const today = jalaliMoment();
  const todayFormatted = calender === 'jalali' ? today.format('jYYYY-jMM-jDD') : today.format('YYYY-MM-DD');
  const currentMonth = calender === 'jalali' ? today.jMonth() + 1 : today.month() + 1;
  const currentYear = calender === 'jalali' ? today.jYear() : today.year();
  const isCurrentMonth = parseInt(year) === currentYear && parseInt(month.toString()) === currentMonth;
  const monthStart =
    calender === 'jalali' ? jalaliMoment(`${year}-${month}-01`, 'jYYYY-jM-jD').startOf('day') : jalaliMoment(`${year}-${month.toString().padStart(2, '0')}-01`, 'YYYY-MM-DD').startOf('day');

  const monthEnd = calender === 'jalali' ? jalaliMoment(monthStart).endOf('jMonth').startOf('day') : jalaliMoment(monthStart).endOf('month').startOf('day');

  const generateMonthDays = () => {
    const days = [];
    const current = jalaliMoment(monthStart);

    while (current.isSameOrBefore(monthEnd)) {
      let date, dayName, dayNumber;
      const persianWeekDaysShort = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];

      if (calender === 'jalali') {
        date = current.format('jYYYY-jMM-jDD');
        dayNumber = current.format('jD');
        const dayIndex = current.day();
        dayName = persianWeekDaysShort[dayIndex];
      } else {
        date = current.format('YYYY-MM-DD');
        dayName = current.format('dd');
        dayNumber = current.format('D');
      }

      const isToday = date === todayFormatted;
      const isSelected = selectedDate === date;

      days.push({
        date,
        dayName,
        dayNumber,
        isToday,
        isSelected,
      });

      current.add(1, 'day');
    }
    return days;
  };

  const monthDays = useMemo(() => generateMonthDays(), [year, month, calender, selectedDate, todayFormatted]);

  const selectedDayIndex = selectedDate ? monthDays.findIndex((day) => day.date === selectedDate) : -1;

  const scrollToDay = (index: number) => {
    if (scrollViewRef.current && index >= 0) {
      const itemWidth = 53;
      const scrollPosition = Math.max(0, index * itemWidth - 100);
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  const handleDayChange = (direction: 'prev' | 'next') => {
    if (isAnimating || selectedDayIndex === -1) return;
    let newIndex;
    if (direction === 'next') {
      newIndex = selectedDayIndex + 1;
    } else {
      newIndex = selectedDayIndex - 1;
    }
    if (newIndex < 0 || newIndex >= monthDays.length) return;

    const newDay = monthDays[newIndex];
    setIsAnimating(true);
    setSelectedDate(newDay.date);

    setTimeout(() => {
      scrollToDay(newIndex);
      setIsAnimating(false);
    }, 100);
  };

  const canGoPrev = () => selectedDayIndex > 0;
  const canGoNext = () => selectedDayIndex < monthDays.length - 1 && selectedDayIndex !== -1;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isAnimating,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 50) handleDayChange('prev');
          else if (gestureState.dx < -50) handleDayChange('next');
        },
      }),
    [isAnimating, selectedDayIndex, monthDays.length],
  );

  useEffect(() => {
    if (selectedDayIndex >= 0) {
      setTimeout(() => scrollToDay(selectedDayIndex), 300);
    }
  }, [selectedDayIndex, year, month]);

  return (
    <Box>
      <HStack className="items-center justify-between my-3">
        <Pressable
          onPress={() => handleDayChange('prev')}
          disabled={isAnimating || !canGoPrev()}
          style={{
            opacity: isAnimating || !canGoPrev() ? 0.3 : 1,
            zIndex: 2,
          }}
        >
          <MotiView animate={{ scale: isAnimating ? 0.8 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 150 }}>
            <Icon as={ArrowLeftIcon} size="md" color={Colors.main.textPrimary} />
          </MotiView>
        </Pressable>

        <Box style={{ flex: 1, marginHorizontal: 10 }} {...panResponder.panHandlers}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            decelerationRate="fast"
            snapToInterval={53}
            snapToAlignment="start"
          >
            <HStack className="gap-[1px]" space="xs">
              {monthDays.map((day, index) => (
                <Pressable
                  key={day.date}
                  onPress={() => {
                    setSelectedDate(day.date);
                    setTimeout(() => scrollToDay(index), 100);
                  }}
                  style={{
                    backgroundColor: day.isSelected ? Colors.main.textPrimary : day.isToday && !isCurrentMonth ? Colors.main.primaryLight + '40' : 'transparent',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    width: 52,
                    height: 65,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: day.isToday && isCurrentMonth && !day.isSelected ? 2 : 0,
                    borderColor: day.isToday && isCurrentMonth && !day.isSelected ? Colors.main.primary : 'transparent',
                    marginHorizontal: 1,
                  }}
                >
                  <MotiView animate={{ scale: day.isSelected ? 1.1 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }}>
                    <VStack className="items-center">
                      <Text
                        style={{
                          color: day.isSelected ? Colors.main.background : day.isToday && !isCurrentMonth ? Colors.main.textPrimary + '60' : Colors.main.textPrimary,
                          fontSize: 14,
                          textAlign: 'center',
                          fontWeight: day.isToday ? 'bold' : 'normal',
                        }}
                      >
                        {day.dayName}
                      </Text>
                      <Text
                        style={{
                          color: day.isSelected ? Colors.main.background : day.isToday && !isCurrentMonth ? Colors.main.textPrimary + '60' : Colors.main.textPrimary,
                          fontSize: 18,
                          textAlign: 'center',
                          fontWeight: day.isToday ? 'bold' : 'normal',
                          marginTop: 2,
                        }}
                      >
                        {day.dayNumber}
                      </Text>
                    </VStack>
                  </MotiView>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>
        </Box>

        <Pressable
          onPress={() => handleDayChange('next')}
          disabled={isAnimating || !canGoNext()}
          style={{
            opacity: isAnimating || !canGoNext() ? 0.3 : 1,
            zIndex: 2,
          }}
        >
          <MotiView animate={{ scale: isAnimating ? 0.8 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 150 }}>
            <Icon as={ArrowRightIcon} size="md" color={Colors.main.primary} />
          </MotiView>
        </Pressable>
      </HStack>
    </Box>
  );
});

export default WeeklyDatePicker;
