#import "MsalNative.h"
#import "MsalNativeHelper.h"
#import "MsalModelHelper.h"
#import "MsalNativeConstants.h"

@interface MsalNative ()
@property (nonatomic, strong) MSALPublicClientApplication *application;
@end

@implementation MsalNative

RCT_EXPORT_MODULE()

- (NSDictionary *)getAccountWithConfig:(NSDictionary *)config {
    NSString *identifier = [RCTConvert NSString:config[@"identifier"]];
    NSString *username = [RCTConvert NSString:config[@"username"]];
    
    NSError *accountError = nil;
    MSALAccount *account = nil;
    
    if (identifier) {
        account = [self->_application accountForIdentifier:identifier error:&accountError];
        if (accountError) {
            return @{ @"errorCode": @"ACCOUNT_NOT_FOUND_ERROR",
                      @"errorMessage": [NSString stringWithFormat:@"Account Not Found For identifier: %@", identifier],
                      @"error": accountError };
        }
    } else if (username) {
        account = [self->_application accountForUsername:username error:&accountError];
        if (accountError) {
            return @{ @"errorCode": @"ACCOUNT_NOT_FOUND_ERROR",
                      @"errorMessage": [NSString stringWithFormat:@"Account Not Found For username: %@", username],
                      @"error": accountError };
        }
    } else {
        return @{ @"errorCode": @"MISSING_PARAMETER_ERROR",
                  @"errorMessage": @"Please provide identifier or username" };
    }
    
    if (!account) {
        return @{ @"errorCode": @"ACCOUNT_NOT_FOUND_ERROR",
                  @"errorMessage": @"Account not found. If this occurs multiple times despite being certain the account exists, try acquiring the token interactively.", };
    }
    
    return @{ @"account": account };
}

-(MSALWebviewParameters *)getWebViewParamaters:(NSDictionary *)config
                                viewController: (UIViewController *)viewController
{
  MSALWebviewParameters *webParameters = [[MSALWebviewParameters alloc] initWithAuthPresentationViewController:viewController];
  
  if (config) {
    //  presentationStyle
    NSString* presentationStyle = [RCTConvert NSString:config[@"presentationStyle"]];
    if (presentationStyle) {
      webParameters.presentationStyle = [MsalNativeHelper getPresentationStyle:presentationStyle];
    }
    //  prefersEphemeralWebBrowserSession
    BOOL prefersEphemeralWebBrowserSession = [RCTConvert BOOL:config[@"prefersEphemeralWebBrowserSession"]];
    webParameters.prefersEphemeralWebBrowserSession = prefersEphemeralWebBrowserSession;
    
    //  webviewType
    NSString* webviewType = [RCTConvert NSString:config[@"webviewType"]];
    if (webviewType) {
      webParameters.webviewType = [MsalNativeHelper getWebViewType:webviewType];
    }
  }
  
  return webParameters;
}


// MARK: React Native Export Methods
RCT_EXPORT_METHOD(createPublicClientApplication:(nonnull NSDictionary *)config resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  NSString *clientId = [RCTConvert NSString:config[@"clientId"]];
  
  if (!clientId) {
    reject(@"INVALID_CLIENTID", @"clientId is missing or invalid", nil);
    return;
  }
  
  NSString *redirectUri = [RCTConvert NSString:config[@"redirectUri"]];
  NSString *nestedAuthBrokerClientId = [RCTConvert NSString:config[@"nestedAuthBrokerClientId"]];
  NSString *nestedAuthBrokerRedirectUri = [RCTConvert NSString:config[@"nestedAuthBrokerRedirectUri"]];
  NSString *authority = [RCTConvert NSString:config[@"authority"]];
  
  if (!authority) {
    reject(@"INVALID_AUTHORITY", @"authority is missing or invalid", nil);
    return;
  }
  NSURL *authorityURL = [NSURL URLWithString:authority];
  
  NSError *authorityError = nil;
  MSALAuthority *msalAuthority = [MSALAuthority authorityWithURL:authorityURL error:&authorityError];
  
  if (authorityError) {
    reject(@"INVALID_AUTHORITY", @"Invalid authority URL. For more info check the userinfo object", authorityError);
    return;
  }
  
  
  MSALPublicClientApplicationConfig *msalConfig = [[MSALPublicClientApplicationConfig alloc] initWithClientId:clientId redirectUri:redirectUri authority:msalAuthority nestedAuthBrokerClientId:nestedAuthBrokerClientId nestedAuthBrokerRedirectUri:nestedAuthBrokerRedirectUri];
  
  // knownAuthorities
  NSArray<NSString *> *knownAuthorities = [RCTConvert NSStringArray:config[@"knownAuthorities"]];
  if (knownAuthorities) {
    NSError *authorityError = nil;
    NSString *failedAuthority = nil; // Track the failing authority
    NSArray<MSALAuthority *> *msalAuthorities = [MsalNativeHelper getKnownAuthorities:knownAuthorities error:&authorityError failedAuthority:&failedAuthority];
    
    if (authorityError) {
      reject(@"INVALID_AUTHORITY", [NSString stringWithFormat:@"Invalid authority URL: %@", failedAuthority], authorityError);
      return;
    }
    msalConfig.knownAuthorities = msalAuthorities;
  }
  
  // extendedLifetimeEnabled
  BOOL extendedLifetimeEnabled = [RCTConvert BOOL:config[@"extendedLifetimeEnabled"]];
  msalConfig.extendedLifetimeEnabled = extendedLifetimeEnabled;
  
  // clientApplicationCapabilities
  NSArray<NSString *> *clientApplicationCapabilities = [RCTConvert NSStringArray:config[@"clientApplicationCapabilities"]];
  if (clientApplicationCapabilities) {
    msalConfig.clientApplicationCapabilities = clientApplicationCapabilities;
  }
  
  // tokenExpirationBuffer
  double tokenExpirationBuffer = [RCTConvert double:config[@"tokenExpirationBuffer"]];
  msalConfig.tokenExpirationBuffer = tokenExpirationBuffer;
  
  // sliceConfig
  NSDictionary* sliceConfig = [RCTConvert NSDictionary:config[@"sliceConfig"]];
  if (sliceConfig) {
    msalConfig.sliceConfig = [MsalModelHelper convertConfigIntoSliceConfig:sliceConfig];
  }
  
  // multipleCloudsSupported
  BOOL multipleCloudsSupported = [RCTConvert BOOL:config[@"multipleCloudsSupported"]];
  msalConfig.multipleCloudsSupported = multipleCloudsSupported;
  
  NSError *applicationError = nil;
  _application = [[MSALPublicClientApplication alloc] initWithConfiguration:msalConfig error:&applicationError];
  
  if (applicationError) {
    reject(@"APPLICATION_CREATION_ERROR", @"Error Creating Public Client Application. For more info check the userinfo object", applicationError);
  } else {
    resolve(@"successfully created public client application");
  }
}

RCT_EXPORT_METHOD(acquireToken:(nonnull NSDictionary *)config resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  __weak MsalNative *weakSelf = self;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong MsalNative *strongSelf = weakSelf;
    if (!strongSelf) return;
    
    UIViewController *viewController = RCTPresentedViewController();
    if (!viewController) {
      reject(@"VIEW_CONTROLLER_NOT_FOUND_ERROR", @"View Controller not found to present a login screen", nil);
      return;
    }
    
    NSDictionary *webConfigParameters = [RCTConvert NSDictionary:config[@"webParameters"]];
    
    MSALWebviewParameters *webParameters = [strongSelf getWebViewParamaters:config viewController:viewController];
    
    //  scopes
    NSArray<NSString *> *scopes = [RCTConvert NSStringArray:config[@"scopes"]];
    
    MSALInteractiveTokenParameters *interactiveParams = [[MSALInteractiveTokenParameters alloc] initWithScopes:scopes webviewParameters:webParameters];
    
    //  extraQueryParameters
    NSDictionary* extraQueryParameters = [RCTConvert NSDictionary:config[@"extraQueryParameters"]];
    if (extraQueryParameters) {
      interactiveParams.extraQueryParameters = extraQueryParameters;
    }
    
    //  extraScopesToConsent
    NSArray<NSString *> *extraScopesToConsent = [RCTConvert NSStringArray:config[@"extraScopesToConsent"]];
    if (extraScopesToConsent) {
      interactiveParams.extraScopesToConsent = extraScopesToConsent;
    }
    
    // loginHint
    NSString* loginHint = [RCTConvert NSString:config[@"loginHint"]];
    if (loginHint) {
      interactiveParams.loginHint = loginHint;
    }
    
    // promptType
    NSString* promptType = [RCTConvert NSString:config[@"promptType"]];
    if (promptType) {
      interactiveParams.promptType = [MsalNativeHelper getPromptType:promptType];
    }
    
    // authenticationScheme
    NSDictionary* authenticationScheme = [RCTConvert NSDictionary:config[@"authenticationScheme"]];
    if (authenticationScheme) {
      interactiveParams.authenticationScheme = [MsalNativeHelper authenticationSchemeFromConfig:authenticationScheme];
    }
    
    [strongSelf->_application acquireTokenWithParameters:interactiveParams completionBlock:^(MSALResult * _Nullable result, NSError * _Nullable error) {
      if (error) {
        reject(@"ACQUIRE_TOKEN_ERROR", @"Error While getting token. For more info check the userinfo object", error);
      } else {
        resolve([MsalModelHelper convertMsalResultToDictionary:result]);
      }
    }];
  });
}

RCT_EXPORT_METHOD(acquireTokenSilent:(nonnull NSDictionary *)config resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  __weak MsalNative *weakSelf = self;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong MsalNative *strongSelf = weakSelf;
    if (!strongSelf) return;
    
    // get the account
    NSDictionary* accountInfo = [self getAccountWithConfig:config];
    MSALAccount* account = accountInfo[@"account"];

    // if account not there it means we have an error
    if (!account) {
      NSString *errorCode = accountInfo[@"errorCode"];
      NSString *errorMessage = accountInfo[@"errorMessage"];
      NSError *error = accountInfo[@"error"];
      reject(errorCode, errorMessage, error);
      return;
    }
    
    UIViewController *viewController = RCTPresentedViewController();
    if (!viewController) {
      reject(@"VIEW_CONTROLLER_NOT_FOUND_ERROR", @"View Controller not found to present a login screen", nil);
      return;
    }
    
    //  scopes
    NSArray<NSString *> *scopes = [RCTConvert NSStringArray:config[@"scopes"]];
    
    MSALSilentTokenParameters *silentParams = [[MSALSilentTokenParameters alloc] initWithScopes:scopes account:account];
    
    //  extraQueryParameters
    NSDictionary* extraQueryParameters = [RCTConvert NSDictionary:config[@"extraQueryParameters"]];
    if (extraQueryParameters) {
      silentParams.extraQueryParameters = extraQueryParameters;
    }
    
    // forceRefresh
    BOOL forceRefresh = [RCTConvert BOOL:config[@"forceRefresh"]];
    silentParams.forceRefresh = forceRefresh;
    
    // allowUsingLocalCachedRtWhenSsoExtFailed
    BOOL allowUsingLocalCachedRtWhenSsoExtFailed = [RCTConvert BOOL:config[@"allowUsingLocalCachedRtWhenSsoExtFailed"]];
    silentParams.allowUsingLocalCachedRtWhenSsoExtFailed = allowUsingLocalCachedRtWhenSsoExtFailed;
    
    // authenticationScheme
    NSDictionary* authenticationScheme = [RCTConvert NSDictionary:config[@"authenticationScheme"]];
    if (authenticationScheme) {
      silentParams.authenticationScheme = [MsalNativeHelper authenticationSchemeFromConfig:authenticationScheme];
    }
    
    [strongSelf->_application acquireTokenSilentWithParameters:silentParams completionBlock:^(MSALResult * _Nullable result, NSError * _Nullable error) {
      if (error) {
        reject(@"ACQUIRE_TOKEN_ERROR", @"Error While getting token. For more info check the userinfo object", error);
      } else {
        resolve([MsalModelHelper convertMsalResultToDictionary:result]);
      }
    }];
  });
    
}

RCT_EXPORT_METHOD(cancelCurrentWebAuthSession:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  BOOL cancelled = [MSALPublicClientApplication cancelCurrentWebAuthSession];
  resolve(@(cancelled));
}

RCT_EXPORT_METHOD(allAccounts:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  NSError *error = nil;
  NSArray<MSALAccount *> *allAccounts = [self.application allAccounts:&error];
  if (error) {
    reject(@"ERROR", @"Error While getting all accounts. For more info check the userinfo object", error);
  } else {
    NSArray<NSDictionary *> *accounts = [MsalModelHelper convertMsalAccountsToDictionaries:allAccounts];
    resolve(accounts);
  }
}

RCT_EXPORT_METHOD(account:(nonnull NSDictionary *)config resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  // get the account
  NSDictionary* accountInfo = [self getAccountWithConfig:config];
  MSALAccount* account = accountInfo[@"account"];

  // if account not there it means we have an error
  if (!account) {
    NSString *errorCode = accountInfo[@"errorCode"];
    NSString *errorMessage = accountInfo[@"errorMessage"];
    NSError *error = accountInfo[@"error"];
    reject(errorCode, errorMessage, error);
  } else {
    resolve(account);
  }
}

RCT_EXPORT_METHOD(getCurrentAccount:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  MSALParameters *paramters = [[MSALParameters alloc] init];
  [self->_application getCurrentAccountWithParameters:paramters completionBlock:^(MSALAccount * _Nullable_result account, MSALAccount * _Nullable_result previousAccount, NSError * _Nullable error) {
    if (error) {
      reject(@"CURRENT_ACCOUNT_ERROR", @"Error loading current account. for more information please check the userinfo object", error);
    } else {
      resolve(@{
        @"account": [MsalModelHelper convertMsalAccountToDictionary:account],
        @"previousAccount": [MsalModelHelper convertMsalAccountToDictionary:previousAccount]
      });
    }
  }];
}

RCT_EXPORT_METHOD(removeAccount:(nonnull NSDictionary *)config resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  // get the account
  NSDictionary* accountInfo = [self getAccountWithConfig:config];
  MSALAccount* account = accountInfo[@"account"];

  // if account not there it means we have an error
  if (!account) {
    NSString *errorCode = accountInfo[@"errorCode"];
    NSString *errorMessage = accountInfo[@"errorMessage"];
    NSError *error = accountInfo[@"error"];
    reject(errorCode, errorMessage, error);
    return;
  }
  
  NSError *accountRemoveError = nil;
  bool removedSuccessfully = [self.application removeAccount:account error:&accountRemoveError];
  
  if (accountRemoveError) {
    reject(@"ERROR_ACCOUNT_REMOVE", @"Error Removing Account", accountRemoveError);
  } else {
    resolve(@(removedSuccessfully));
  }
}

RCT_EXPORT_METHOD(signOut:(nonnull NSDictionary *)config resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
  if (!_application) {
    reject(@"APPLICATION_NOT_INITIALIZED_ERROR", @"Application not initialized. Make sure you called createPublicClientApplication", nil);
    return;
  }
  
  // get the account
  NSDictionary* accountInfo = [self getAccountWithConfig:config];
  MSALAccount* account = accountInfo[@"account"];

  // if account not there it means we have an error
  if (!account) {
    NSString *errorCode = accountInfo[@"errorCode"];
    NSString *errorMessage = accountInfo[@"errorMessage"];
    NSError *error = accountInfo[@"error"];
    reject(errorCode, errorMessage, error);
    return;
  }

  __weak MsalNative *weakSelf = self;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    __strong MsalNative *strongSelf = weakSelf;
    if (!strongSelf) return;
    
    UIViewController *viewController = RCTPresentedViewController();
    if (!viewController) {
      reject(@"VIEW_CONTROLLER_NOT_FOUND_ERROR", @"View Controller not found to present a login screen", nil);
      return;
    }
    
    NSDictionary *webConfigParameters = [RCTConvert NSDictionary:config[@"webParameters"]];
    
    MSALWebviewParameters *webParameters = [self getWebViewParamaters:webConfigParameters viewController:viewController];
    
    MSALSignoutParameters *signoutParameters = [[MSALSignoutParameters alloc] initWithWebviewParameters:webParameters];
    
    // signoutFromBrowser
    BOOL signoutFromBrowser = [RCTConvert BOOL:config[@"signoutFromBrowser"]];
    signoutParameters.signoutFromBrowser = signoutFromBrowser;
    
    // wipeAccount
    BOOL wipeAccount = [RCTConvert BOOL:config[@"wipeAccount"]];
    signoutParameters.wipeAccount = wipeAccount;
    
    // wipeAccount
    BOOL wipeCacheForAllAccounts = [RCTConvert BOOL:config[@"wipeCacheForAllAccounts"]];
    signoutParameters.wipeCacheForAllAccounts = wipeCacheForAllAccounts;
    
    
    NSDictionary *extraQueryParameters = [RCTConvert NSDictionary:config[@"extraQueryParameters"]];
    if (extraQueryParameters) {
      signoutParameters.extraQueryParameters = extraQueryParameters;
    }
    
    [strongSelf->_application signoutWithAccount:account signoutParameters:signoutParameters completionBlock:^(BOOL success, NSError * _Nullable error) {
      if (error) {
        reject(@"SIGN_OUT_ERROR", @"Error While SigningOut. Check userInfo Object For more information", error);
      } else {
        resolve(@(success));
      }
    }];
  });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeMsalNativeSpecJSI>(params);
}
#endif

@end
