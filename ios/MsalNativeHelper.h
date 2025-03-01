#import <Foundation/Foundation.h>
#import "MSAL/MSAL.h"

@interface MsalNativeHelper : NSObject

// Convert NSDictionary to a JSON-serializable format
+ (NSDictionary *_Nullable)convertDictionary:(NSDictionary *_Nullable)dictionary;

// Convert NSArray to a JSON-serializable format
+ (NSArray *_Nullable)convertArray:(NSArray *_Nullable)array;

+ (MSALHttpMethod)getHttpMethod:(NSString *_Nullable)method;

+ (id<MSALAuthenticationSchemeProtocol>_Nullable)authenticationSchemeFromConfig:(NSDictionary *_Nullable)config;

+(MSALPromptType)getPromptType:(nonnull NSString *)type;
+(UIModalPresentationStyle)getPresentationStyle:(nonnull NSString *)style;
+(MSALWebviewType)getWebViewType:(nonnull NSString *)type;
+ (NSArray<MSALAuthority *> * _Nullable)getKnownAuthorities:(NSArray<NSString *> *_Nullable)knownAuthorities
                                                      error:(NSError * _Nullable __autoreleasing * _Nullable)error
                                            failedAuthority:(NSString * _Nullable __autoreleasing * _Nullable)failedAuthority;
+(id<MSALAuthenticationSchemeProtocol>_Nullable)getAuthenticationScheme:(NSString *_Nonnull)scheme;

@end
