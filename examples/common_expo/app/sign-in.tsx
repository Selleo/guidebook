import { Input } from '@/components/Input';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, StyleSheet, View } from 'react-native';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Typography } from '@/components/Typography';
import { KeyboardAvoidingContainer } from '@/components/KeyboardAvoidingContainer';
import { CenterView } from '@/components/CenterView';

const validationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

type SignInFormValues = z.infer<typeof validationSchema>;

export default function SignIn() {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(validationSchema),
  });

  const handleOnSubmit = useCallback<SubmitHandler<SignInFormValues>>(() => {
    signIn();

    // TODO: Check if the user is already signed in.
    router.replace('/');
  }, [signIn]);

  return (
    <KeyboardAvoidingContainer>
      <CenterView style={styles.container}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, name, value } }) => (
            <Input
              label="E-mail"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="email-address"
              error={!!errors[name]}
              help={errors[name]?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, name, value } }) => (
            <Input
              label="Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              help={errors[name]?.message}
              error={!!errors[name]}
              secureTextEntry
            />
          )}
        />
        <Button title="Sign In" onPress={handleSubmit(handleOnSubmit)} />
        <View style={styles.signUpContainer}>
          <Typography.Text>Don&apos;t have an account?</Typography.Text>
          <Button title="Sign Up" onPress={() => router.push('/sign-up')} />
        </View>
      </CenterView>
    </KeyboardAvoidingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
});
