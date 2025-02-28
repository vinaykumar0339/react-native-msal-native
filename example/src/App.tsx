import { View, StyleSheet, Button, Alert } from 'react-native';
import { PublicClientApplication } from 'react-native-msal-native';

export default function App() {
  const createPublicClientApplication = async () => {
    try {
      await PublicClientApplication.instance().createPublicClientApplication({
        ios: {
          clientId: 'your-client-id',
          authority: 'https://login.microsoftonline.com/your-tenant-id',
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={createPublicClientApplication}
        title="Create Public Client Application"
      />
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
