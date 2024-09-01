import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Typography } from '@/components/Typography';
import { CenterView } from '@/components/CenterView';

export default function AppLayout() {
  const { session, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <CenterView>
        <ActivityIndicator size="large" />
      </CenterView>
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
