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

export type Audience = {
  type:
    | 'AzureADandPersonalMicrosoftAccount'
    | 'AzureADMyOrg'
    | 'AzureADMultipleOrgs'
    | 'PersonalMicrosoftAccount';
  tenantId?: string;
};

export type AuthorityAAD = {
  type: 'AAD';
  audience?: Audience;
  default?: boolean;
};

export type AuthorityB2C = {
  type: 'B2C';
  audience?: Audience;
  default?: boolean;
  authorityUrl: string;
};

export type Authority = AuthorityAAD | AuthorityB2C;

export type Http = {
  /**
   * Time in milliseconds
   */
  connectTimeout?: number;
  /**
   * Time in milliseconds
   */
  readTimeout?: number;
};

export type Logging = {
  /**
   * Whether to emit personal data
   */
  piiEnabled?: boolean;
  /**
   * Which log messages to output. Supported log levels include ERROR,WARNING,INFO, and VERBOSE.
   */
  logLevel?: 'ERROR' | 'WARNING' | 'INFO' | 'VERBOSE';
  /**
   * Whether to output to log cat in addition to the logging interface
   */
  logcatEnabled?: boolean;
};

export type PublicClientApplicationConfigAndroid = {
  /**
   * The client ID or app ID that was created when you registered your application.
   */
  clientId: string;
  /**
   * The redirect URI you registered when you registered your application.
   * If the redirect URI is to a broker app,
   * refer to [Redirect URI for public client apps](https://learn.microsoft.com/en-us/entra/identity-platform/msal-client-application-configuration#redirect-uri-for-public-client-apps)
   * to ensure you're using the correct redirect URI format for your broker app.
   */
  redirectUri: string;
  /**
   * If you want to use brokered authentication,
   * the broker_redirect_uri_registered property must be set to true.
   * In a brokered authentication scenario,
   * if the application isn't in the correct format to talk to the broker as described in [Redirect URI for public client apps](https://learn.microsoft.com/en-us/entra/identity-platform/msal-client-application-configuration#redirect-uri-for-public-client-apps),
   * the application validates your redirect URI and throws an exception when it starts.
   */
  brokerRedirectUriRegistered?: boolean;
  /**
   * The list of authorities that are known and trusted by you.
   * In addition to the authorities listed here, MSAL also queries Microsoft to get a list of clouds and authorities known to Microsoft.
   * In this list of authorities, specify the type of the authority and any additional optional parameters such as "audience",
   * which should align with the audience of your app based on your app's registration. The following is an example list of authorities:
   * ```js
   * // Example AzureAD and Personal Microsoft Account
    {
        "type": "AAD",
        "audience": {
            "type": "AzureADandPersonalMicrosoftAccount"
        },
        "default": true // Indicates that this is the default to use if not provided as part of the acquireToken call
    },
    // Example AzureAD My Organization
    {
        "type": "AAD",
        "audience": {
            "type": "AzureADMyOrg",
            "tenant_id": "contoso.com" // Provide your specific tenant ID here
        }
    },
    // Example AzureAD Multiple Organizations
    {
        "type": "AAD",
        "audience": {
            "type": "AzureADMultipleOrgs"
        }
    },
    //Example PersonalMicrosoftAccount
    {
        "type": "AAD",
        "audience": {
            "type": "PersonalMicrosoftAccount"
        }
    }
   * ```
   */
  authorities?: Authority[];
  /**
   * Indicates whether to use an embedded webview, or the default browser on the device, when signing in an account or authorizing access to a resource.
   */
  authorizationUserAgent?: 'WEBVIEW' | 'BROWSER' | 'DEFAULT';
  /**
   * For clients that support multiple national clouds, specify true.
   * The Microsoft identity platform will then automatically redirect to the correct national cloud during authorization and token redemption.
   * You can determine the national cloud of the signed-in account by examining the authority associated with the AuthenticationResult.
   * Note that the AuthenticationResult doesn't provide the national cloud-specific endpoint address of the resource for which you request a token.
   */
  multipleCloudsSupported?: boolean;
  /**
   * Configure global settings for HTTP timeouts
   */
  http?: Http;
  /**
   * Configure global settings for logging
   */
  logging?: Logging;
  /**
   * Specifies how many accounts can be used within your app at a time
   */
  accountMode?: 'SINGLE' | 'MULTIPLE';
  /**
   * An allow-list of browsers that are compatible with MSAL.
   * These browsers correctly handle redirects to custom intents. You can add to this list.
   */
  browserSafelist?: Record<string, any>[];
};

export type PublicClientApplicationConfig = {
  ios?: PublicClientApplicationConfigIOS;
  android?: PublicClientApplicationConfigAndroid;
};

export type PromptType =
  /**
   * If no user is specified the authentication webview will present a list of users currently signed in for the user to select among
   * Platform: iOS, Android
   */
  | 'select_account'
  /**
   * Require the user to authenticate in the webview
   * Platform: iOS, Android
   */
  | 'login'
  /**
   * Require the user to consent to the current set of scopes for the request.
   * Platform: iOS, Android
   */
  | 'consent'
  /**
   * Create a new account rather than authenticate an existing identity.
   * Platform: iOS
   */
  | 'create'
  /**
   * The SSO experience will be determined by the presence of cookies in the webview and account type.
   * User won’t be prompted unless necessary.
   * If multiple users are signed in, select account experience will be presented.
   * Platform: iOS
   */
  | 'prompt_if_necessary'
  /**
   * The SSO experience will be determined by the presence of cookies in the webview and account type.
   * User won’t be prompted unless necessary.
   * If multiple users are signed in, select account experience will be presented.
   * Platform: iOS
   */
  | 'default'
  /**
   * acquireToken will not send the prompt parameter to the authorize endpoint.
   * Platform: Android
   */
  | 'when_required';

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

export type AuthenticationBearerScheme = {
  /**
   * Authentication Scheme to access the resource
   */
  scheme: 'bearer';
};

export type AuthenticationPopScheme = {
  /**
   * Authentication Scheme to access the resource
   */
  scheme: 'pop';
  /**
   * HTTP Method for the request
   */
  httpMethod:
    | 'HEAD'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';
  /**
   * URL of the resource being accessed
   */
  requestUrl?: string;
  nonce?: string;
  additionalParameters?: Record<string, string>;
};

export type AuthenticationScheme =
  | AuthenticationBearerScheme
  | AuthenticationPopScheme;

export type AcquireTokenCommonConfigIOS = {
  /**
   * Permissions you want included in the access token received in the result in the completionBlock.
   * Not all scopes are guaranteed to be included in the access token returned.
   */
  scopes?: string[];
  /**
   * Key-value pairs to pass to the /authorize and /token endpoints. This should not be url-encoded value.
   */
  extraQueryParameters?: Record<string, string>;
  /**
   * Used to specify query parameters that must be passed to both the authorize and token endpoints to target MSAL at a specific test slice & flight.
   * These apply to all requests made by an application.
   */
  authenticationScheme?: AuthenticationScheme;
};

export type AcquireInteractiveTokenConfigIOS = {
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
} & AcquireTokenCommonConfigIOS;

export type AcquireSilentTokenConfigIOS = {
  /**
   * The displayable value in UserPrincipleName(UPN) format
   * NOTE: use either username or identifier, if both are provided, identifier will be used.
   */
  username?: string;
  /**
   * The unique identifier for the account.
   * NOTE: use either username or identifier, if both are provided, identifier will be used.
   */
  identifier?: string;
  /**
   * Ignore any existing access token in the cache and force MSAL to get a new access token from the service.
   */
  forceRefresh?: boolean;
  /**
   * 1. When Sso Extension is presenting on the device Default is YES.
   *    when Sso Extension failed to return a (new) access token, tries with existing refresh token in the cache, and return results.
   *    If set to NO, when Sso Extension failed to return a (new) access token, ignores existing refresh token in local cahce, and return Sso Extension error.
   * 2. When Sso Extension is not presenting on the device This parameter is ignored, and tries with existing refresh token in the cache.
   */
  allowUsingLocalCachedRtWhenSsoExtFailed?: boolean;
} & AcquireTokenCommonConfigIOS;

export type AcquireTokenCommonConfigAndroid = {
  /**
   * Permissions you want included in the access token received in the result in the completionBlock.
   * Not all scopes are guaranteed to be included in the access token returned.
   */
  scopes?: string[];
  /**
   * Used to specify query parameters that must be passed to both the authorize and token endpoints to target MSAL at a specific test slice & flight.
   * These apply to all requests made by an application.
   */
  authenticationScheme?: AuthenticationScheme;
};

export type AcquireInteractiveTokenConfigAndroid = {
  /**
   * A specific prompt type for the interactive authentication flow.
   */
  promptType?: PromptType;
  /**
   * A loginHint (usually an email) to pass to the service at the beginning of the interactive authentication flow.
   * The account returned in the completion block is not guaranteed to match the loginHint.
   */
  loginHint?: string;
} & AcquireTokenCommonConfigAndroid;

export type AcquireSilentTokenConfigAndroid =
  {} & AcquireTokenCommonConfigAndroid;

export type AcquireInteractiveTokenConfig = {
  ios?: AcquireInteractiveTokenConfigIOS;
  android?: AcquireInteractiveTokenConfigAndroid;
};

export type AcquireSilentTokenConfig = {
  ios?: AcquireSilentTokenConfigIOS;
  android?: AcquireSilentTokenConfigAndroid;
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
  tenantProfile: MSALNativeTenantProfile;
  account: MSALNativeAccount;
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

export type CurrentAccountResponse = {
  account: MSALNativeAccount;
  previousAccount: MSALNativeAccount;
};

export type AccountConfig = {
  /**
   * The displayable value in UserPrincipleName(UPN) format
   * NOTE: use either username or identifier, if both are provided, identifier will be used.
   */
  username?: string;
  /**
   * The unique identifier for the account.
   * NOTE: use either username or identifier, if both are provided, identifier will be used.
   */
  identifier?: string;
};

export type SignOutAccountConfig = {
  /**
   * A copy of the configuration which was provided in the initializer.
   */
  webParameters?: WebParameters;
  /**
    Specifies whether signout should also open the browser and send a network request to the end_session_endpoint.
    NO by default.
  */
  signoutFromBrowser?: boolean;
  /**
    Removes account from the keychain with either com.microsoft.adalcache shared group by default or the one provided when configuring MSALPublicClientApplication.

    This is a destructive action and will remove the SSO state from all apps sharing the same cache!
    It's intended to be used only as a way to achieve GDPR compliance and make sure all user artifacts are cleaned on user sign out.
    It's not intended to be used as a way to reset or fix token cache.
    Please make sure end user is shown UI and/or warning before this flag gets set to YES.
    NO by default.
  */
  wipeAccount?: boolean;
  /**
    When flag is set, following should happen:
      - Wipe all known universal cache locations regardless of the clientId, account etc. Should include all tokens and metadata for any cloud.
      - Wipe all known legacy ADAL cache locations regardless of the clientId, account etc.
      - MSALWipeCacheForAllAccountsConfig contains a list of additional locations for partner caches to be wiped (e.g. Teams, VisualStudio etc). Wipe operation should wipe out all those additional locations. This file includes "display identifier" of the location (e.g. Teams cache), and precise identifiers like kSecAttrAccount, kSecAttrService etc.
      - If SSO extension is present, call SSO extension wipe operation. Wipe operation should only be allowed to the privileged applications like Intune CP on macOS or Authenticator on iOS.
      - Failing any of the steps should return error back to the app including exact locations and apps that failed to be cleared.
    NO by default.
    This is a dangerous operation.
  */
  wipeCacheForAllAccounts?: boolean;
  /**
   Key-value pairs to pass to the logout endpoint. This should not be url-encoded value.
  */
  extraQueryParameters?: Record<string, string>;
} & AccountConfig;
