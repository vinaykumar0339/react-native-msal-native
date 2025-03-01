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

  // Device Information
  isCompatibleAADBrokerAvailable(): Promise<boolean>;
  sdkVersion(): Promise<string>;
}

abstract class APublicClientApplication {
  instance(): IPublicClientApplication {
    throw new Error('Method not implemented.');
  }

  cancelCurrentWebAuthSession(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // Device Information
  sdkVersion(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class PublicClientApplication
  extends APublicClientApplication
  implements IPublicClientApplication
{
  private constructor() {
    super();
  }

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

  /**
   * A boolean indicates if a compatible broker is present in device for AAD requests.
   * Platform: iOS
   * @returns Promise<boolean>
   */
  isCompatibleAADBrokerAvailable(): Promise<boolean> {
    return MsalNative.isCompatibleAADBrokerAvailable();
  }

  /**
   * A String indicates the version of current MSAL SDK.
   * Platform: iOS
   * @returns Promise<string>
   */
  static sdkVersion(): Promise<string> {
    return MsalNative.sdkVersion();
  }
}
