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

export type MSALNativeTenantProfile = {
  identifier: string;
  tenantId: string;
  environment: string;
  isHomeTenantProfile: boolean;
  claims: Record<string, any>;
};

export type MSALNativeAccount = {
  username: string;
  identifier: string;
  environment: string;
  accountClaims: Record<string, any>;
  homeAccountId: MSALNativeAccountId;
  isSSOAccount: boolean;
  tenantProfiles: MSALNativeTenantProfile[];
};

export type MSALNativeAccountId = {
  identifier: string;
  objectId: string;
  tenantId: string;
};

export type MSALNativeResult = {
  accessToken: string;
  expiresOn: number; // timestamp in milliseconds
  extendedLifeTimeToken: boolean;
  tenantId: string;
  idToken: string;
  scopes: string[];
  tenantProfile: MSALNativeTenantProfile;
  account: MSALNativeAccount;
  uniqueId: string;
  authority: string;
  correlationId: string;
  authorizationHeader: string;
  authenticationScheme: string;
};
