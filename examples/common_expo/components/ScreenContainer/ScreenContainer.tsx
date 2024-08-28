import { FC } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native';

interface ScreenContainerProps extends KeyboardAvoidingViewProps {
  center?: boolean;
}

export const ScreenContainer: FC<ScreenContainerProps> = ({
  children,
  center = false,
  style,
  ...props
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, center && styles.center, style]}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
