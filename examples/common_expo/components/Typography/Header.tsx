import { FC, ReactNode } from 'react';
import { Text as BaseText, StyleSheet, TextProps } from 'react-native';

interface TypographyHeaderProps extends TextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

export const Header: FC<TypographyHeaderProps> = ({
  level = 1,
  children,
  style,
  ...props
}) => {
  return (
    <BaseText
      style={[styles.header, styles[`header${level}`], style]}
      {...props}
    >
      {children}
    </BaseText>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  header1: {
    fontSize: 32,
  },
  header2: {
    fontSize: 28,
  },
  header3: {
    fontSize: 24,
  },
  header4: {
    fontSize: 20,
  },
  header5: {
    fontSize: 18,
  },
  header6: {
    fontSize: 16,
  },
});
