#import <Foundation/Foundation.h>
#import "MSAL/MSAL.h"

@interface MsalNativeHelper : NSObject

// Convert NSDictionary to a JSON-serializable format
+ (NSDictionary *)convertDictionary:(NSDictionary *)dictionary;

// Convert NSArray to a JSON-serializable format
+ (NSArray *)convertArray:(NSArray *)array;

+ (MSALHttpMethod)getHttpMethod:(NSString *)method;

+ (id<MSALAuthenticationSchemeProtocol>)authenticationSchemeFromConfig:(NSDictionary *)config;

@end
