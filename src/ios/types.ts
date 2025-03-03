import type { AuthenticationScheme } from '../types';

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

export type PublicClientApplicationIOSConfig = {
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

export type PromptType =
  /**
   * If no user is specified the authentication webview will present a list of users currently signed in for the user to select among
   * Platform: iOS, Android
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
    | /**
     * For iOS 11 and up, uses AuthenticationSession (ASWebAuthenticationSession or SFAuthenticationSession).
     * For older versions, with AuthenticationSession not being available, uses SafariViewController.
     * For macOS 10.15 and above uses ASWebAuthenticationSession For older macOS versions uses WKWebView
     */
    'default'
    /**
     * Use ASWebAuthenticationSession where available.
     * On older iOS versions uses SFAuthenticationSession Doesn’t allow any other webview type, so if either of these are not present, fails the request
     */
    | 'authentication_session'
    /**
     * Use WKWebView.
     * Don't use 'wk_webview' this one not yet supported (not officially supported by this react native library.)
     */
    | 'wk_webview'
    /**
     * Use SFSafariViewController for all versions.
     */
    | 'safari_view_controller';
};

export type AcquireInteractiveTokenIOSConfig = {
  /**
   * Permissions you want included in the access token received in the result in the completionBlock.
   * Not all scopes are guaranteed to be included in the access token returned.
   */
  scopes?: string[];
  /**
   * Key-value pairs to pass to the /authorize and /token endpoints. This should not be url-encoded value.
   * Platform: iOS, Android
   * NOTE: For Silent acquireToken calls only iOS supported.
   */
  extraQueryParameters?: Record<string, string>;
  /**
   * Used to specify query parameters that must be passed to both the authorize and token endpoints to target MSAL at a specific test slice & flight.
   * These apply to all requests made by an application.
   */
  authenticationScheme?: AuthenticationScheme;
  /**
   * Permissions you want the account to consent to in the same authentication flow, but won’t be included in the returned access token.
   */
  extraScopesToConsent?: string[];
  /**
   * A specific prompt type for the interactive authentication flow.
   */
  promptType?: PromptType;
  /**
   * A loginHint (usually an email) to pass to the service at the beginning of the interactive authentication flow.
   * The account returned in the completion block is not guaranteed to match the loginHint.
   */
  loginHint?: string;
  /**
   * A copy of the configuration which was provided in the initializer.
   */
  webParameters?: WebParameters;
};

export type MSALNativeTenantProfileIOS = {
  identifier: string;
  tenantId: string;
  environment: string;
  isHomeTenantProfile: boolean;
  claims: Record<string, any>;
};

export type MSALNativeAccountIOS = {
  username: string;
  identifier: string;
  environment: string;
  accountClaims: Record<string, any>;
  homeAccountId: MSALNativeAccountIdIOS;
  isSSOAccount: boolean;
  tenantProfiles: MSALNativeTenantProfileIOS[];
};

export type MSALNativeAccountIdIOS = {
  identifier: string;
  objectId: string;
  tenantId: string;
};

export type MSALNativeResultIOS = {
  /**
   * The Access Token requested. Note that if access token is not returned in token response, this property will be returned as an empty string.
   */
  accessToken: string;
  /**
   * The time that the access token returned in the Token property ceases to be valid.
   * This value is calculated based on current UTC time measured locally and the value expiresIn returned from the service
   */
  expiresOn: number; // timestamp in milliseconds
  /**
   * Some access tokens have extended lifetime when server is in an unavailable state.
   * This property indicates whether the access token is returned in such a state.
   */
  extendedLifeTimeToken: boolean;
  /**
   * The raw id token if it’s returned by the service or nil if no id token is returned.
   */
  idToken: string;
  /**
   * The scope values returned from the service.
   */
  scopes: string[];
  tenantProfile: MSALNativeTenantProfileIOS;
  account: MSALNativeAccountIOS;
  /**
   * Represents the authority used for getting the token from STS and caching it.
   * This authority should be used for subsequent silent requests.
   * It might be different from the authority provided by developer (e.g. for sovereign cloud scenarios).
   */
  authority: string;
  /**
   * The correlation ID of the request.
   */
  correlationId: string;
  /**
   * The authorization header for the specific authentication scheme . For instance “Bearer …” or “Pop …”.
   */
  authorizationHeader: string;
  /**
   * The authentication scheme for the tokens issued. For instance “Bearer ” or “Pop”.
   */
  authenticationScheme: string;
};
