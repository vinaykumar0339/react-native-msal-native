#import "MsalNativeHelper.h"
#import "React/RCTConvert.h"
#import "MsalNativeConstants.h"

@implementation MsalNativeHelper

+ (NSDictionary *)convertDictionary:(NSDictionary *)dictionary {
    if (![dictionary isKindOfClass:[NSDictionary class]]) {
        return @{};
    }
    
    NSMutableDictionary *convertedDict = [[NSMutableDictionary alloc] init];

    for (NSString *key in dictionary) {
        id value = dictionary[key];

        if ([value isKindOfClass:[NSURL class]]) {
            convertedDict[key] = [(NSURL *)value absoluteString]; // Convert NSURL to string
        } else if ([value isKindOfClass:[NSDate class]]) {
            convertedDict[key] = @([(NSDate *)value timeIntervalSince1970]); // Convert NSDate to timestamp
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            convertedDict[key] = [self convertDictionary:value]; // Recursively convert dictionaries
        } else if ([value isKindOfClass:[NSArray class]]) {
            convertedDict[key] = [self convertArray:value]; // Recursively convert arrays
        } else {
            convertedDict[key] = value; // Keep primitive types as they are
        }
    }

    return convertedDict;
}

+ (NSArray *)convertArray:(NSArray *)array {
    if (![array isKindOfClass:[NSArray class]]) {
        return @[];
    }
    
    NSMutableArray *convertedArray = [[NSMutableArray alloc] init];

    for (id value in array) {
        if ([value isKindOfClass:[NSURL class]]) {
            [convertedArray addObject:[(NSURL *)value absoluteString]];
        } else if ([value isKindOfClass:[NSDate class]]) {
            [convertedArray addObject:@([(NSDate *)value timeIntervalSince1970])];
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            [convertedArray addObject:[self convertDictionary:value]];
        } else if ([value isKindOfClass:[NSArray class]]) {
            [convertedArray addObject:[self convertArray:value]];
        } else {
            [convertedArray addObject:value];
        }
    }

    return convertedArray;
}

+ (MSALHttpMethod)getHttpMethod:(NSString *)method {
  NSString *methodString = [method uppercaseString];
     if ([methodString isEqualToString:@"HEAD"]) {
         return MSALHttpMethodHEAD;
     } else if ([methodString isEqualToString:@"POST"]) {
         return MSALHttpMethodPOST;
     } else if ([methodString isEqualToString:@"PUT"]) {
         return MSALHttpMethodPUT;
     } else if ([methodString isEqualToString:@"DELETE"]) {
         return MSALHttpMethodDELETE;
     } else if ([methodString isEqualToString:@"CONNECT"]) {
         return MSALHttpMethodCONNECT;
     } else if ([methodString isEqualToString:@"OPTIONS"]) {
         return MSALHttpMethodOPTIONS;
     } else if ([methodString isEqualToString:@"TRACE"]) {
         return MSALHttpMethodTRACE;
     } else if ([methodString isEqualToString:@"PATCH"]) {
         return MSALHttpMethodPATCH;
     }
     
     return MSALHttpMethodGET; // Default to GET
}


+ (id<MSALAuthenticationSchemeProtocol>)authenticationSchemeFromConfig:(NSDictionary *)config {
  NSString *scheme = [RCTConvert NSString:config[@"scheme"]];
  if (scheme == AuthSchemeBearer) {
    return [[MSALAuthenticationSchemeBearer alloc] init];
  } else if (scheme == AuthSchemePop) {
    NSString *httpMethod = [RCTConvert NSString:config[@"httpMethod"]];
    MSALHttpMethod method = [MsalNativeHelper getHttpMethod:httpMethod];
    NSString *requestUrl = [RCTConvert NSString:config[@"requestUrl"]];
    NSURL *url = [NSURL URLWithString:requestUrl];
    
    NSString *nonce = [RCTConvert NSString:config[@"nonce"]];
    NSDictionary *additionalParameters = [RCTConvert NSDictionary:config[@"additionalParameters"]];
    return [[MSALAuthenticationSchemePop alloc] initWithHttpMethod:method requestUrl:url nonce:nonce additionalParameters:additionalParameters];
  }
  return [MSALAuthenticationSchemeBearer init];
}

@end
