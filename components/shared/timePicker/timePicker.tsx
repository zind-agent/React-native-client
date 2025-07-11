import { Text } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { MotiView } from 'moti';
import { Colors } from '@/constants/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useState } from 'react';

interface TimePickerProps {
  field: any;
  placeholder?: string;
  label?: string;
  onTimeChange?: (time: string) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
  rotateDirection?: 'left' | 'right';
}

export const TimePicker = ({ field, placeholder = '00:00', label, onTimeChange, width = 120, height = 40, disabled = false, rotateDirection = 'right' }: TimePickerProps) => {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [timePressed, setTimePressed] = useState(false);

  const showTimePicker = () => {
    if (!disabled) {
      setIsTimePickerVisible(true);
    }
  };

  const hideTimePicker = () => {
    setIsTimePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    field.onChange(formattedTime);
    onTimeChange?.(formattedTime);
    hideTimePicker();
  };

  const handlePress = () => {
    if (!disabled) {
      setTimePressed(true);
      setTimeout(() => setTimePressed(false), 150);
      showTimePicker();
    }
  };

  return (
    <>
      {label && (
        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 100 }}>
          <Text className="text-sm mb-2" style={{ color: Colors.light.subtext, fontWeight: '800' }}>
            {label}
          </Text>
        </MotiView>
      )}

      <MotiView
        animate={{
          scale: timePressed ? 0.95 : 1,
          rotateZ: timePressed ? (rotateDirection === 'right' ? '2deg' : '-2deg') : '0deg',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <Button
          onPress={handlePress}
          style={{
            borderWidth: 2,
            borderColor: field.value ? Colors.light.primary : Colors.light.light,
            height: height,
            width: width,
            backgroundColor: field.value ? Colors.light.primary + '20' : Colors.light.light,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={disabled}
        >
          <MotiView
            animate={{
              scale: field.value ? 1.05 : 1,
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          >
            <Text
              className="text-lg font-medium"
              style={{
                color: field.value ? Colors.light.primary : Colors.light.darkBlue,
              }}
            >
              {field.value || placeholder}
            </Text>
          </MotiView>
        </Button>
      </MotiView>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        accentColor={Colors.light.primary}
        textColor={Colors.light.darkBlue}
        is24Hour={true}
        display="spinner"
        themeVariant="light"
      />
    </>
  );
};
