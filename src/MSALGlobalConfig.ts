import NativeMsalNative from './NativeMsalNative';

abstract class IMSALGlobalConfig {
  setBrokerAvailability(_type: 'auto' | 'none'): void {
    throw new Error('Method not implemented.');
  }
}

export class MSALGlobalConfig extends IMSALGlobalConfig {
  static setBrokerAvailability(type: 'auto' | 'none') {
    NativeMsalNative.setBrokerAvailability(type);
  }
}
