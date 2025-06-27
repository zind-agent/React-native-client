import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { useAppStore } from '@/store/appState';
import { Redirect } from 'expo-router';
import React from 'react';

const AddTodo = () => {
  const { isLogin } = useAppStore();

  if (!isLogin) return <Redirect href="/tabs/(auth)/mobileAuth" />;

  return (
    <Center className="flex-1">
      <Heading>AddTodo</Heading>
    </Center>
  );
};

export default AddTodo;
