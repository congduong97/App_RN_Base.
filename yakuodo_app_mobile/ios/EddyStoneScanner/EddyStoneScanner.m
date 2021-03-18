//
//  EddyStoneScanner.m
//  yakuodo
//
//  Created by Admin on 9/18/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "EddyStoneScanner.h"
#import "BRMBeacon.h"

bool hasListeners = NO;

@interface EddyStoneScanner() <BRMEddystoneReceiveDelegate>

@end

@implementation EddyStoneScanner


RCT_EXPORT_MODULE(EddyStoneScanner);

// react native methods
+ (BOOL)requiresMainQueueSetup { return NO; }

#pragma mark Initialization

- (instancetype)init
{
  if (self = [super init]) {
    [BRMEddystoneReceiveManager sharedManager].delegate = self;
  }

  return self;
}

// Will be called when this module's first listener is added.
- (void)startObserving {
  hasListeners = YES;
}
// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving {
  hasListeners = NO;
}

/**
 * Lists the supported events for the RCTEventEmitter
 * @return NSArray<NSString *> * The supported events list
 */
- (NSArray<NSString *> *)supportedEvents {
  return @[
           @"didRangeBeacons",
           @"didUpdateEnterUIDBeacon",
           @"didUpdateExitUIDBeacon"
           ];
}

/**
 * Exported method that starts scanning for eddystone devices
 * @return void
 */
RCT_EXPORT_METHOD(startScanning) {
  NSLog(@"tranta native startScanning");
  [[BRMEddystoneReceiveManager sharedManager] startMonitoringEddystoneBeacon];
}

/**
 * Exported method that stops scanning for eddystone devices
 * @return void
 */
RCT_EXPORT_METHOD(stopScanning) {
  NSLog(@"tranta native stopScanning");
  [[BRMEddystoneReceiveManager sharedManager] stopMonitoringEddystoneBeacon];
}

RCT_REMAP_METHOD(checkBluetoothPermission, resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  int status = [[BRMEddystoneReceiveManager sharedManager] checkBluetoothPermission];
  NSLog(@"checkbluetoothStatus %d", status);
  switch (status) {
    case 0:
      resolve(@{@"status": @"notDetermined"});
      break;
    case 1:
      resolve(@{@"status": @"restricted"});
      break;
    case 2:
      resolve(@{@"status": @"denied"});
      break;
    default:
      resolve(@{@"status": @"authorized"});
      break;
  }
}

#pragma mark - BRMEddystoneReceiveDelegate
- (void)didRangeBeacons:(NSArray *)beacons {
  NSLog(@"didRangeBeacons");

//    NSMutableArray *beaconArray = [[NSMutableArray alloc] init];
//
//    for (BRMEddystoneUIDBeacon *beacon in beacons) {
//      [beaconArray addObject:@{
//        @"namespace" : beacon.namespaceId,
//        @"instance": beacon.instanceId
//                               }];
//    }
//
//    NSDictionary *event = @{
//       @"beacons": beaconArray
//                            };
//
//  if (self.bridge && hasListeners) {
//    [self sendEventWithName:@"didRangeBeacons" body:event];
//  }
}

- (void)didUpdateEnterUIDBeacon:(BRMEddystoneUIDBeacon *)brmUIDBeacon {
  if (self.bridge && hasListeners) {
    [self sendEventWithName:@"didUpdateEnterUIDBeacon" body:@ {
      @"namespace" : brmUIDBeacon.namespaceId,
      @"instance": brmUIDBeacon.instanceId } ];
  }
}

- (void) didUpdateExitUIDBeacon:(BRMEddystoneUIDBeacon *)brmUIDBeacon {
  if (self.bridge && hasListeners) {
    [self sendEventWithName:@"didUpdateExitUIDBeacon" body:@ {
       @"namespace" : brmUIDBeacon.namespaceId,
       @"instance": brmUIDBeacon.instanceId
    }];
  }
}

- (void)didUpdateBeacon:(BRMEddystoneBeacon *)beacon {
  NSLog(@"%s",__PRETTY_FUNCTION__);
}

@end
