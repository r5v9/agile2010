//
//  main.m
//  phonegap-iphone
//
//  Created by David Reed on 5/08/10.
//  Copyright __MyCompanyName__ 2010. All rights reserved.
//

#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"phonegap_iphoneAppDelegate");
    [pool release];
    return retVal;
}
