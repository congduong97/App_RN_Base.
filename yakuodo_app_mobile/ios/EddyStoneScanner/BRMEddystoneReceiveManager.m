//
//  BRMEddystoneReceiveManager.m
//
//  Copyright (c) 2015 koutalou
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

#import "BRMBeacon.h"
#import "BRMEddystoneReceiveManager.h"

@implementation BRMEddystoneBeacon

@end

@implementation BRMEddystoneUIDBeacon

- (BRMEddystoneUIDBeacon *)initWithAdvertiseData:(NSData *)advertiseData
{
    self = [super init];
    self.advertiseData = [advertiseData copy];
    
    unsigned long advertiseDataSize = advertiseData.length;
    
    if (self) {
        // On the spec, its 20 bytes. But some beacons doesn't advertise the last 2 RFU bytes.
        NSAssert1(!(advertiseDataSize < 18), @"Invalid advertiseData:%@", advertiseData);
        
        const unsigned char *cData = [advertiseData bytes];
        unsigned char *data;
        
        // Malloc advertise data for char*
        data = malloc(sizeof(unsigned char) * advertiseDataSize);
        NSAssert(data, @"failed to malloc");
        
        for (int i = 0; i < advertiseDataSize; i++) {
            data[i] = *cData++;
        }
        
        unsigned char txPowerChar = *(data+1);
        if (txPowerChar & 0x80) {
            self.txPower = [NSNumber numberWithInt:(- 0x100 + txPowerChar)];
        }
        else {
            self.txPower = [NSNumber numberWithInt:txPowerChar];
        }
        
        self.namespaceId = [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",*(data+2), *(data+3), *(data+4), *(data+5), *(data+6), *(data+7), *(data+8), *(data+9), *(data+10), *(data+11)];
        self.instanceId = [NSString stringWithFormat:@"%02x%02x%02x%02x%02x%02x",*(data+12), *(data+13), *(data+14), *(data+15), *(data+16), *(data+17)];
        
        // Free advertise data for char*
        free(data);
    }
    return self;
}

@end

@interface BRMEddystoneReceiveManager ()

@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic) int bluetoothStatus;

@end

@implementation BRMEddystoneReceiveManager

+ (BRMEddystoneReceiveManager *)sharedManager
{
    static BRMEddystoneReceiveManager *sharedSingleton;
    static dispatch_once_t oncePredicate;
    
    dispatch_once(&oncePredicate, ^{
        sharedSingleton = [[BRMEddystoneReceiveManager alloc] init];
    });
    
    return sharedSingleton;
}

- (id)init {
    self = [super init];
//    if (self) {
//        [self startMonitoringEddystoneBeacon];
//        _monitoringEddystoneBeacons = [@[] mutableCopy];
//    }
    self.bluetoothStatus = 0;
    return self;
}

- (void)startMonitoringEddystoneBeacon
{
  if (self) {
    if (_centralManager != nil && [_centralManager isScanning])
      return;
    NSLog(@"tranta1 startMonitoringEddystoneBeacon");
     _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
    _monitoringEddystoneBeacons = [@[] mutableCopy];
  }
}

- (void) stopMonitoringEddystoneBeacon {
  if (self) {
    if (_centralManager != nil && [_centralManager isScanning]){
      NSLog(@"tranta1 stopMonitoringEddystoneBeacon");
      [_centralManager stopScan];
    }
  }
}

- (BRMFrameType)getFrameTypeWithAdvertiseData:(NSData *)advertiseData
{
    unsigned long advertiseDataSize = advertiseData.length;
    
    if (advertiseDataSize == 0) {
        return kBRMEddystoneUnknownFrameType;
    }
    
    const unsigned char *cData = [advertiseData bytes];
    
    if (*cData == 0x00) {
        return kBRMEddystoneUIDFrameType;
    }
    else if (*cData == 0x10) {
        return kBRMEddystoneURLFrameType;
    }
    else if (*cData == 0x20) {
        return kBRMEddystoneTLMFrameType;
    }
    
    return kBRMEddystoneUnknownFrameType;
}

- (BRMEddystoneUIDBeacon *)getFoundSameUIDEddystoneBeacon:(BRMEddystoneUIDBeacon *)eddystoneBeacon
{
    for (BRMEddystoneUIDBeacon *cmpBeacon in _monitoringEddystoneBeacons) {
        if (![eddystoneBeacon.namespaceId isEqualToString:cmpBeacon.namespaceId]) {
            continue;
        }
        if (![eddystoneBeacon.instanceId isEqualToString:cmpBeacon.instanceId]) {
            continue;
        }
        
        return cmpBeacon;
    }
    
    return nil;
}

- (void)updateUIDEddystoneBeacon:(BRMEddystoneUIDBeacon *)eddystoneBeacon rssi:(NSNumber *)rssi
{
  
    NSAssert(eddystoneBeacon, @"eddystoneBeacon must not be nil.");
 
   
    BRMEddystoneUIDBeacon *sameBeacon = [self getFoundSameUIDEddystoneBeacon:eddystoneBeacon];
    if (sameBeacon) {
        // Update Beacon
        
        // RSSI 127 is Error case
        if ([rssi integerValue] != 127) {
            [sameBeacon.rssis addObject:rssi];
            if (sameBeacon.rssis.count >10) {
                [sameBeacon.rssis removeObjectAtIndex:0];
            }
            
            float average = 0;
            for (NSNumber *rssi in sameBeacon.rssis) {
                average = average + [rssi integerValue];
            }
            average = average / sameBeacon.rssis.count;
            sameBeacon.averageRssi = [NSNumber numberWithFloat:average];
        }
        NSDate *date = [NSDate date];
        NSTimeInterval passedTime = [date timeIntervalSinceDate:sameBeacon.lastUpdateDate];
      
      if (passedTime > 24 * 60 * 60) {
        NSLog(@"tranta Update beacon enter passedTime %f", passedTime);
        [self enterBeacon:eddystoneBeacon];
      }
      sameBeacon.lastUpdateDate = date;
        if ([eddystoneBeacon.advertiseData isEqualToData:sameBeacon.advertiseData]) {
            // No update advertiseData
            return;
        }
      NSLog(@"tranta Update beacon information");
        // Update beacon information
        BRMEddystoneUIDBeacon *uidBeacon = (BRMEddystoneUIDBeacon *)eddystoneBeacon;
        BRMEddystoneUIDBeacon *sameUIDBeacon = (BRMEddystoneUIDBeacon *)sameBeacon;
        sameUIDBeacon.txPower = uidBeacon.txPower;
        sameUIDBeacon.namespaceId = uidBeacon.namespaceId;
        sameUIDBeacon.instanceId = uidBeacon.instanceId;
    }
    else {
        // Found New Beacon
        eddystoneBeacon.rssis = [@[rssi] mutableCopy];
        
        // RSSI 127 is Error case
        if ([rssi integerValue] != 127) {
            eddystoneBeacon.averageRssi = rssi;
        }
        [_monitoringEddystoneBeacons addObject:eddystoneBeacon];

        eddystoneBeacon.lastUpdateDate = [NSDate date];

        [self enterBeacon:eddystoneBeacon];
    }
    
//    if ([_delegate respondsToSelector:@selector(didUpdateBeacon:)]) {
//        [_delegate didUpdateBeacon:sameBeacon];
//    }
}


- (CBUUID *)getEddystoneServiceID {
    static CBUUID *_singleton;
    static dispatch_once_t oncePredicate;
    
    dispatch_once(&oncePredicate, ^{
        _singleton = [CBUUID UUIDWithString:kBRMEddystoneServiceID];
    });
    
    return _singleton;
}

- (void)enterBeacon:(BRMEddystoneUIDBeacon *)eddystoneBeacon
{
  if ([_delegate respondsToSelector:@selector(didUpdateEnterUIDBeacon:)]) {
      [_delegate didUpdateEnterUIDBeacon:(BRMEddystoneUIDBeacon *)eddystoneBeacon];
  }
}

- (void)exitBeacon:(BRMEddystoneUIDBeacon *)eddystoneBeacon
{
    if ([_delegate respondsToSelector:@selector(didUpdateExitUIDBeacon:)]) {
      [_delegate didUpdateExitUIDBeacon:(BRMEddystoneUIDBeacon *)eddystoneBeacon];
    }
}

-(int) checkBluetoothPermission {
  return self.bluetoothStatus;
}

#pragma mark - CentralManager Delegate

- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary *)advertisementData RSSI:(NSNumber *)RSSI
{
    BRMDLog(@"RSSI: %@\nAdvertisementData: %@", RSSI, advertisementData);
    
    NSDictionary *advertiseDataDictionay = [advertisementData objectForKey:CBAdvertisementDataServiceDataKey];
    NSData *advertiseData = advertiseDataDictionay[[self getEddystoneServiceID]];
    
    BRMFrameType frameType = [self getFrameTypeWithAdvertiseData:advertiseData];
    if(frameType == kBRMEddystoneUIDFrameType) {
      BRMEddystoneUIDBeacon *beacon;
      beacon = [[BRMEddystoneUIDBeacon alloc] initWithAdvertiseData:advertiseData];

      if (beacon) {
        beacon.frameType = frameType;
        beacon.identifier = peripheral.identifier.UUIDString;
        [self updateUIDEddystoneBeacon:beacon rssi:RSSI];
      }
    }
}

- (void)centralManagerDidUpdateState:(CBCentralManager *)central
{
    BRMDLog(@"State: %ld", central.state);
    
    NSArray *services = @[[CBUUID UUIDWithString:kBRMEddystoneServiceID]];
    
    NSDictionary *options = [NSDictionary dictionaryWithObject:[NSNumber numberWithBool:YES] forKey:CBCentralManagerScanOptionAllowDuplicatesKey];
    
    if (_centralManager.state == CBCentralManagerStatePoweredOn) {
        [_centralManager scanForPeripheralsWithServices:services options:options];
    }
  
  if (@available(iOS 13.0, *)) {
    if (central.authorization == CBManagerAuthorizationAllowedAlways) {
      self.bluetoothStatus = 3;
    } else if (central.authorization == CBManagerAuthorizationNotDetermined) {
      self.bluetoothStatus = 0;
    } else if (central.authorization == CBManagerAuthorizationDenied){
      self.bluetoothStatus = 2;
    } else {
      self.bluetoothStatus = 1;
    }
  } else {
    self.bluetoothStatus = 3;
  }
    
    return;
}

@end
