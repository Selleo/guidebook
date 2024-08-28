import { FC, ReactNode } from 'react';
import { Text as BaseText, StyleSheet, TextProps } from 'react-native';

interface TypographyTextProps extends TextProps {
  bold?: boolean;
  children: ReactNode;
}

export const Text: FC<TypographyTextProps> = ({
  bold,
  children,
  style,
  ...props
}) => {
  return (
    <BaseText style={[styles.text, bold && styles.bold, style]} {...props}>
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
});
