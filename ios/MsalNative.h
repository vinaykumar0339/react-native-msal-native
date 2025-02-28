#ifdef RCT_NEW_ARCH_ENABLED
#import "generated/RNMsalNativeSpec/RNMsalNativeSpec.h"

@interface MsalNative : NSObject <NativeMsalNativeSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MsalNative : NSObject <RCTBridgeModule>
#endif

@end
