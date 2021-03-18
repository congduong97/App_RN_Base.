//
//  EddyStoneScanner.h
//  yakuodo
//
//  Created by Admin on 9/18/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface EddyStoneScanner : RCTEventEmitter <RCTBridgeModule>
/**
   * Eddystone class initializer
   * @return instancetype
   */
- (instancetype)init;
@end

