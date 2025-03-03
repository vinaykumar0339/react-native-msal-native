import MsalNative from '../MsalNative';
import { CommonPublicClientApplication } from '../types';
import type { PublicClientApplicationIOSConfig } from './types';

type TPublicClientApplicationIOS = {
  isCompatibleAADBrokerAvailable(): Promise<boolean>;
  cancelCurrentWebAuthSession(): Promise<boolean>;
};

export class PublicClientApplicationIOS
  extends CommonPublicClientApplication
  implements TPublicClientApplicationIOS
{
  createPublicClientApplication(
    config: PublicClientApplicationIOSConfig
  ): Promise<string> {
    return MsalNative.createPublicClientApplication(config as any);
  }

  static sdkVersion(): Promise<string> {
    return MsalNative.sdkVersion();
  }

  isCompatibleAADBrokerAvailable(): Promise<boolean> {
    return MsalNative.isCompatibleAADBrokerAvailable();
  }

  cancelCurrentWebAuthSession(): Promise<boolean> {
    return MsalNative.cancelCurrentWebAuthSession();
  }

  // acquireToken(
  //   config: AcquireInteractiveTokenIOSConfig
  // ): Promise<MSALNativeResultIOS> {
  //   return MsalNative.acquireToken(
  //     config as any
  //   ) as unknown as Promise<MSALNativeResultIOS>;
  // }
}
