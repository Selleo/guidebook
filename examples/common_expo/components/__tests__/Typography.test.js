import { render } from '@testing-library/react-native';

import { Typography } from '../Typography';

test('renders correctly', () => {
  const { getByTestId } = render(
    <Typography.Text testID="example-text">Typography test</Typography.Text>,
  );
  const text = getByTestId('example-text');

  expect(text).toBeTruthy();
});
