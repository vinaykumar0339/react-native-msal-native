import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MSALNative from 'react-native-msal-native';

export default function App() {
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    MSALNative.multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
