import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { useAppStore } from '@/store/appState';
import { Redirect } from 'expo-router';

export default function Profile() {
  const { isLogin } = useAppStore();
  if (!isLogin) return <Redirect href="/tabs/(auth)/emailAuth" />;

  return (
    <Center className="flex-1">
      <Heading>Profile</Heading>
    </Center>
  );
}
