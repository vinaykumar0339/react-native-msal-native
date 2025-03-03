import { CommonPublicClientApplication } from '../types';
import type { PublicClientApplicationAndroidConfig } from './types';
import MsalNative from '../MsalNative';

type TPublicClientApplicationAndroid = {};

export class PublicClientApplicationAndroid
  extends CommonPublicClientApplication
  implements TPublicClientApplicationAndroid
{
  createPublicClientApplication(
    config: PublicClientApplicationAndroidConfig
  ): Promise<string> {
    return MsalNative.createPublicClientApplication(config as any);
  }

  static sdkVersion(): Promise<string> {
    return MsalNative.sdkVersion();
  }

  // acquireToken(
  //   config: AcquireInteractiveTokenAndroidConfig
  // ): Promise<MSALNativeResultAndroid> {
  //   return NativeMsalNative.acquireToken(
  //     config as any
  //   ) as unknown as Promise<MSALNativeResultAndroid>;
  // }
}
