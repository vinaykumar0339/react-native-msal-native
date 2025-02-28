#import "MsalNative.h"

@interface MsalNative ()
@property (nonatomic, strong) MSALPublicClientApplication *application;
@end

@implementation MsalNative

RCT_EXPORT_MODULE()

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
    reject(@"invalid_clientId", @"clientId is missing or invalid", nil);
    return;
  }
  
  NSString *redirectUri = [RCTConvert NSString:config[@"redirectUri"]];
  NSString *nestedAuthBrokerClientId = [RCTConvert NSString:config[@"nestedAuthBrokerClientId"]];
  NSString *nestedAuthBrokerRedirectUri = [RCTConvert NSString:config[@"nestedAuthBrokerRedirectUri"]];
  NSString *authority = [RCTConvert NSString:config[@"authority"]];
  
  if (!authority) {
    reject(@"invalid_authority", @"authority is missing or invalid", nil);
    return;
  }
  NSURL *authorityURL = [NSURL URLWithString:authority];
  
  NSError *authorityError = nil;
  MSALAuthority *msalAuthority = [MSALAuthority authorityWithURL:authorityURL error:&authorityError];
  
  if (authorityError) {
    reject(@"invalid_authority", @"Invalid authority URL. For more info check the userinfo object", authorityError);
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


#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeMsalNativeSpecJSI>(params);
}
#endif

@end
