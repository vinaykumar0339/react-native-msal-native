import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  createPublicClientApplication(config: {
    [key: string]: string;
  }): Promise<string>;
  acquireToken(config: {
    [key: string]: string;
  }): Promise<{ [key: string]: string }>;
  cancelCurrentWebAuthSession(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MsalNative');
