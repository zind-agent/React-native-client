import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';

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
    <VStack className="gap-2 mb-5 mt-2">
      <Text style={{ color: Colors.main.textPrimary, fontSize: 15 }}>{t('select_reminder_days')}</Text>
      <HStack className="flex-wrap gap-2 justify-between">
        {daysOfWeek.map((day) => {
          const isSelected = value.includes(day);
          return (
            <Button
              key={day}
              onPress={() => handleDayChange(day)}
              size="sm"
              className="rounded-full px-3"
              style={{
                backgroundColor: isSelected ? Colors.main.primary : Colors.main.cardBackground,
              }}
            >
              <ButtonText style={{ color: isSelected ? Colors.main.background : Colors.main.textPrimary }} className="text-sm">
                {t(day.toLowerCase())}
              </ButtonText>
            </Button>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default DaySelector;
