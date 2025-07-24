import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/Themed';

function SelectDrawer({ selectedValue, setSelectedValue }: { selectedValue: string | null; setSelectedValue: React.Dispatch<React.SetStateAction<string | null>> }) {
  const [showDrawer, setShowDrawer] = React.useState(false);

  const options = [
    { label: t('male'), value: 'male' },
    { label: t('female'), value: 'female' },
  ];

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setShowDrawer(false);
  };

  return (
    <Box>
      <Text style={{ color: Colors.main.textPrimary }} className="px-3 mt-5">
        {t('gender')}
      </Text>
      <Button
        onPress={() => setShowDrawer(true)}
        variant="outline"
        className="my-1 h-16 w-full rounded-xl px-4"
        style={{
          backgroundColor: Colors.main.background,
          borderWidth: 1,
          borderColor: Colors.main.primaryLight,
        }}
      >
        <ButtonText className="text-lg" style={{ color: selectedValue ? Colors.main.textPrimary : Colors.main.primaryLight }}>
          {selectedValue ? options.find((o) => o.value === selectedValue)?.label : t('select_gender')}
        </ButtonText>
      </Button>

      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} size="sm" anchor="bottom" className="bg-black/60">
        <DrawerBackdrop />
        <DrawerContent style={{ backgroundColor: Colors.main.background }}>
          <DrawerHeader>
            <Heading size="xl" style={{ color: Colors.main.textPrimary }}>
              {t('select_gender')}
            </Heading>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-3">
            {options.map((option) => (
              <Button
                variant={selectedValue === option.value ? 'solid' : 'outline'}
                key={option.value}
                onPress={() => handleSelect(option.value)}
                className="mt-1 h-14 rounded-xl gap-3"
                style={{
                  backgroundColor: selectedValue === option.value ? Colors.main.primary : Colors.main.background,
                  borderWidth: 1,
                  borderColor: Colors.main.primaryLight,
                }}
              >
                <ButtonText className={`text-lg ${selectedValue === option.value ? 'text-white' : 'text-black'}`}>{option.label}</ButtonText>
              </Button>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default SelectDrawer;
