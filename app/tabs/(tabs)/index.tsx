import UserHeaderTitle from '@/components/shared/userHeaderTitle';
import { Box } from '@/components/ui/box';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

export default function Home() {
  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={{ padding: 5, paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box>
          <UserHeaderTitle />
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
