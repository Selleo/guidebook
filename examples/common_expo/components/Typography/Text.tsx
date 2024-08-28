import { FC, ReactNode } from 'react';
import { Text as BaseText, StyleSheet, TextProps } from 'react-native';

interface TypographyTextProps extends TextProps {
  bold?: boolean;
  error?: boolean;
  children: ReactNode;
}

export const Text: FC<TypographyTextProps> = ({
  bold,
  error,
  children,
  style,
  ...props
}) => {
  return (
    <BaseText
      style={[styles.text, bold && styles.bold, error && styles.error, style]}
      {...props}
    >
      {children}
    </BaseText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  error: {
    color: '#d32f2f',
  },
});
