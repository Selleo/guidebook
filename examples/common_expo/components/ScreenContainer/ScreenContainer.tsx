import { FC } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native';

export const ScreenContainer: FC<KeyboardAvoidingViewProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
