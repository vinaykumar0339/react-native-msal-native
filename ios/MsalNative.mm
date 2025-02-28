#import "MsalNative.h"
#import "MsalNativeHelper.h"
#import "MsalResultHelper.h"

@interface MsalNative ()
@property (nonatomic, strong) MSALPublicClientApplication *application;
@end

@implementation MsalNative

RCT_EXPORT_MODULE()

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
  
  NSError *applicationError = nil;
  _application = [[MSALPublicClientApplication alloc] initWithConfiguration:msalConfig error:&applicationError];
  
  if (applicationError) {
    reject(@"APPLICATION_CREATION_ERROR", @"Error Creating Public Client Application. For more info check the userinfo object", applicationError);
  } else {
    resolve(@"successfully created public client application");
  }
}

RCT_EXPORT_METHOD(acquireToken:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
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
    
    NSArray<NSString *> *scopes = @[];
    MSALInteractiveTokenParameters *interactiveParams = [[MSALInteractiveTokenParameters alloc] initWithScopes:scopes webviewParameters:webParameters];
    
    [strongSelf->_application acquireTokenWithParameters:interactiveParams completionBlock:^(MSALResult * _Nullable result, NSError * _Nullable error) {
      if (error) {
        reject(@"ACQUIRE_TOKEN_ERROR", @"Error While getting token. For more info check the userinfo object", error);
      } else {
        resolve([MsalResultHelper convertMsalResultToDictionary:result]);
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
