import { render } from '@testing-library/react-native';

import { MonoText } from '../StyledText';

test('renders correctly', () => {
  const { getByTestId } = render(
    <MonoText testID="example-text">Snapshot test!</MonoText>,
  );
  const text = getByTestId('example-text');

  expect(text).toBeTruthy();
});
