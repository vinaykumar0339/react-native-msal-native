#import "MsalNative.h"
#import "MsalNativeHelper.h"
#import "MsalModalHelper.h"
#import "MsalNativeConstants.h"

@interface MsalNative ()
@property (nonatomic, strong) MSALPublicClientApplication *application;
@end

@implementation MsalNative

RCT_EXPORT_MODULE()

-(MSALPromptType)getPromptType:(nonnull NSString *)type {
  MSALPromptType msalPromptType = MSALPromptTypeDefault;
  
  if ([type isEqualToString:PromptTypeSelectAccount]) {
    msalPromptType = MSALPromptTypeSelectAccount;
  } else if ([type isEqualToString:PromptTypeLogin]) {
    msalPromptType = MSALPromptTypeLogin;
  } else if ([type isEqualToString:PromptTypeConsent]) {
    msalPromptType = MSALPromptTypeConsent;
  } else if ([type isEqualToString:PromptTypePromptIfNecessary]) {
    msalPromptType = MSALPromptTypePromptIfNecessary;
  } else if ([type isEqualToString:PromptTypeDefault]) {
    msalPromptType = MSALPromptTypeDefault;
  }
  
  return msalPromptType;
}

-(UIModalPresentationStyle)getPresentationStyle:(nonnull NSString *)style {
  UIModalPresentationStyle presentationStyle = UIModalPresentationPageSheet;
  
  if ([style isEqualToString:UIModalPresentationStyleFullScreen]) {
    presentationStyle = UIModalPresentationFullScreen;
  } else if ([style isEqualToString:UIModalPresentationStylePageSheet]) {
    presentationStyle = UIModalPresentationPageSheet;
  } else if ([style isEqualToString:UIModalPresentationStyleFormSheet]) {
    presentationStyle = UIModalPresentationFormSheet;
  } else if ([style isEqualToString:UIModalPresentationStyleCurrentContext]) {
    presentationStyle = UIModalPresentationCurrentContext;
  } else if ([style isEqualToString:UIModalPresentationStyleCustom]) {
    presentationStyle = UIModalPresentationCustom;
  } else if ([style isEqualToString:UIModalPresentationStyleOverFullScreen]) {
    presentationStyle = UIModalPresentationOverFullScreen;
  } else if ([style isEqualToString:UIModalPresentationStylePopOver]) {
    presentationStyle = UIModalPresentationPopover;
  } else if ([style isEqualToString:UIModalPresentationStyleNone]) {
    presentationStyle = UIModalPresentationNone;
  } else if ([style isEqualToString:UIModalPresentationStyleAutomatic]) {
    presentationStyle = UIModalPresentationAutomatic;
  }
  
  return presentationStyle;
}

-(MSALWebviewType)getWebViewType:(nonnull NSString *)type {
  MSALWebviewType webviewType = MSALWebviewTypeDefault;
  
  if ([type isEqualToString:WebViewTypeDefault]) {
    webviewType = MSALWebviewTypeDefault;
  } else if ([type isEqualToString:WebviewTypeAuthenticationSession]) {
    webviewType = MSALWebviewTypeAuthenticationSession;
  } else if ([type isEqualToString:WebviewTypeSafariViewController]) {
    webviewType = MSALWebviewTypeSafariViewController;
  } else if ([type isEqualToString:WebviewTypeWKWebView]) {
    webviewType = MSALWebviewTypeWKWebView;
  }
  
  return webviewType;
}

- (NSArray<MSALAuthority *> * _Nullable)getKnownAuthorities:(NSArray<NSString *> *)knownAuthorities
                                                      error:(NSError * _Nullable __autoreleasing * _Nullable)error
                                            failedAuthority:(NSString * _Nullable __autoreleasing * _Nullable)failedAuthority {
  NSMutableArray<MSALAuthority *> *msalAuthorities = [NSMutableArray array];
  
  for (NSString *authorityString in knownAuthorities) {
    NSURL *authorityURL = [NSURL URLWithString:authorityString];
    MSALAuthority *authority = [MSALAuthority authorityWithURL:authorityURL error:error];
    
    if (*error) { // If an error occurs, return nil immediately
      if (failedAuthority) {
        *failedAuthority = authorityString; // Capture the failing authority
      }
      return nil;
    }
    
    [msalAuthorities addObject:authority];
  }
  
  return [msalAuthorities copy]; // Return an immutable NSArray
}

- (id<MSALAuthenticationSchemeProtocol>)getAuthenticationScheme:(NSString *)scheme {
  if ([scheme isEqualToString:@"Bearer"]) {
    return [[MSALAuthenticationSchemeBearer alloc] init];
  } else if ([scheme isEqualToString:@"Pop"]) {
    [MSALAuthenticationSchemePop alloc];
  }
  return nil; // Return nil if no matching scheme is found
}

// MARK: React Native Export Methods
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  NSNumber *result = @(a * b);
  resolve(result);
}

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
    NSArray<MSALAuthority *> *msalAuthorities = [self getKnownAuthorities:knownAuthorities error:&authorityError failedAuthority:&failedAuthority];
    
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
    msalConfig.sliceConfig = [MsalModalHelper convertConfigIntoSliceConfig:sliceConfig];
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
    
    MSALWebviewParameters *webParameters = [[MSALWebviewParameters alloc] initWithAuthPresentationViewController:viewController];
    //  presentationStyle
    NSString* presentationStyle = [RCTConvert NSString:config[@"presentationStyle"]];
    if (presentationStyle) {
      webParameters.presentationStyle = [strongSelf getPresentationStyle:presentationStyle];
    }
    //  prefersEphemeralWebBrowserSession
    BOOL prefersEphemeralWebBrowserSession = [RCTConvert BOOL:config[@"prefersEphemeralWebBrowserSession"]];
    webParameters.prefersEphemeralWebBrowserSession = prefersEphemeralWebBrowserSession;
    
    //  webviewType
    NSString* webviewType = [RCTConvert NSString:config[@"webviewType"]];
    if (webviewType) {
      webParameters.webviewType = [strongSelf getWebViewType:webviewType];
    }
    
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
      interactiveParams.promptType = [strongSelf getPromptType:promptType];
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
        resolve([MsalModalHelper convertMsalResultToDictionary:result]);
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
