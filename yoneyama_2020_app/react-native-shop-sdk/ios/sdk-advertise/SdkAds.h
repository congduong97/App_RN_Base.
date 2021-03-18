//
//  ADSds.h
//
//  Created by 
//  Copyright © 2018 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_6_0
#error The Shinto Mobile Ads SDK requires a deployment target of iOS 6.0 or later.
#endif

#if defined(__ARM_ARCH_7S__) && __ARM_ARCH_7S__
#error The Shinto Mobile Ads SDK doesn't support linking with armv7s. Remove armv7s from "ARCHS" (Architectures) in your Build Settings.
#endif

#import "AdsDefines.h"
#import "AdsMobile.h"
#import "AdsGeofence.h"
#import "BannerHandler.h"
#import "BannerProtocol.h"
