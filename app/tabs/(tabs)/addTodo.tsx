import { Text } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { useAppStore } from '@/store/appState';
import { Redirect } from 'expo-router';
import React from 'react';
import { router } from 'expo-router';

const AddTodo = () => {
  const { isLogin } = useAppStore();

  if (!isLogin) return <Redirect href="/tabs/(auth)/mobileAuth" />;

  return (
    <Center className="flex-1">
      <Button onPress={() => router.push('/tabs/(wizardForm)')}>
        <Text>Append New Todo</Text>
      </Button>
    </Center>
  );
};

export default AddTodo;
