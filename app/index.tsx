import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/tabs/(tabs)" />;
  // return <Redirect href="/tabs/(wizardForm)/stepThree" />;
}
