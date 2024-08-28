import { Input } from '@/components/Input';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, StyleSheet } from 'react-native';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type SignInFormValues = z.infer<typeof validationSchema>;

export default function SignIn() {
  const { signIn } = useAuth();
  const { control, handleSubmit } = useForm<SignInFormValues>({
    resolver: zodResolver(validationSchema),
  });

  const handleOnSubmit = useCallback<SubmitHandler<SignInFormValues>>(() => {
    signIn();

    // TODO: Check if the user is already signed in.
    router.replace('/');
  }, [signIn]);

  return (
    <ScreenContainer style={styles.container} center>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            secureTextEntry
          />
        )}
      />
      <Button title="Sign In" onPress={handleSubmit(handleOnSubmit)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
