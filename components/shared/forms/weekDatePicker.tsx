import React, { memo, useEffect, useMemo, useState, useRef } from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { PanResponder, ScrollView } from 'react-native';
import { ArrowLeftIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import { useAppStore } from '@/store/appState';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { MotiView } from 'moti';
import jalaliMoment from 'jalali-moment';
import { weekdays } from '@/constants/WeekEnum';
import { Text } from '@/components/Themed';

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  year?: string | undefined;
  month?: number | string | undefined;
}

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate, year, month }: Props) => {
  const { calender } = useAppStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isInitialRender = useRef(true);

  const today = jalaliMoment();
  const todayFormatted = today.format('YYYY-MM-DD');
  const currentMonth = calender === 'jalali' ? today.jMonth() + 1 : today.month() + 1;
  const currentYear = calender === 'jalali' ? today.jYear() : today.year();
  const isCurrentMonth = parseInt(year as string) === currentYear && parseInt(month as string) === currentMonth;
  const monthSafe = month as string;
  const monthStart =
    calender === 'jalali' ? jalaliMoment(`${year}-${month}-01`, 'jYYYY-jM-jD').startOf('day') : jalaliMoment(`${year}-${monthSafe.toString().padStart(2, '0')}-01`, 'YYYY-MM-DD').startOf('day');

  const monthEnd = calender === 'jalali' ? jalaliMoment(monthStart).endOf('jMonth').startOf('day') : jalaliMoment(monthStart).endOf('month').startOf('day');

  const generateMonthDays = () => {
    const days = [];
    const current = jalaliMoment(monthStart);

    while (current.isSameOrBefore(monthEnd)) {
      let date, dayName, dayNumber;

      if (calender === 'jalali') {
        date = current.format('YYYY-MM-DD');
        dayNumber = current.format('jD');
        const dayIndex = current.day();
        dayName = weekdays[dayIndex].fa;
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
    return calender === 'jalali' ? days.reverse() : days;
  };

  const monthDays = useMemo(() => generateMonthDays(), [year, month, calender, selectedDate, todayFormatted]);

  const selectedDayIndex = selectedDate ? monthDays.findIndex((day) => day.date === selectedDate) : -1;

  const scrollToDay = (index: number) => {
    if (scrollViewRef.current && index >= 0) {
      const itemWidth = 60; // عرض هر آیتم
      const scrollPosition = index * itemWidth; // حذف افست برای دقت بیشتر
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  const handleDayChange = (direction: 'prev' | 'next') => {
    if (isAnimating || selectedDayIndex === -1) return;
    let newIndex;
    if (direction === 'next') {
      newIndex = calender === 'jalali' ? selectedDayIndex - 1 : selectedDayIndex + 1;
    } else {
      newIndex = calender === 'jalali' ? selectedDayIndex + 1 : selectedDayIndex - 1;
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

  const canGoPrev = () => (calender === 'jalali' ? selectedDayIndex < monthDays.length - 1 : selectedDayIndex > 0);
  const canGoNext = () => (calender === 'jalali' ? selectedDayIndex > 0 : selectedDayIndex < monthDays.length - 1 && selectedDayIndex !== -1);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isAnimating,
        onPanResponderRelease: (_, gestureState) => {
          if (calender === 'jalali') {
            if (gestureState.dx > 50) handleDayChange('next');
            else if (gestureState.dx < -50) handleDayChange('prev');
          } else {
            if (gestureState.dx > 50) handleDayChange('prev');
            else if (gestureState.dx < -50) handleDayChange('next');
          }
        },
      }),
    [isAnimating, selectedDayIndex, monthDays.length, calender],
  );

  useEffect(() => {
    if (isCurrentMonth && isInitialRender.current) {
      // در رندر اولیه، به روز جاری اسکرول کن
      const todayIndex = monthDays.findIndex((day) => day.date === todayFormatted);
      if (todayIndex >= 0) {
        setSelectedDate(todayFormatted);
        setTimeout(() => scrollToDay(todayIndex), 100); // زمان کوتاه‌تر برای رندر اولیه
      }
      isInitialRender.current = false;
    } else if (selectedDayIndex >= 0) {
      // برای تغییرات بعدی
      setTimeout(() => scrollToDay(selectedDayIndex), 100);
    }
  }, [selectedDayIndex, year, month, todayFormatted, monthDays, isCurrentMonth, setSelectedDate]);

  return (
    <Box style={{ direction: calender === 'jalali' ? 'rtl' : 'ltr' }}>
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
            <Icon as={calender === 'jalali' ? ArrowRightIcon : ArrowLeftIcon} size="md" color={Colors.main.textPrimary} />
          </MotiView>
        </Pressable>

        <Box style={{ flex: 1, marginHorizontal: 10 }} {...panResponder.panHandlers}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, flexDirection: calender === 'jalali' ? 'row-reverse' : 'row' }}
            decelerationRate="fast"
            snapToInterval={60} // همگام با عرض آیتم
            snapToAlignment="center" // تغییر به center برای هم‌ترازی بهتر
            style={{ direction: 'ltr' }}
          >
            <HStack className="gap-[1px]" space="xs" style={{ flexDirection: calender === 'jalali' ? 'row-reverse' : 'row' }}>
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
                    width: 60,
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
                          fontSize: 12,
                          textAlign: 'center',
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
            <Icon as={calender === 'jalali' ? ArrowLeftIcon : ArrowRightIcon} size="md" color={Colors.main.textPrimary} />
          </MotiView>
        </Pressable>
      </HStack>
    </Box>
  );
});

export default WeeklyDatePicker;
