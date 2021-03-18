//
//  ADSdsDefines.h
//
//  Created by 
//  Copyright © 2018 . All rights reserved.
//

#if defined(__cplusplus)
#define ADS_EXTERN extern "C" __attribute__((visibility("default")))
#else
#define ADS_EXTERN extern __attribute__((visibility("default")))
#endif  // defined(__cplusplus)

#if defined(__has_feature) && defined(__has_attribute)
#if __has_feature(attribute_deprecated_with_message)
#define ADS_DEPRECATED_MSG_ATTRIBUTE(s) __attribute__((deprecated(s)))
#elif __has_attribute(deprecated)
#define ADS_DEPRECATED_MSG_ATTRIBUTE(s) __attribute__((deprecated))
#else
#define ADS_DEPRECATED_MSG_ATTRIBUTE(s)
#endif  // __has_feature(attribute_deprecated_with_message)
#if __has_attribute(deprecated)
#define ADS_DEPRECATED_ATTRIBUTE __attribute__((deprecated))
#else
#define ADS_DEPRECATED_ATTRIBUTE
#endif  // __has_attribute(deprecated)
#else
#define ADS_DEPRECATED_ATTRIBUTE
#define ADS_DEPRECATED_MSG_ATTRIBUTE(s)
#endif  // defined(__has_feature) && defined(__has_attribute)

#ifndef IBInspectable
#define IBInspectable
#endif

// Available starting in Xcode 6.3.
#if __has_feature(nullability)
#define ADS_NULLABLE_TYPE __nullable
#define ADS_NONNULL_TYPE __nonnull
#define ADS_NULLABLE nullable
#define ADS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_BEGIN
#define ADS_ASSUME_NONNULL_END NS_ASSUME_NONNULL_END
#else
#define ADS_NULLABLE_TYPE
#define ADS_NONNULL_TYPE
#define ADS_NULLABLE
#define ADS_ASSUME_NONNULL_BEGIN
#define ADS_ASSUME_NONNULL_END
#endif  // __has_feature(nullability)

// Available starting in Xcode 7.3.
#if __has_attribute(objc_boxable)
#define ADS_BOXABLE __attribute__((objc_boxable))
#else
#define ADS_BOXABLE
#endif  // __has_attribute(objc_boxable)

// Available starting in Xcode 8.0.
#if defined(NS_STRING_ENUM)
#define ADS_STRING_ENUM NS_STRING_ENUM
#else
#define ADS_STRING_ENUM
#endif
