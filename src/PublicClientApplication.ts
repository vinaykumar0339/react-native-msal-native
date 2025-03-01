import type {
  AcquireInteractiveTokenConfig,
  AcquireSilentTokenConfig,
  MSALNativeResult,
  PublicClientApplicationConfig,
  AccountConfig,
  SignOutAccountConfig,
  MSALNativeAccount,
  CurrentAccountResponse,
} from './types';
import MsalNative from './MsalNative';
import { Platform } from 'react-native';

interface IPublicClientApplication {
  createPublicClientApplication(
    config: PublicClientApplicationConfig
  ): Promise<string>;
  acquireToken(
    config?: AcquireInteractiveTokenConfig
  ): Promise<MSALNativeResult>;
  acquireTokenSilent(
    config?: AcquireSilentTokenConfig
  ): Promise<MSALNativeResult>;
  allAccounts(): Promise<MSALNativeAccount[]>;
  account(config: AccountConfig): Promise<MSALNativeAccount>;
  getCurrentAccount(): Promise<CurrentAccountResponse>;
  removeAccount(config: AccountConfig): Promise<boolean>;
  singOut(config: SignOutAccountConfig): Promise<void>;
  setBrokerAvailability(type: 'auto' | 'none'): void;
}

export class PublicClientApplication implements IPublicClientApplication {
  private constructor() {}

  private static _instance: PublicClientApplication;
  static instance() {
    if (!this._instance) {
      this._instance = new PublicClientApplication();
    }
    return this._instance;
  }

  static async cancelCurrentWebAuthSession(): Promise<boolean> {
    return MsalNative.cancelCurrentWebAuthSession();
  }

  createPublicClientApplication(
    config: PublicClientApplicationConfig
  ): Promise<string> {
    const platformConfig = Platform.OS === 'ios' ? config.ios : config.android;
    if (!platformConfig) {
      throw new Error(`please provide the config for ${Platform.OS}`);
    }
    return MsalNative.createPublicClientApplication(platformConfig);
  }

  // need to change the type of config
  acquireToken(
    config?: AcquireInteractiveTokenConfig
  ): Promise<MSALNativeResult> {
    const platformConfig =
      Platform.OS === 'ios' ? config?.ios : config?.android;
    if (config && !platformConfig) {
      throw new Error(`please provide the config for ${Platform.OS}`);
    }
    return MsalNative.acquireToken(
      platformConfig ?? {}
    ) as unknown as Promise<MSALNativeResult>;
  }

  // need to change the type of config
  acquireTokenSilent(
    config?: AcquireSilentTokenConfig
  ): Promise<MSALNativeResult> {
    const platformConfig =
      Platform.OS === 'ios' ? config?.ios : config?.android;
    if (config && !platformConfig) {
      throw new Error(`please provide the config for ${Platform.OS}`);
    }
    return MsalNative.acquireTokenSilent(
      platformConfig ?? {}
    ) as unknown as Promise<MSALNativeResult>;
  }

  allAccounts(): Promise<MSALNativeAccount[]> {
    return MsalNative.allAccounts() as unknown as Promise<MSALNativeAccount[]>;
  }

  account(config: AccountConfig): Promise<MSALNativeAccount> {
    return MsalNative.account(config) as unknown as Promise<MSALNativeAccount>;
  }

  getCurrentAccount(): Promise<CurrentAccountResponse> {
    return MsalNative.getCurrentAccount() as unknown as Promise<CurrentAccountResponse>;
  }

  removeAccount(config: AccountConfig): Promise<boolean> {
    return MsalNative.removeAccount(config);
  }

  singOut(config: SignOutAccountConfig): Promise<void> {
    return MsalNative.signOut(config as any);
  }

  setBrokerAvailability(type: 'auto' | 'none') {
    return MsalNative.setBrokerAvailability(type);
  }
}
