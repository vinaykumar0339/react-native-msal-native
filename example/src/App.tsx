import { View, StyleSheet, Button, Alert } from 'react-native';
import {
  MSALGlobalConfig,
  PublicClientApplication,
} from 'react-native-msal-native';

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
          android: {
            clientId: '70d91d26-dd13-4436-8b6a-2aab3be01c02',
            authorizationUserAgent: 'DEFAULT',
            redirectUri:
              'msauth://msalnative.example/Xo8WBi6jzSxKDVR4drqm84yr9iU%3D',
            authorities: [
              {
                type: 'AAD',
                audience: {
                  type: 'AzureADMultipleOrgs',
                  tenantId: 'organizations',
                },
                default: true,
              },
            ],
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
        android: {
          promptType: 'select_account',
          scopes: ['User.Read'],
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

  const removeAccount = async () => {
    try {
      const success = await PublicClientApplication.instance().removeAccount({
        username: 'vinay.kumar@vymo072.onmicrosoft.com',
        // identifier:
        //   '924fefdd-bfe5-448f-ae20-56004d7ff694.694c298a-e1a5-4514-af7a-deee1f033aa7',
      });
      console.log(success, 'removeAccount');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const signOut = async () => {
    try {
      const success = await PublicClientApplication.instance().singOut({
        username: 'vinay.kumar@vymo072.onmicrosoft.com',
        // identifier:
        //   '924fefdd-bfe5-448f-ae20-56004d7ff694.694c298a-e1a5-4514-af7a-deee1f033aa7',
        signoutFromBrowser: true,
      });
      console.log(success, 'signOut');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const getCurrentAccount = async () => {
    try {
      const success =
        await PublicClientApplication.instance().getCurrentAccount();
      console.log(success, 'getCurrentAccount');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const setBrokerAvailability = () => {
    MSALGlobalConfig.setBrokerAvailability('auto');
  };

  const sdkVersion = async () => {
    try {
      const success = await PublicClientApplication.sdkVersion();
      console.log(success, 'sdkVersion');
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const isCompatibleAADBrokerAvailable = async () => {
    try {
      const success =
        await PublicClientApplication.instance().isCompatibleAADBrokerAvailable();
      console.log(success, 'isCompatibleAADBrokerAvailable');
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
      <Button onPress={getCurrentAccount} title="Get Current Account" />
      <Button onPress={removeAccount} title="Remove Account" />
      <Button onPress={signOut} title="Sign Out" />
      <Button onPress={setBrokerAvailability} title="Set Broker Availability" />
      <Button
        onPress={isCompatibleAADBrokerAvailable}
        title="Is Compatible AAD Broker Available"
      />
      <Button onPress={sdkVersion} title="SDK Version" />
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
