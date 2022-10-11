//
//  Background.m
//  sleepyheads
//
//  Created by Alex Saveliev on 10/9/22.
//

#import <Foundation/Foundation.h>


#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Background, NSObject)

RCT_EXTERN_METHOD(increment)
RCT_EXTERN_METHOD(startObservingStepCount)

@end
