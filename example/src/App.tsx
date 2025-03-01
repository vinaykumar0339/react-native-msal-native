import { View, StyleSheet, Button, Alert } from 'react-native';
import { PublicClientApplication } from 'react-native-msal-native';

export default function App() {
  const showErrorAlert = (error: any) => {
    if (error instanceof Error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Error', 'An unknown error occurred');
    }
  };

  const createPublicClientApplication = async () => {
    try {
      const success =
        await PublicClientApplication.instance().createPublicClientApplication({
          ios: {
            clientId: '70d91d26-dd13-4436-8b6a-2aab3be01c02',
            authority: 'https://login.microsoftonline.com/organizations',
            redirectUri: 'msauth.msalnative.example://auth',
          },
        });

      Alert.alert('Success', success);
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const acquireToken = async () => {
    try {
      const success = await PublicClientApplication.instance().acquireToken({
        ios: {
          promptType: 'select_account',
        },
      });
      console.log(success, 'success');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={createPublicClientApplication}
        title="Create Public Client Application"
      />
      <Button onPress={acquireToken} title="Acquire Token" />
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
