import React, { useEffect, useState } from 'react';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { PanResponder, Text } from 'react-native';
import { ArrowLeftIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import moment from 'moment-jalaali';
import { useAppStore } from '@/store/appState';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { MotiView } from 'moti';
import { t } from 'i18next';

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

const WeeklyDatePicker = ({ selectedDate, setSelectedDate }: Props) => {
  const { calender } = useAppStore();
  const [weekStartDate, setWeekStartDate] = useState(moment().startOf('week'));
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = calender === 'jalali' ? moment(weekStartDate).add(i, 'days').format('jYYYY-jMM-jDD') : moment(weekStartDate).add(i, 'days').format('YYYY-MM-DD');
      const dayName = calender === 'jalali' ? moment(weekStartDate).add(i, 'days').format('jdd') : moment(weekStartDate).add(i, 'days').format('dd');
      const dayNumber = calender === 'jalali' ? moment(weekStartDate).add(i, 'days').format('jD') : moment(weekStartDate).add(i, 'days').format('D');
      days.push({ date, dayName, dayNumber });
    }
    return days;
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setWeekStartDate((prev) => (direction === 'next' ? moment(prev).add(7, 'days') : moment(prev).subtract(7, 'days')));
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
    const today = calender === 'jalali' ? moment().format('jYYYY-jMM-jDD') : moment().format('YYYY-MM-DD');
    setSelectedDate(today);
  }, [calender]);

  const goToToday = () => {
    const today = moment().startOf('week');
    if (!today.isSame(weekStartDate, 'week')) {
      setIsAnimating(true);
      setWeekStartDate(today);
      setAnimationKey((prev) => prev + 1);

      const todayDate = calender === 'jalali' ? moment().format('jYYYY-jMM-jDD') : moment().format('YYYY-MM-DD');
      setSelectedDate(todayDate);

      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const isCurrentWeek = moment().startOf('week').isSame(weekStartDate, 'week');

  return (
    <Box>
      <HStack className="items-center justify-between my-3">
        <Pressable onPress={() => handleWeekChange('prev')} disabled={isAnimating}>
          <MotiView animate={{ scale: isAnimating ? 0.8 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 150 }}>
            <Icon as={ArrowLeftIcon} size="md" color={Colors.light.darkBlue} />
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
                  backgroundColor: selectedDate === day.date ? Colors.light.primary : 'transparent',
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  minWidth: 45,
                  minHeight: 65,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MotiView animate={{ scale: selectedDate === day.date ? 1.1 : 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }}>
                  <Text
                    style={{
                      color: selectedDate === day.date ? Colors.light.surface : Colors.light.darkBlue,
                      fontSize: 17,
                    }}
                  >
                    {day.dayName.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      color: selectedDate === day.date ? Colors.light.surface : Colors.light.darkBlue,
                      fontSize: 17,
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
            <Icon as={ArrowRightIcon} size="md" color={Colors.light.darkBlue} />
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
                  color: Colors.light.darkBlue,
                  fontSize: 14,
                }}
              >
                {t('todos.today')}
              </Text>
              <Box
                style={{
                  height: 1,
                  backgroundColor: Colors.light.darkBlue,
                }}
              />
            </MotiView>
          </Pressable>
        </Box>
      )}
    </Box>
  );
};

export default WeeklyDatePicker;
