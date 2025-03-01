import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
  createPublicClientApplication(config: {
    [key: string]: string;
  }): Promise<string>;
  acquireToken(config: {
    [key: string]: string;
  }): Promise<{ [key: string]: string }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MsalNative');
