import { Platform } from 'react-native';
import {
  PublicClientApplicationAndroid,
  type PublicClientApplicationAndroidConfig,
} from './andriod';
import {
  PublicClientApplicationIOS,
  type PublicClientApplicationIOSConfig,
} from './ios';
import {
  CommonPublicClientApplication,
  type PublicClientApplicationConfig,
} from './types';

export class PublicClientApplication
  extends CommonPublicClientApplication
  implements PublicClientApplicationIOS, PublicClientApplicationAndroid
{
  private readonly android: PublicClientApplicationAndroid;
  private readonly ios: PublicClientApplicationIOS;

  constructor() {
    super();
    this.android = new PublicClientApplicationAndroid();
    this.ios = new PublicClientApplicationIOS();
  }

  /**
   * A static instance of the PublicClientApplication class.
   * This singleton instance is used to ensure that only one instance of the
   * PublicClientApplication is created and used throughout the application.
   */
  private static _instance: PublicClientApplication;

  /**
   * Returns a singleton instance of the PublicClientApplication.
   * If the instance does not already exist, it creates a new one.
   *
   * @returns {PublicClientApplication} The singleton instance of PublicClientApplication.
   */
  static instance(): PublicClientApplication {
    if (!this._instance) {
      this._instance = new PublicClientApplication();
    }
    return this._instance;
  }

  /**
   * Creates a public client application based on the provided configuration.
   * Android Doc: This is the entry point for developer to create public native applications and make API calls to acquire tokens.
   * iOS Doc: Representation of OAuth 2.0 Public client application.
   *          Create an instance of this class to acquire tokens.
   *          One instance of MSALPublicClientApplication can be used to interact with multiple AAD clouds, and tenants, without needing to create a new instance for each authority.
   *          For most apps, one MSALPublicClientApplication instance is sufficient.
   *
   * Platform: Android, iOS
   *
   * @param config - The configuration object for the public client application.
   *                 It can be either `PublicClientApplicationAndroidConfig` or `PublicClientApplicationIOSConfig`.
   *                 PublicClientApplicationConfig = PublicClientApplicationAndroidConfig | PublicClientApplicationIOSConfig
   * @returns A promise that resolves to a string indicating the result of the client application creation.
   */
  createPublicClientApplication(
    config: PublicClientApplicationConfig
  ): Promise<string> {
    if (Platform.OS === 'ios') {
      return this.ios.createPublicClientApplication(
        config as PublicClientApplicationIOSConfig
      );
    } else {
      return this.android.createPublicClientApplication(
        config as PublicClientApplicationAndroidConfig
      );
    }
  }

  /**
   * A String indicates the version of current MSAL SDK
   * Platform: Android, iOS
   * @returns Promise<string>
   */
  static sdkVersion(): Promise<string> {
    if (Platform.OS === 'ios') {
      return PublicClientApplicationIOS.sdkVersion();
    } else {
      return PublicClientApplicationAndroid.sdkVersion();
    }
  }

  /**
   * A boolean indicates if a compatible broker is present in device for AAD requests.
   * Platform: iOS
   * @returns Promise<boolean>
   */
  isCompatibleAADBrokerAvailable(): Promise<boolean> {
    if (Platform.OS === 'android') {
      throw new Error(
        'isCompatibleAADBrokerAvailable is not available on Android'
      );
    }
    return this.ios.isCompatibleAADBrokerAvailable();
  }

  /**
   * Cancels any currently running interactive web authentication session,
   * resulting in the authorization UI being dismissed and the acquireToken request ending in a cancelation error.
   * Platform: iOS
   * @returns Promise<boolean>
   */
  cancelCurrentWebAuthSession(): Promise<boolean> {
    if (Platform.OS === 'android') {
      throw new Error(
        'cancelCurrentWebAuthSession is not available on Android'
      );
    }
    return this.ios.cancelCurrentWebAuthSession();
  }
}
