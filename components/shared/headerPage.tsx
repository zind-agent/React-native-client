import React from 'react';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { router } from 'expo-router';
import { Heading } from '../ui/heading';
import { Colors } from '@/constants/Colors';
import BellIcon from '@/assets/Icons/BellIcon';

const HeaderPage = ({ title }: { title: string }) => {
  return (
    <HStack className="justify-between">
      <Heading style={{ color: Colors.main.primaryDark, fontSize: 26 }}>{title}</Heading>
      <Button style={{ backgroundColor: Colors.main.lightBlue, elevation: 4 }} className="flex items-center justify-center w-12 h-12 rounded-lg" onPress={() => router.push('/tabs/(tabs)')}>
        <BellIcon />
      </Button>
    </HStack>
  );
};

export default HeaderPage;
