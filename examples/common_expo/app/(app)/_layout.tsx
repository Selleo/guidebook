import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Typography } from '@/components/Typography';

export default function AppLayout() {
  const { session, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <ScreenContainer center>
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={signOut}>
            <Typography.Text>Logout</Typography.Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}
