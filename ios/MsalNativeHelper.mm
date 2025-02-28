#import "MsalNativeHelper.h"

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

@end
