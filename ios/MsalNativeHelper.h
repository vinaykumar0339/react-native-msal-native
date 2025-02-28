#import <Foundation/Foundation.h>

@interface MsalNativeHelper : NSObject

// Convert NSDictionary to a JSON-serializable format
+ (NSDictionary *)convertDictionary:(NSDictionary *)dictionary;

// Convert NSArray to a JSON-serializable format
+ (NSArray *)convertArray:(NSArray *)array;

@end
