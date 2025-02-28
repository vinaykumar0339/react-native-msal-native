export type PublicClientApplicationConfigIOS = {
  clientId: string;
  redirectUri?: string;
  nestedAuthBrokerClientId?: string;
  nestedAuthBrokerRedirectUri?: string;
  authority: string;
  knownAuthorities?: string[];
  extendedLifetimeEnabled?: boolean;
  clientApplicationCapabilities?: string[];
  tokenExpirationBuffer?: number;
};

export type PublicClientApplicationConfigAndroid = {};

export type PublicClientApplicationConfig = {
  ios?: PublicClientApplicationConfigIOS;
  android?: PublicClientApplicationConfigAndroid;
};
