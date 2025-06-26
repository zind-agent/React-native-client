import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { useAppStore } from '@/store/appState';
import { Redirect } from 'expo-router';

export default function Profile() {
  const { isLoggedIn } = useAppStore();

  if (!isLoggedIn) return <Redirect href="/tabs/(auth)" />;

  return (
    <Center className="flex-1">
      <Heading>Profile</Heading>
    </Center>
  );
}
