import { FC } from 'react';

import { Text, TextProps } from './Themed';

export const MonoText: FC<TextProps> = (props) => {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}
