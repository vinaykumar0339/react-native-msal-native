#import <Foundation/Foundation.h>
#import <MSAL/MSAL.h>

@interface MsalResultHelper : NSObject

+ (NSDictionary *_Nullable)convertMsalResultToDictionary:(MSALResult * _Nonnull)result;
+ (NSArray<NSDictionary *> *_Nullable)convertMsalTenantProfilesToDictionaries:(NSArray<MSALTenantProfile *> *_Nullable)tenantProfiles;
+ (NSDictionary *_Nullable)convertMsalTenantProfileToDictionary:(MSALTenantProfile *_Nullable)tenantProfile;
+ (NSDictionary *_Nullable)convertMsalAccountToDictionary:(MSALAccount *_Nullable)account;
+ (NSDictionary *_Nullable)convertMsalAccountIdToDictionary:(MSALAccountId *_Nullable)accoundId;

@end
