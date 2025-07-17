import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { useAppStore } from '@/store/appState';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import CalenderIcon from '@/assets/Icons/CalenderIcon';
import { Text } from 'react-native';
import { ArrowLeftIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import jalaliMoment from 'jalali-moment';

interface MonthOption {
  value: string;
  labelEn: string;
  labelFa: string;
}

const gregorianMonths: MonthOption[] = [
  { value: '1', labelEn: 'January', labelFa: 'ژانویه' },
  { value: '2', labelEn: 'February', labelFa: 'فوریه' },
  { value: '3', labelEn: 'March', labelFa: 'مارس' },
  { value: '4', labelEn: 'April', labelFa: 'آوریل' },
  { value: '5', labelEn: 'May', labelFa: 'مه' },
  { value: '6', labelEn: 'June', labelFa: 'ژوئن' },
  { value: '7', labelEn: 'July', labelFa: 'جولای' },
  { value: '8', labelEn: 'August', labelFa: 'اوت' },
  { value: '9', labelEn: 'September', labelFa: 'سپتامبر' },
  { value: '10', labelEn: 'October', labelFa: 'اکتبر' },
  { value: '11', labelEn: 'November', labelFa: 'نوامبر' },
  { value: '12', labelEn: 'December', labelFa: 'دسامبر' },
];

const jalaliMonths: MonthOption[] = [
  { value: '1', labelEn: 'Farvardin', labelFa: 'فروردین' },
  { value: '2', labelEn: 'Ordibehesht', labelFa: 'اردیبهشت' },
  { value: '3', labelEn: 'Khordad', labelFa: 'خرداد' },
  { value: '4', labelEn: 'Tir', labelFa: 'تیر' },
  { value: '5', labelEn: 'Mordad', labelFa: 'مرداد' },
  { value: '6', labelEn: 'Shahrivar', labelFa: 'شهریور' },
  { value: '7', labelEn: 'Mehr', labelFa: 'مهر' },
  { value: '8', labelEn: 'Aban', labelFa: 'آبان' },
  { value: '9', labelEn: 'Azar', labelFa: 'آذر' },
  { value: '10', labelEn: 'Dey', labelFa: 'دی' },
  { value: '11', labelEn: 'Bahman', labelFa: 'بهمن' },
  { value: '12', labelEn: 'Esfand', labelFa: 'اسفند' },
];

const SelectYearWithMonth = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}: {
  selectedYear: string | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMonth: string | null;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { language, calender } = useAppStore();
  const [showDrawer, setShowDrawer] = React.useState(false);

  const currentYear = calender === 'jalali' ? jalaliMoment().jYear().toString() : jalaliMoment().year().toString();
  const [year, setYear] = React.useState<number>(parseInt(currentYear));

  React.useEffect(() => {
    setSelectedYear(year.toString());
  }, [year]);

  const handleDecrease = () => setYear((prev) => prev - 1);
  const handleIncrease = () => setYear((prev) => prev + 1);

  const months = calender === 'jalali' ? jalaliMonths : gregorianMonths;
  const displayYear = calender === 'jalali' ? jalaliMoment(`${year}`, 'jYYYY').format('jYYYY') : year.toString();

  const selectedMonthLabel = selectedMonth ? months.find((m) => m.value === selectedMonth) : null;

  return (
    <Box>
      <Button onPress={() => setShowDrawer(true)} className="rounded-xl bg-transparent">
        <HStack className="items-center" space="sm">
          <CalenderIcon />
          <ButtonText className="text-md" style={{ color: selectedYear && selectedMonth ? Colors.main10275A : Colors.main.primaryLight }}>
            {selectedYear && selectedMonth
              ? `${displayYear} | ${language === 'fa' ? `${selectedMonthLabel?.labelFa} - ${selectedMonthLabel?.labelEn}` : `${selectedMonthLabel?.labelEn} - ${selectedMonthLabel?.labelFa}`}`
              : t('select_year_month')}
          </ButtonText>
        </HStack>
      </Button>

      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} size="lg" anchor="bottom" className="bg-black/60">
        <DrawerBackdrop />
        <DrawerContent style={{ backgroundColor: Colors.main.background }} className="h-max">
          <DrawerHeader className="justify-center py-1">
            {/* Year Selector */}
            <HStack className="items-center gap-10 mb-4">
              <Pressable onPress={handleDecrease} className="rounded-lg p-1" style={{ backgroundColor: Colors.main.primary }}>
                <Icon className="p-4 mx-auto size-2" as={ArrowLeftIcon} color={Colors.main.background} />
              </Pressable>

              <Text style={{ fontSize: 24, color: Colors.main10275A }}>{displayYear}</Text>

              <Pressable onPress={handleIncrease} className="rounded-lg p-1" style={{ backgroundColor: Colors.main.primary }}>
                <Icon className="p-4 mx-auto size-2" as={ArrowRightIcon} color={Colors.main.background} />
              </Pressable>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack className="items-center space-y-6">
              {/* Month Selector */}
              <VStack className="w-full gap-2 space-y-3">
                {months.map((option) => (
                  <Button
                    key={option.value}
                    onPress={() => setSelectedMonth(option.value)}
                    variant={selectedMonth === option.value ? 'solid' : 'outline'}
                    className="h-12 rounded-xl"
                    style={{
                      backgroundColor: selectedMonth === option.value ? Colors.main.primary : Colors.main.background,
                      borderWidth: 1,
                      borderColor: Colors.main.primaryLight,
                    }}
                  >
                    <ButtonText className={`text-lg ${selectedMonth === option.value ? 'text-white' : 'text-black'}`}>
                      {language === 'fa' ? `${option.labelFa} - ${option.labelEn}` : `${option.labelEn} - ${option.labelFa}`}
                    </ButtonText>
                  </Button>
                ))}
              </VStack>

              <Button onPress={() => setShowDrawer(false)} className="mt-4 h-14 rounded-xl w-full" style={{ backgroundColor: Colors.main.primary }}>
                <ButtonText className="text-white text-lg">{t('confirm')}</ButtonText>
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SelectYearWithMonth;
