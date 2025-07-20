import React, { memo, useEffect, useState } from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { PanResponder, Text } from 'react-native';
import { ArrowLeftIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import { useAppStore } from '@/store/appState';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { MotiView } from 'moti';
import { t } from 'i18next';
import jalaliMoment from 'jalali-moment';

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate }: Props) => {
  const { calender } = useAppStore();
  const [weekStartDate, setWeekStartDate] = useState(jalaliMoment().startOf('week'));
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = jalaliMoment(weekStartDate).add(i, 'days');
      let date, dayName, dayNumber;

      const persianWeekDaysShort = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];
      if (calender === 'jalali') {
        date = currentDay.format('jYYYY-jMM-jDD');
        dayNumber = currentDay.format('jD');
        const dayIndex = currentDay.day();
        dayName = persianWeekDaysShort[dayIndex];
      } else {
        date = currentDay.format('YYYY-MM-DD');
        dayName = currentDay.format('dd');
        dayNumber = currentDay.format('D');
      }

      days.push({ date, dayName, dayNumber });
    }
    return days;
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setWeekStartDate((prev) => (direction === 'next' ? jalaliMoment(prev).add(7, 'days') : jalaliMoment(prev).subtract(7, 'days')));
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isAnimating,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 80) handleWeekChange('prev');
      else if (gestureState.dx < -80) handleWeekChange('next');
    },
  });

  useEffect(() => {
    const today = calender === 'jalali' ? jalaliMoment().format('jYYYY-jMM-jDD') : jalaliMoment().format('YYYY-MM-DD');
    setSelectedDate(today);
  }, [calender, setSelectedDate]);

  const goToToday = () => {
    const today = jalaliMoment().startOf('week');
    if (!today.isSame(weekStartDate, 'week')) {
      setIsAnimating(true);
      setWeekStartDate(today);
      setAnimationKey((prev) => prev + 1);

      const todayDate = calender === 'jalali' ? jalaliMoment().format('YYYY-MM-DD') : jalaliMoment().format('YYYY-MM-DD');
      setSelectedDate(todayDate);

      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const isCurrentWeek = jalaliMoment().startOf('week').isSame(weekStartDate, 'week');

  return (
    <Box>
      <HStack className="items-center justify-between my-3">
        <Pressable onPress={() => handleWeekChange('prev')} disabled={isAnimating}>
          <MotiView animate={{ scale: isAnimating ? 0.8 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 150 }}>
            <Icon as={ArrowLeftIcon} size="md" color={Colors.main.primary} />
          </MotiView>
        </Pressable>

        <MotiView
          key={animationKey}
          from={{ opacity: 0, translateX: 30 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 100 }}
          {...panResponder.panHandlers}
          style={{ flex: 1 }}
        >
          <HStack className="justify-center gap-[1px]">
            {generateWeekDays().map((day) => (
              <Pressable
                key={day.date}
                onPress={() => setSelectedDate(day.date)}
                style={{
                  backgroundColor: selectedDate === day.date ? Colors.main.primary : 'transparent',
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  minWidth: 45,
                  minHeight: 65,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MotiView animate={{ scale: selectedDate === day.date ? 1.2 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }}>
                  <Text
                    style={{
                      color: selectedDate === day.date ? Colors.main.background : Colors.main.textPrimary,
                      fontSize: 16,
                      textAlign: 'center',
                    }}
                  >
                    {day.dayName}
                  </Text>
                  <Text
                    style={{
                      color: selectedDate === day.date ? Colors.main.background : Colors.main.textPrimary,
                      fontSize: 16,
                      textAlign: 'center',
                    }}
                  >
                    {day.dayNumber}
                  </Text>
                </MotiView>
              </Pressable>
            ))}
          </HStack>
        </MotiView>

        <Pressable onPress={() => handleWeekChange('next')} disabled={isAnimating}>
          <MotiView animate={{ scale: isAnimating ? 0.8 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 150 }}>
            <Icon as={ArrowRightIcon} size="md" color={Colors.main.primary} />
          </MotiView>
        </Pressable>
      </HStack>

      {!isCurrentWeek && (
        <Box className="items-center mt-2">
          <Pressable onPress={goToToday} disabled={isAnimating}>
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0, scale: isAnimating ? 0.95 : 1 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            >
              <Text
                style={{
                  color: Colors.main.textPrimary,
                  fontSize: 14,
                }}
              >
                {t('todos.today')}
              </Text>
              <Box
                style={{
                  height: 1,
                  backgroundColor: Colors.main.textPrimary,
                }}
              />
            </MotiView>
          </Pressable>
        </Box>
      )}
    </Box>
  );
});

export default WeeklyDatePicker;
