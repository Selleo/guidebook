import { FC, useCallback, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label: string;
}

export const Input: FC<InputProps> = ({
  label,
  value,
  defaultValue = '',
  onChangeText,
  onFocus,
  onBlur,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(defaultValue ?? value);

  const offsetY = useSharedValue(inputValue.length > 0 ? -10 : 10);

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(offsetY.value) }],
  }));

  const handleChangeText = useCallback(
    (text: string) => {
      setInputValue(text);
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const handleOnFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      offsetY.value = -10;
      onFocus?.(event);
    },
    [offsetY, onFocus],
  );

  const handleOnBlur = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (inputValue.length === 0) {
        offsetY.value = 10;
      }

      onBlur?.(event);
    },
    [inputValue.length, offsetY, onBlur],
  );

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, animatedLabelStyle]}>
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.input]}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    position: 'absolute',
    left: 10,
    top: 0,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    zIndex: 1,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    color: '#333',
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },
});
