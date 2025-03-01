export type SliceConfig = {
  /**
   * Specific test slice
   */
  slice?: string;
  /**
   * Specific data center
   */
  dc?: string;
};

export type PublicClientApplicationConfigIOS = {
  /**
   * The client ID of the application, this should come from the app developer portal.
   */
  clientId: string;
  /**
   * The redirect URI of the application
   */
  redirectUri?: string;
  /**
   * The client ID of the nested application.
   */
  nestedAuthBrokerClientId?: string;
  /**
   * The redirect URI of the nested application
   */
  nestedAuthBrokerRedirectUri?: string;
  /**
   * The authority the application will use to obtain tokens
   */
  authority: string;
  /**
   * List of known authorities that application should trust.
   * Note that authorities listed here will bypass authority validation logic.
   * Thus, it is advised not putting dynamically resolving authorities here.
   */
  knownAuthorities?: string[];
  /**
   * Enable to return access token with extended lifetime during server outage.
   */
  extendedLifetimeEnabled?: boolean;
  /**
   * List of additional STS features that client handles.
   */
  clientApplicationCapabilities?: string[];
  /**
   * Time in seconds controlling how long before token expiry MSAL refreshes access tokens.
   * When checking an access token for expiration we check if time to expiration is less than this value (in seconds) before making the request.
   * The goal is to refresh the token ahead of its expiration and also not to return a token that is about to expire.
   */
  tokenExpirationBuffer?: number;
  /**
   * Used to specify query parameters that must be passed to both the authorize and token endpoints to target MSAL at a specific test slice & flight.
   * These apply to all requests made by an application.
   */
  sliceConfig?: SliceConfig;
  /**
   * For clients that support multiple national clouds, set this to YES. NO by default.
   * If set to YES, the Microsoft identity platform will automatically redirect user to the correct national cloud during the authorization flow.
   * You can determine the national cloud of the signed-in account by examining the authority associated with the MSALResult.
   * Note that the MSALResult doesn’t provide the national cloud-specific endpoint address of the resource for which you request a token.
   */
  multipleCloudsSupported?: boolean;
};

export type PublicClientApplicationConfigAndroid = {};

export type PublicClientApplicationConfig = {
  ios?: PublicClientApplicationConfigIOS;
  android?: PublicClientApplicationConfigAndroid;
};

export type PromptType =
  /**
   * If no user is specified the authentication webview will present a list of users currently signed in for the user to select among
   */
  | 'select_account'
  /**
   * Require the user to authenticate in the webview
   */
  | 'login'
  /**
   * Require the user to consent to the current set of scopes for the request.
   */
  | 'consent'
  /**
   * Create a new account rather than authenticate an existing identity.
   */
  | 'create'
  /**
   * The SSO experience will be determined by the presence of cookies in the webview and account type.
   * User won’t be prompted unless necessary.
   * If multiple users are signed in, select account experience will be presented.
   */
  | 'prompt_if_necessary'
  /**
   * The SSO experience will be determined by the presence of cookies in the webview and account type.
   * User won’t be prompted unless necessary.
   * If multiple users are signed in, select account experience will be presented.
   */
  | 'default';

export type WebParameters = {
  /**
   * Modal presentation style for displaying authentication web content.
   * Note that presentationStyle has no effect when webviewType == MSALWebviewType.MSALWebviewTypeDefault
   * or webviewType == MSALWebviewType.MSALWebviewTypeAuthenticationSession.
   */
  presentationStyle:
    | 'full_screen'
    | 'page_sheet'
    | 'form_sheet'
    | 'current_context'
    | 'custom'
    | 'over_full_screen'
    | 'popover'
    | 'none'
    | 'automatic';
  /**
   * A Boolean value that indicates whether the ASWebAuthenticationSession should ask the browser for a private authentication session.
   * The value of this property is false by default.
   * For more info see here: https://developer.apple.com/documentation/authenticationservices/aswebauthenticationsession/3237231-prefersephemeralwebbrowsersessio?language=objc
   */
  prefersEphemeralWebBrowserSession?: boolean;
  /**
   * A specific webView type for the interactive authentication flow. By default, it will be set to MSALGlobalConfig.defaultWebviewType.
   */
  webviewType?:
    | 'default'
    | 'authentication_session'
    // Don't use 'wk_webview' this one not yet supported
    | 'wk_webview'
    | 'safari_view_controller';
};

export type AcquireTokenConfigIOS = {
  scopes?: string[];
  extraQueryParameters?: Record<string, string>;
  extraScopesToConsent?: string[];
  promptType?: PromptType;
  loginHint?: string;
  webParameters?: WebParameters;
};

export type AcquireTokenConfigAndroid = {};

export type AcquireTokenConfig = {
  ios?: AcquireTokenConfigIOS;
  android?: AcquireTokenConfigAndroid;
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
  idToken: string;
  scopes: string[];
  tenantProfile: MSALNativeTenantProfile;
  account: MSALNativeAccount;
  authority: string;
  correlationId: string;
  authorizationHeader: string;
  authenticationScheme: string;
};
