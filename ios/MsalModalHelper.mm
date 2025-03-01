#import "MsalModalHelper.h"
#import "MsalNativeHelper.h"
#import <React/RCTConvert.h>

@implementation MsalModalHelper

+ (NSDictionary *)convertMsalResultToDictionary:(MSALResult * _Nonnull)result {
  NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
  
  dictionary[@"accessToken"] = result.accessToken ?: @"";
  dictionary[@"expiresOn"] = result.expiresOn ? @([result.expiresOn timeIntervalSince1970] * 1000) : [NSNull null];
  dictionary[@"extendedLifeTimeToken"] = @(result.extendedLifeTimeToken);
  dictionary[@"idToken"] = result.idToken ?: @"";
  dictionary[@"scopes"] = result.scopes ?: @[];
  
  
  if (result.tenantProfile) {
    dictionary[@"tenantProfile"] = [self convertMsalTenantProfileToDictionary:result.tenantProfile];
  }
  
  if (result.account) {
    dictionary[@"account"] = [self convertMsalAccountToDictionary:result.account];
  }
  
  dictionary[@"authority"] = result.authority.url.absoluteString ?: @"";
  dictionary[@"correlationId"] = result.correlationId.UUIDString ?: [NSNull null];
  dictionary[@"authorizationHeader"] = result.authorizationHeader ?: @"";
  dictionary[@"authenticationScheme"] = result.authenticationScheme ?: @"";
  
  return dictionary;
}

+ (NSDictionary *)convertMsalAccountIdToDictionary:(MSALAccountId *)accoundId {
  NSMutableDictionary *accountIdDict = [NSMutableDictionary dictionary];
  if (accoundId.identifier) {
    accountIdDict[@"identifier"] = accoundId.identifier;
  }
  
  if (accoundId.objectId) {
    accountIdDict[@"objectId"] = accoundId.objectId;
  }
  
  if (accoundId.tenantId) {
    accountIdDict[@"tenantId"] = accoundId.tenantId;
  }
  
  return accountIdDict;
}

+ (NSDictionary *)convertMsalAccountToDictionary:(MSALAccount *)account {
  NSMutableDictionary *accountDict = [NSMutableDictionary dictionary];
  
  if (account.username) {
    accountDict[@"username"] = account.username;
  }
  
  if (account.identifier) {
    accountDict[@"identifier"] = account.identifier;
  }
  
  if (account.environment) {
    accountDict[@"environment"] = account.environment;
  }
  
  if (account.accountClaims) {
    accountDict[@"accountClaims"] = [MsalNativeHelper convertDictionary:account.accountClaims];
  }
  
  if (account.homeAccountId) {
    accountDict[@"homeAccountId"] = [self convertMsalAccountIdToDictionary:account.homeAccountId];
  }
  
  accountDict[@"isSSOAccount"] = @(account.isSSOAccount);
  
  if (account.tenantProfiles) {
    accountDict[@"tenantProfiles"] = [MsalModalHelper convertMsalTenantProfilesToDictionaries:account.tenantProfiles];
  }
  
  return accountDict;
}

+ (NSArray<NSDictionary *> *)convertMsalTenantProfilesToDictionaries:(NSArray<MSALTenantProfile *> *)tenantProfiles {
  NSMutableArray *resultArray = [NSMutableArray array];
  
  for (MSALTenantProfile *profile in tenantProfiles) {
    [resultArray addObject:[self convertMsalTenantProfileToDictionary:profile]];
  }
  
  return resultArray;
}

+ (NSDictionary *)convertMsalTenantProfileToDictionary:(MSALTenantProfile *)tenantProfile {
  NSMutableDictionary *profileDict = [NSMutableDictionary dictionary];
  
  if (tenantProfile.identifier) {
    profileDict[@"identifier"] = tenantProfile.identifier;
  }
  if (tenantProfile.environment) {
    profileDict[@"environment"] = tenantProfile.environment;
  }
  if (tenantProfile.tenantId) {
    profileDict[@"tenantId"] = tenantProfile.tenantId;
  }
  profileDict[@"isHomeTenantProfile"] = @(tenantProfile.isHomeTenantProfile);
  
  if (tenantProfile.claims) {
    profileDict[@"claims"] = [MsalNativeHelper convertDictionary:tenantProfile.claims];
  }
  
  return profileDict;
}

+ (MSALSliceConfig * _Nonnull)convertConfigIntoSliceConfig:(NSDictionary * _Nullable)config {
  MSALSliceConfig *sliceConfig = [MSALSliceConfig init];
  NSString *slice = [RCTConvert NSString:config[@"slice"]];
  if (slice) {
    sliceConfig.slice = slice;
  }

  NSString *dc = [RCTConvert NSString:config[@"dc"]];
  if (dc) {
    sliceConfig.dc = dc;
  }
  
  return sliceConfig;
}



@end
