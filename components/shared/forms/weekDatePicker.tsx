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

const getJalaliMonthDays = (year: number, month: number): number => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  const isLeapYear = ((year - 979) % 33) % 4 === 1;
  return isLeapYear ? 30 : 29;
};

const jalaliToGregorian = (jYear: number, jMonth: number, jDay: number): string => {
  const jalaliDate = jalaliMoment(`${jYear}/${jMonth}/${jDay}`, 'jYYYY/jM/jD');
  return jalaliDate.format('YYYY-MM-DD');
};

const getJalaliDayName = (gregorianDate: string): string => {
  const dayIndex = jalaliMoment(gregorianDate).day();
  return weekdays[dayIndex].fa;
};

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate, year, month }: Props) => {
  const { calender, language } = useAppStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const today = jalaliMoment();
  const todayFormatted = today.format('YYYY-MM-DD');
  const currentMonth = calender === 'jalali' ? today.jMonth() + 1 : today.month() + 1;
  const currentYear = calender === 'jalali' ? today.jYear() : today.year();
  const isCurrentMonth = parseInt(year as string) === currentYear && parseInt(month as string) === currentMonth;

  const generateMonthDays = useMemo(() => {
    const days = [];
    const yearNum = parseInt(year as string);
    const monthNum = parseInt(month as string);

    if (calender === 'jalali') {
      const monthDays = getJalaliMonthDays(yearNum, monthNum);

      for (let day = 1; day <= monthDays; day++) {
        const gregorianDate = jalaliToGregorian(yearNum, monthNum, day);
        const dayName = getJalaliDayName(gregorianDate);
        const dayNumber = day.toString();

        const isToday = gregorianDate === todayFormatted;
        const isSelected = selectedDate === gregorianDate;

        days.push({
          date: gregorianDate,
          dayName,
          dayNumber,
          isToday,
          isSelected,
        });
      }
    } else {
      const endDate = new Date(yearNum, monthNum, 0);
      const monthDays = endDate.getDate();

      for (let day = 1; day <= monthDays; day++) {
        const date = new Date(yearNum, monthNum - 1, day);
        const gregorianDate = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = day.toString();

        const isToday = gregorianDate === todayFormatted;
        const isSelected = selectedDate === gregorianDate;

        days.push({
          date: gregorianDate,
          dayName,
          dayNumber,
          isToday,
          isSelected,
        });
      }
    }

    return days;
  }, [year, month, calender, selectedDate, todayFormatted]);

  const monthDays = generateMonthDays;
  const selectedDayIndex = selectedDate ? monthDays.findIndex((day) => day.date === selectedDate) : -1;

  const scrollToDay = (index: number, animated: boolean = true) => {
    if (scrollViewRef.current && index >= 0) {
      const itemWidth = 60;
      const scrollPosition = index * itemWidth;

      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: animated,
      });
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
    }, 50);
  };

  const canGoPrev = () => selectedDayIndex > 0;
  const canGoNext = () => selectedDayIndex < monthDays.length - 1 && selectedDayIndex !== -1;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isAnimating,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 50) {
            handleDayChange(calender === 'jalali' ? 'next' : 'prev');
          } else if (gestureState.dx < -50) {
            handleDayChange(calender === 'jalali' ? 'prev' : 'next');
          }
        },
      }),
    [isAnimating, selectedDayIndex, monthDays.length, calender],
  );

  useEffect(() => {
    if (isCurrentMonth && !isInitialized && monthDays.length > 0) {
      const todayIndex = monthDays.findIndex((day) => day.date === todayFormatted);

      if (todayIndex >= 0) {
        setSelectedDate(todayFormatted);
        setTimeout(() => {
          scrollToDay(todayIndex, false);
        }, 100);
        setIsInitialized(true);
      }
    }
  }, [monthDays, isCurrentMonth, todayFormatted, setSelectedDate, isInitialized]);
  useEffect(() => {
    if (selectedDayIndex >= 0 && isInitialized) {
      setTimeout(() => {
        scrollToDay(selectedDayIndex);
      }, 50);
    }
  }, [selectedDayIndex, isInitialized]);
  useEffect(() => {
    setIsInitialized(false);
  }, [year, month]);

  return (
    <Box style={{ direction: calender === 'jalali' ? 'rtl' : 'ltr' }}>
      <HStack className="items-center justify-between my-3">
        <Pressable
          onPress={() => handleDayChange(language === 'fa' ? 'next' : 'prev')}
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
            contentContainerStyle={{
              paddingHorizontal: 10,
              flexDirection: calender === 'jalali' ? 'row-reverse' : 'row',
            }}
            decelerationRate="fast"
            snapToInterval={60}
            snapToAlignment="center"
            style={{ direction: 'ltr' }}
            removeClippedSubviews={false}
          >
            <HStack className="gap-[1px]" space="xs" style={{ flexDirection: calender === 'jalali' ? 'row-reverse' : 'row' }}>
              {monthDays.map((day, index) => (
                <Pressable
                  key={`${day.date}-${index}`}
                  onPress={() => {
                    setSelectedDate(day.date);
                    setTimeout(() => scrollToDay(index), 50);
                  }}
                  style={{
                    backgroundColor: day.isSelected ? Colors.main.textPrimary : day.isToday && !day.isSelected ? Colors.main.primaryLight + '40' : 'transparent',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    width: 60,
                    height: 65,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: day.isToday && !day.isSelected ? 1 : 0,
                    borderColor: day.isToday && !day.isSelected ? Colors.main.primary : 'transparent',
                    marginHorizontal: 1,
                  }}
                >
                  <MotiView animate={{ scale: day.isSelected ? 1.1 : 0.8 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }}>
                    <VStack className="items-center">
                      <Text
                        style={{
                          color: day.isSelected ? Colors.main.background : Colors.main.textPrimary,
                          fontSize: 12,
                          textAlign: 'center',
                        }}
                      >
                        {day.dayName}
                      </Text>
                      <Text
                        style={{
                          color: day.isSelected ? Colors.main.background : Colors.main.textPrimary,
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
          onPress={() => handleDayChange(language === 'fa' ? 'prev' : 'next')}
          disabled={isAnimating || !canGoNext()}
          style={{
            opacity: isAnimating || !canGoNext() ? 0.5 : 1,
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
