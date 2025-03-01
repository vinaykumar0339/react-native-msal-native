import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  createPublicClientApplication(config: {
    [key: string]: string;
  }): Promise<string>;
  acquireToken(config: {
    [key: string]: string;
  }): Promise<{ [key: string]: string }>;
  acquireTokenSilent(config: {
    [key: string]: string;
  }): Promise<{ [key: string]: string }>;
  cancelCurrentWebAuthSession(): Promise<boolean>;
  allAccounts(): Promise<{ [key: string]: string }>;
  account(config: {
    [key: string]: string;
  }): Promise<{ [key: string]: string }>;
  getCurrentAccount(): Promise<{ [key: string]: string }>;
  removeAccount(config: { [key: string]: string }): Promise<boolean>;
  signOut(config: { [key: string]: string }): Promise<void>;
  setBrokerAvailability(type: 'auto' | 'none'): void;

  // Device Information
  isCompatibleAADBrokerAvailable(): Promise<boolean>;
  sdkVersion(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MsalNative');
