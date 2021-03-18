//
//  BannerProtocol.h
//  sdk-advertise
//
//  Created by ta.cao.thanh on 9/17/18.
//  Copyright © 2018 Rabiloo. All rights reserved.
//

@protocol BannerProtocol <NSObject>
- (void)webViewDidFinishLoad;
- (void)didFailLoadWithError:(NSError *)error;
- (void)didRedirectToWebBrowser:(NSString*)adsID;
@end
