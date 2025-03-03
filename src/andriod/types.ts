import type { AuthenticationScheme } from '../types';

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

export type PublicClientApplicationAndroidConfig = {
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
   * acquireToken will not send the prompt parameter to the authorize endpoint.
   */
  | 'when_required';

export type AcquireInteractiveTokenAndroidConfig = {
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
};

export type MSALNativeAccountAndroid = {
  authority: string;
  id: string;
  username: string;
  idToken: string;
  tenantId: string;
  claims: Record<string, any>;
};

export type MSALNativeResultAndroid = {
  accessToken: string;
  expiresOn: number;
  scopes: string[];
  account: MSALNativeAccountAndroid;
  tenantId?: string;
  correlationId?: string;
  authorizationHeader: string;
  authenticationScheme: string;
};
