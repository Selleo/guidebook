import { Input } from '@/components/Input';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, StyleSheet } from 'react-native';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { CenterView } from '@/components/CenterView';
import { KeyboardAvoidingContainer } from '@/components/KeyboardAvoidingContainer';

const passwordLengthMessage = 'Password must be at least 8 characters';

const validationSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: passwordLengthMessage }),
    confirmPassword: z.string().min(8, { message: passwordLengthMessage }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type SignUpFormValues = z.infer<typeof validationSchema>;

export default function SignUp() {
  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(validationSchema),
  });

  const handleOnSubmit = useCallback<SubmitHandler<SignUpFormValues>>(() => {
    signUp();

    // TODO: Check if the user is already signed in.
    router.replace('/sign-in');
  }, [signUp]);

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
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, name, value } }) => (
            <Input
              label="Confirm Password"
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
        <Button title="Go back" onPress={() => router.back()} />
      </CenterView>
    </KeyboardAvoidingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
});
