import type {
  AcquireInteractiveTokenAndroidConfig,
  MSALNativeResultAndroid,
  PublicClientApplicationAndroidConfig,
} from './andriod';
import type {
  AcquireInteractiveTokenIOSConfig,
  MSALNativeResultIOS,
  PublicClientApplicationIOSConfig,
} from './ios';

export type AuthenticationBearerScheme = {
  /**
   * Authentication Scheme to access the resource
   */
  scheme: 'bearer';
};

export type AuthenticationPopScheme = {
  /**
   * Authentication Scheme to access the resource
   */
  scheme: 'pop';
  /**
   * HTTP Method for the request
   */
  httpMethod:
    | 'HEAD'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';
  /**
   * URL of the resource being accessed
   */
  requestUrl?: string;
  nonce?: string;
  /**
   * Platform: iOS
   */
  additionalParameters?: Record<string, string>;
  /**
   * Platform: Android
   */
  clientClaims?: string;
};

export type AuthenticationScheme =
  | AuthenticationBearerScheme
  | AuthenticationPopScheme;

export type AcquireInteractiveTokenConfig =
  | AcquireInteractiveTokenAndroidConfig
  | AcquireInteractiveTokenIOSConfig;

export type MSALNativeResult = MSALNativeResultIOS | MSALNativeResultAndroid;

export type PublicClientApplicationConfig =
  | PublicClientApplicationAndroidConfig
  | PublicClientApplicationIOSConfig;

export abstract class CommonPublicClientApplication {
  abstract createPublicClientApplication(
    config: PublicClientApplicationConfig
  ): Promise<string>;

  sdkVersion(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  // abstract acquireToken(
  //   config: AcquireInteractiveTokenConfig
  // ): Promise<MSALNativeResult>;
}
