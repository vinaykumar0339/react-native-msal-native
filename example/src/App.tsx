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
      console.log(success, 'createPublicClientApplication');
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
      console.log(success, 'acquireToken');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const acquireTokenSilently = async () => {
    try {
      const success =
        await PublicClientApplication.instance().acquireTokenSilent({
          ios: {
            username: 'vinay.kumar@vymo072.onmicrosoft.com',
            // identifier:
            //   '924fefdd-bfe5-448f-ae20-56004d7ff694.694c298a-e1a5-4514-af7a-deee1f033aa7',
          },
        });
      console.log(success, 'acquireTokenSilently');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const allAccounts = async () => {
    try {
      const success = await PublicClientApplication.instance().allAccounts();
      console.log(success, 'allAccounts');
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
      <Button onPress={acquireTokenSilently} title="Acquire Token Silently" />
      <Button onPress={allAccounts} title="Get All Accounts" />
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
