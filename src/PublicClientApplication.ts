import type { MSALNativeResult, PublicClientApplicationConfig } from './types';
import MsalNative from './MsalNative';
import { Platform } from 'react-native';

interface IPublicClientApplication {
  createPublicClientApplication(
    config: PublicClientApplicationConfig
  ): Promise<string>;
  acquireToken(config?: { [key: string]: any }): Promise<MSALNativeResult>;
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
      throw new Error('please provide the config not found');
    }
    return MsalNative.createPublicClientApplication(platformConfig);
  }

  // need to change the type of config
  acquireToken(config?: { [key: string]: any }): Promise<MSALNativeResult> {
    return MsalNative.acquireToken(
      config ?? {}
    ) as unknown as Promise<MSALNativeResult>;
  }
}
