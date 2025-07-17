import { Colors } from '@/constants/Colors';
import { Button, ButtonText } from '../ui/button';
import { t } from 'i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ControllerRenderProps, Path } from 'react-hook-form';
import { Icon } from '../ui/icon';
import CalenderIcon from '@/assets/Icons/CalenderIcon';
import { useCallback } from 'react';

interface DatePickerProps<T extends Record<string, any>> {
  field: ControllerRenderProps<T, Path<T>>;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDatePicker: boolean;
}

const DatePicker = <T extends Record<string, any>>({ field, setShowDatePicker, showDatePicker }: DatePickerProps<T>) => {
  const formatDate = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  return (
    <>
      <Button onPress={() => setShowDatePicker(true)} style={{ backgroundColor: Colors.main.lightBlue }} className="rounded-lg h-[50px] w-full justify-between px-8">
        <ButtonText style={{ color: Colors.main.primary, fontWeight: '800' }}>{field.value ? `${field.value} ` : t('todos.select_date')}</ButtonText>
        <Icon as={CalenderIcon} color={Colors.main.primary} />
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={field.value ? new Date(field.value) : new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              field.onChange(formatDate(selectedDate));
            }
          }}
        />
      )}
    </>
  );
};

export default DatePicker;
