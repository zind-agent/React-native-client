import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { StyleSheet } from 'react-native';
import { weekdays } from '@/constants/WeekEnum';
import { useAppStore } from '@/store/appState';

interface DaySelectorProps {
  field: {
    value: string[] | undefined;
    onChange: (value: string[]) => void;
  };
}

const DaySelector = ({ field }: DaySelectorProps) => {
  const value = field.value ?? [];
  const { language } = useAppStore();

  const handleDayChange = (day: string) => {
    const isSelected = value.includes(day);
    const updatedDays = isSelected ? value.filter((d) => d !== day) : [...value, day];
    field.onChange(updatedDays);
  };

  return (
    <VStack style={styles.container}>
      <Text style={[styles.titleStyle, { textAlign: language === 'fa' ? 'right' : 'left' }]}>{t('event.select_reminder_days')}</Text>
      <HStack className="flex-wrap gap-1">
        {weekdays.map((day) => {
          const isSelected = value.includes(day.en);
          return (
            <Button
              key={day.id}
              onPress={() => handleDayChange(day.en)}
              size="sm"
              className="rounded-full px-3"
              style={{
                backgroundColor: isSelected ? Colors.main.primary : Colors.main.cardBackground,
              }}
            >
              <ButtonText style={{ color: isSelected ? Colors.main.background : Colors.main.textPrimary }} className="text-sm">
                {language === 'fa' ? day.fa : day.en}
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
    backgroundColor: Colors.main.background,
    borderRadius: 16,
    padding: 16,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 20,
  },
  titleStyle: { color: Colors.main.textPrimary, fontSize: 16, marginBottom: 8 },
});
