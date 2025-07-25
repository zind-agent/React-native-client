import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { StyleSheet } from 'react-native';

interface DaySelectorProps {
  field: {
    value: string[] | undefined;
    onChange: (value: string[]) => void;
  };
}

const DaySelector = ({ field }: DaySelectorProps) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const value = field.value ?? [];

  const handleDayChange = (day: string) => {
    const isSelected = value.includes(day);
    const updatedDays = isSelected ? value.filter((d) => d !== day) : [...value, day];
    field.onChange(updatedDays);
  };

  return (
    <VStack style={styles.container}>
      <Text style={styles.titleStyle}>{t('event.select_reminder_days')}</Text>
      <HStack className="flex-wrap gap-1 justify-between">
        {daysOfWeek.map((day) => {
          const isSelected = value.includes(day);
          return (
            <Button
              key={day}
              onPress={() => handleDayChange(day)}
              size="sm"
              className="rounded-full px-3"
              style={{
                backgroundColor: isSelected ? Colors.main.primary : Colors.main.background,
              }}
            >
              <ButtonText style={{ color: isSelected ? Colors.main.background : Colors.main.textPrimary }} className="text-sm">
                {t(day.toUpperCase())}
              </ButtonText>
            </Button>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default DaySelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 20,
  },
  titleStyle: { color: Colors.main.textPrimary, fontSize: 16, marginBottom: 8 },
});
