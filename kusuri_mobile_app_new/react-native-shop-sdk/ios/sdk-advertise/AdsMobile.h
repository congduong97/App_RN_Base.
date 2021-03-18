//
//  AdsMobile.h
//
//  Created by 
//  Copyright © 2018 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface AdsMobile : NSObject

/*
* Collection information device with userarea
* @params containsLocation
* @params userInfo_memberCode
* @params userInfo_name
* @params userInfo_zipcode
* @params userInfo_birthday
* @params userInfo_gender
* @params userInfo_occupation
* @params userInfo_coexistence
*/
+ (void)collectDeviceInfoWithContainsLocation:(BOOL)containsLocation
                          userInfo_memberCode:(NSString*) memberCode
                                userInfo_name:(NSString*) name
                             userInfo_zipCode:(NSString*) zipcode
                            userInfo_birthday:(NSString*) birthday
                              userInfo_gender:(NSString*) gender
                          userInfo_occupation:(NSString*) occupation
                         userInfo_coexistence:(NSString*) coexistence;
/*
* Collection information device
* @params containsLocation  On/off get current location
*/
+ (void)collectDeviceInfoWithContainsLocation:(BOOL)containsLocation;

/*
 Inittial sdk
 */
+ (void)AdsInitial;

/*
 Regist device token
 */
+ (void)registDeviceToken:(NSData*)token;

/*
 Save member code
 */
+ (void)saveMemberCode:(NSString*)memberCode;

/*
 Get banner
 */
+ (void)getBanner:(void (^)(NSDictionary *result))onFinish;

@end
