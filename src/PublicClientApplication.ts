import type {
  AcquireTokenConfig,
  MSALNativeResult,
  PublicClientApplicationConfig,
} from './types';
import MsalNative from './MsalNative';
import { Platform } from 'react-native';

interface IPublicClientApplication {
  createPublicClientApplication(
    config: PublicClientApplicationConfig
  ): Promise<string>;
  acquireToken(config?: AcquireTokenConfig): Promise<MSALNativeResult>;
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
  acquireToken(config?: AcquireTokenConfig): Promise<MSALNativeResult> {
    const platformConfig =
      Platform.OS === 'ios' ? config?.ios : config?.android;
    if (config && !platformConfig) {
      throw new Error(`please provide the config for ${Platform.OS}`);
    }
    return MsalNative.acquireToken(
      platformConfig ?? {}
    ) as unknown as Promise<MSALNativeResult>;
  }
}
