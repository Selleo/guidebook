import { StyleSheet } from 'react-native';

import { EditScreenInfo } from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { ScreenContainer } from '@/components/ScreenContainer';

export default function TabOneScreen() {
  return (
    <ScreenContainer center>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(app)/(tabs)/index.tsx" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
