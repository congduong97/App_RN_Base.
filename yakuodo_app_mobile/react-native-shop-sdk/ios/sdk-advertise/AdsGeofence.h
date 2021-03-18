//
//  AdsGeofence.h
//  sdk-advertise
//
//  Created by  on 4/25/18.
//  Copyright © 2018. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AdsGeofence : NSObject

/*Share object*/
+ (instancetype)shareAdsGeofence;

/*
 @params status  ON/OFF update location in background mode. Default is YES.
*/
- (void)locationUpdateBackgroundMode:(BOOL)status ;

@end
