import { NativeModules } from 'react-native';
import type { Spec } from './NativeMsalNative';

declare global {
  var __turboModuleProxy: any;
}

const isTurboModuleEnabled = global.__turboModuleProxy != null;

const MsalNative: Spec = isTurboModuleEnabled
  ? require('./NativeMsalNative').default
  : NativeModules.MsalNative;

export default MsalNative;
