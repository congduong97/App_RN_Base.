
#import "ShopSdk.h"
#if __has_include("SdkAds.h")
#import "SdkAds.h"
#else
#import <sdk-advertise/SdkAds.h>
#endif

#import <React/RCTConvert.h>
// #import <React/RCTBridgeModule.h>


@implementation ShopSdk

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(test:(NSString *) appId callback:(RCTResponseSenderBlock) callback){
    callback(@[appId]);
}
RCT_EXPORT_METHOD(collectDeviceInfoWithContainsLocation:(BOOL )containsLocation
memberCode:(NSString *)memberCode
name:(NSString *)name
zipCode:(NSString *)zipCode
 birthday:(NSString *)birthday
 gender:(NSString *)gender
 occupation:(NSString *)occupation
 coexistence:(NSString *)coexistence
 callback:(RCTResponseSenderBlock)callback ){

     //NẾU BỎ NHỮNG DÒNG LIÊN QUAN ĐẾN VIỆC GỌI HÀM CỦA AdsMobile,AdsGeofence, BannerHandler THÌ CÓ K PHÁT SINH LỖI KHI BUILD
    callback(@[]);
    [AdsMobile collectDeviceInfoWithContainsLocation:containsLocation
                                 userInfo_memberCode:memberCode userInfo_name: name userInfo_zipCode:zipCode
                                   userInfo_birthday: birthday userInfo_gender: gender
                                 userInfo_occupation: occupation userInfo_coexistence:coexistence];
}
RCT_EXPORT_METHOD(showBannerWithData: (NSDictionary *)data ){
    [BannerHandler showBannerWithData:data];
}

RCT_EXPORT_METHOD(saveMemberCode:(NSString *) memberCode){
        [AdsMobile saveMemberCode: memberCode];
}
RCT_EXPORT_METHOD(locationUpdateBackgroundMode: (BOOL)status ){
       [[AdsGeofence shareAdsGeofence] locationUpdateBackgroundMode:status];
}

RCT_EXPORT_METHOD(registDeviceToken: (NSString *)deviceToken memberCode:(NSString *)memberCode ){

    NSLog(@"device token is : %@",deviceToken);

    NSMutableData *commandToSend= [[NSMutableData alloc] init];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0','\0','\0'};
    int i;
    for (i=0; i < [deviceToken length]/2; i++) {
        byte_chars[0] = [deviceToken characterAtIndex:i*2];
        byte_chars[1] = [deviceToken characterAtIndex:i*2+1];
        whole_byte = strtol(byte_chars, NULL, 16);
        [commandToSend appendBytes:&whole_byte length:1];
    }
    NSLog(@"%@", commandToSend);

   [AdsMobile registDeviceToken: commandToSend ];
}

RCT_REMAP_METHOD(init,
                resolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject){
  [AdsMobile AdsInitial];
}

RCT_EXPORT_METHOD(getUserAds: (RCTResponseSenderBlock) callback){
    [AdsMobile getBanner:^(NSDictionary *result) {
        if(result){
         callback(@[result]);
        } else {
        callback(@[]);
        }
    }];
}

@end

