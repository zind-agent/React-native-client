import React, { memo, useEffect, useMemo, useState, useRef, useCallback } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  year?: string | undefined;
  month?: number | string | undefined;
}

const dateCache = new Map<string, any>();

const getJalaliMonthDays = (year: number, month: number): number => {
  const cacheKey = `jalali-days-${year}-${month}`;
  if (dateCache.has(cacheKey)) {
    return dateCache.get(cacheKey);
  }

  let days;
  if (month <= 6) {
    days = 31;
  } else if (month <= 11) {
    days = 30;
  } else {
    const isLeapYear = ((year - 979) % 33) % 4 === 1;
    days = isLeapYear ? 30 : 29;
  }

  dateCache.set(cacheKey, days);
  return days;
};

const jalaliToGregorian = (jYear: number, jMonth: number, jDay: number): string => {
  const cacheKey = `j2g-${jYear}-${jMonth}-${jDay}`;
  if (dateCache.has(cacheKey)) {
    return dateCache.get(cacheKey);
  }

  const jalaliDate = jalaliMoment.utc(`${jYear}/${jMonth}/${jDay}`, 'jYYYY/jM/jD');
  const gregorianDate = jalaliDate.format('YYYY-MM-DD');

  dateCache.set(cacheKey, gregorianDate);
  return gregorianDate;
};

const getJalaliDayName = (gregorianDate: string): string => {
  const cacheKey = `jalali-day-name-${gregorianDate}`;
  if (dateCache.has(cacheKey)) {
    return dateCache.get(cacheKey);
  }

  const dayIndex = jalaliMoment.utc(gregorianDate, 'YYYY-MM-DD').day();
  const dayName = weekdays[dayIndex].fa;

  dateCache.set(cacheKey, dayName);
  return dayName;
};

const getGregorianDayName = (gregorianDate: string): string => {
  const cacheKey = `gregorian-day-name-${gregorianDate}`;
  if (dateCache.has(cacheKey)) {
    return dateCache.get(cacheKey);
  }

  const date = new Date(gregorianDate + 'T12:00:00'); // Add time to avoid timezone issues
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  dateCache.set(cacheKey, dayName);
  return dayName;
};

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate, year, month }: Props) => {
  const { calender, language } = useAppStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const today = jalaliMoment.utc();
  const todayFormatted = today.format('YYYY-MM-DD');
  const currentMonth = calender === 'jalali' ? today.jMonth() + 1 : today.month() + 1;
  const currentYear = calender === 'jalali' ? today.jYear() : today.year();
  const isCurrentMonth = parseInt(year as string) === currentYear && parseInt(month as string) === currentMonth;

  const generateMonthDays = useMemo(() => {
    const cacheKey = `month-days-${calender}-${year}-${month}-${todayFormatted}-${selectedDate}`;
    if (dateCache.has(cacheKey)) {
      return dateCache.get(cacheKey);
    }

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
      const monthDays = new Date(yearNum, monthNum, 0).getDate();

      for (let day = 1; day <= monthDays; day++) {
        const date = new Date(yearNum, monthNum - 1, day, 12, 0, 0);
        const gregorianDate = date.toISOString().split('T')[0];
        const dayName = getGregorianDayName(gregorianDate);
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

    setTimeout(() => dateCache.delete(cacheKey), 5 * 60 * 1000);
    dateCache.set(cacheKey, days);
    return days;
  }, [year, month, calender, selectedDate, todayFormatted]);

  const monthDays = generateMonthDays;
  const selectedDayIndex = selectedDate ? monthDays.findIndex((day: any) => day.date === selectedDate) : -1;

  const scrollToDay = useCallback((index: number, animated: boolean = true) => {
    if (scrollViewRef.current && index >= 0) {
      const itemWidth = 55;
      const scrollPosition = index * itemWidth;

      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: animated,
      });
    }
  }, []);

  const handleDayChange = useCallback(
    (direction: 'prev' | 'next') => {
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
    },
    [isAnimating, selectedDayIndex, monthDays, setSelectedDate, scrollToDay],
  );

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
    [isAnimating, handleDayChange, calender],
  );

  useEffect(() => {
    if (isCurrentMonth && !isInitialized && monthDays.length > 0) {
      const todayIndex = monthDays.findIndex((day: any) => day.date === todayFormatted);

      if (todayIndex >= 0) {
        setSelectedDate(todayFormatted);
        setTimeout(() => {
          scrollToDay(todayIndex, false);
          setIsInitialized(true);
        }, 100);
      }
    }
  }, [monthDays, isCurrentMonth, todayFormatted, setSelectedDate, isInitialized, scrollToDay]);

  useEffect(() => {
    if (selectedDayIndex >= 0 && isInitialized) {
      setTimeout(() => {
        scrollToDay(selectedDayIndex);
      }, 50);
    }
  }, [selectedDayIndex, isInitialized, scrollToDay]);

  useEffect(() => {
    setIsInitialized(false);
  }, [year, month]);

  useEffect(() => {
    return () => {
      dateCache.clear();
    };
  }, [calender]);

  const onDayPress = useCallback(
    (day: any, index: number) => {
      setSelectedDate(day.date);
      setTimeout(() => scrollToDay(index), 50);
    },
    [setSelectedDate, scrollToDay],
  );

  return (
    <Box
      style={{
        direction: calender === 'jalali' ? 'rtl' : 'ltr',
        paddingVertical: 8,
        paddingHorizontal: 6,
        backgroundColor: Colors.main.background,
        borderRadius: 16,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <HStack className="items-center justify-between">
        <MotiView
          animate={{
            scale: canGoPrev() ? 1 : 0.8,
            opacity: canGoPrev() ? 1 : 0.4,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <Pressable
            onPress={() => handleDayChange(language === 'fa' ? 'next' : 'prev')}
            disabled={isAnimating || !canGoPrev()}
            style={{
              backgroundColor: canGoPrev() ? Colors.main.primary + '15' : Colors.main.textSecondary + '15',
              borderRadius: 8,
              padding: 8,
              minWidth: 36,
              minHeight: 36,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MotiView
              animate={{
                scale: isAnimating ? 0.8 : 1,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            >
              <Icon as={calender === 'jalali' ? ArrowRightIcon : ArrowLeftIcon} size="sm" color={canGoPrev() ? Colors.main.primary : Colors.main.textSecondary} />
            </MotiView>
          </Pressable>
        </MotiView>

        <Box style={{ flex: 1, marginHorizontal: 8 }} {...panResponder.panHandlers}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              flexDirection: calender === 'jalali' ? 'row-reverse' : 'row',
              alignItems: 'center',
            }}
            decelerationRate="fast"
            snapToInterval={55}
            snapToAlignment="center"
            style={{ direction: 'ltr' }}
            removeClippedSubviews={true}
          >
            <HStack className="gap-[4px]" space="xs" style={{ flexDirection: calender === 'jalali' ? 'row-reverse' : 'row' }}>
              {monthDays.map((day: any, index: any) => (
                <MotiView
                  key={`${day.date}-${index}`}
                  animate={{
                    scale: day.isSelected ? 1.02 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    mass: 0.5,
                  }}
                >
                  <Pressable
                    onPress={() => onDayPress(day, index)}
                    style={{
                      width: 55,
                      height: 64,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginHorizontal: 2,
                      overflow: 'hidden',
                      shadowColor: day.isSelected ? Colors.main.primary : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: day.isSelected ? 0.2 : 0,
                      shadowRadius: 4,
                      elevation: day.isSelected ? 6 : 1,
                    }}
                  >
                    {day.isSelected ? (
                      <LinearGradient
                        colors={[Colors.main.primary, Colors.main.primaryLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: 12,
                        }}
                      />
                    ) : day.isToday ? (
                      <Box
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: Colors.main.primary + '12',
                          borderRadius: 12,
                          borderWidth: 1.5,
                          borderColor: Colors.main.primary + '30',
                        }}
                      />
                    ) : (
                      <Box
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: Colors.main.background,
                          borderRadius: 12,
                          borderWidth: 0.5,
                          borderColor: Colors.main.textSecondary + '15',
                        }}
                      />
                    )}

                    <MotiView
                      animate={{
                        scale: day.isSelected ? 1 : 0.92,
                        opacity: day.isSelected ? 1 : 0.85,
                      }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    >
                      <VStack className="items-center" style={{ zIndex: 1 }}>
                        <Text
                          style={{
                            color: day.isSelected ? Colors.main.background : day.isToday ? Colors.main.primary : Colors.main.textSecondary,
                            fontSize: 9,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                          }}
                        >
                          {day.dayName}
                        </Text>

                        <Text
                          style={{
                            color: day.isSelected ? Colors.main.background : day.isToday ? Colors.main.primary : Colors.main.textPrimary,
                            fontSize: 18,
                            textAlign: 'center',
                            marginTop: 2,
                          }}
                        >
                          {day.dayNumber}
                        </Text>

                        {day.isToday && !day.isSelected && (
                          <MotiView
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              type: 'timing',
                              duration: 1500,
                              loop: true,
                            }}
                          >
                            <Box
                              style={{
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: Colors.main.primary,
                                marginTop: 1,
                              }}
                            />
                          </MotiView>
                        )}
                      </VStack>
                    </MotiView>
                  </Pressable>
                </MotiView>
              ))}
            </HStack>
          </ScrollView>
        </Box>

        <MotiView
          animate={{
            scale: canGoNext() ? 1 : 0.8,
            opacity: canGoNext() ? 1 : 0.4,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <Pressable
            onPress={() => handleDayChange(language === 'fa' ? 'prev' : 'next')}
            disabled={isAnimating || !canGoNext()}
            style={{
              backgroundColor: canGoNext() ? Colors.main.primary + '15' : Colors.main.textSecondary + '15',
              borderRadius: 8,
              padding: 8,
              minWidth: 36,
              minHeight: 36,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MotiView
              animate={{
                scale: isAnimating ? 0.8 : 1,
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            >
              <Icon as={calender === 'jalali' ? ArrowLeftIcon : ArrowRightIcon} size="sm" color={canGoNext() ? Colors.main.primary : Colors.main.textSecondary} />
            </MotiView>
          </Pressable>
        </MotiView>
      </HStack>

      <Box
        style={{
          height: 2,
          backgroundColor: Colors.main.textSecondary + '15',
          borderRadius: 1,
          marginTop: 6,
          overflow: 'hidden',
        }}
      >
        <MotiView
          animate={{
            width: `${((selectedDayIndex + 1) / monthDays.length) * 100}%`,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            height: '100%',
            backgroundColor: Colors.main.primary + '80',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
});

WeeklyDatePicker.displayName = 'WeeklyDatePicker';

export default WeeklyDatePicker;
