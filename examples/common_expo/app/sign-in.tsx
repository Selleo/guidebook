import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function SignIn() {
  const { signIn } = useAuth();

  const handleSignIn = useCallback(() => {
    signIn();

    // TODO: Check if the user is already signed in.
    router.replace('/');
  }, [signIn]);

  return (
    <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleSignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
