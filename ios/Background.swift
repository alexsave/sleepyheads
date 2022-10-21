//
//  File.swift
//  sleepyheads
//
//  Created by Alex Saveliev on 10/9/22.
//

import Foundation
import HealthKit

@objc(Background)
class Background: NSObject {
  let healthKitStore: HKHealthStore = HKHealthStore()
  let sampleType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
  
  override init() { }
  
  // I might just call this from react itself, that way we can do logic there
  @objc public func startObservingStepCount() {
    print("startObserving called")
    let center = UNUserNotificationCenter.current()
    
    let read: Set<HKObjectType> = Set(arrayLiteral:
                                        HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
                                      HKObjectType.quantityType(forIdentifier: .stepCount)!)
    
    let write: Set<HKSampleType> = Set(arrayLiteral: HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!)
    // health auth has to come first
    healthKitStore.requestAuthorization(toShare: write, read: read) { granted, error in
      if let error = error {
        print(error)
      } else {
        
        center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
          
          if let error = error {
            print(error)
          } else {
            let query: HKObserverQuery = HKObserverQuery(sampleType: self.sampleType, predicate: nil, updateHandler: self.sleepChangedHandler)
            self.healthKitStore.execute(query)
            
            self.healthKitStore.enableBackgroundDelivery(for: self.sampleType, frequency: HKUpdateFrequency.immediate) { (success: Bool, error: Error!) in
              if (success) {
                print("Enabled background delivery of step count")
                
              } else {
                if let theError = error{
                  print("Failed to enable background delivery of step count. ")
                  print("Error = \(theError)")
                }
              }
            }
          }
        }
      }
    }
    
    
  }
  
  func sleepChangedHandler(query: HKObserverQuery!, completionHandler: HKObserverQueryCompletionHandler, error: Error!){
    completionHandler()
    
    if let theError = error{
      print("Observer query failed. ")
      print("Error = \(theError)")
    }
    
    
    
    // Run the query.
    // Actually query the stepcount changes
    let sampleQuery: HKSampleQuery = HKSampleQuery(sampleType: sampleType,
                                                   predicate: nil,
                                                   limit: HKObjectQueryNoLimit, // one day should be fine
                                                   sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]) { (query, samples, error) in
      
      if let error = error {
        // Handle errors here.
        print("Query results handler error = \(error)")
      }
      
      
      
      // note: the query works fine
      // Process the samples here.
      // Send notification
      let content = UNMutableNotificationContent()
      content.title = "New sleep available"
      
      let casted = samples! as! [HKCategorySample]
      
      let lastInbedSample = casted.filter { sample in
        return HKCategoryValueSleepAnalysis.inBed.rawValue == sample.value
      }.last!
      
      
      // here, we check if it's actually a new sleep
      
      // not the biggest fan of this, as we'll probably be doing something similar in React
      let defaults = UserDefaults.standard
      let lastFound: Int = defaults.integer(forKey: "lastSleepFound")
      
      let x = Int(lastInbedSample.endDate.timeIntervalSince1970)
      
      if (x > lastFound) {
        defaults.set(x, forKey: "lastSleepFound")
        
        
        // add and notify
        content.body = "\(lastInbedSample.value) type from \(lastInbedSample.startDate.description(with: .current)) to \(lastInbedSample.endDate.description(with: .current)) from thread \(Thread.current)"
        if #available(iOS 13.0, *) {
          content.targetContentIdentifier = "importScreen"
        }
        
        let uuidString = UUID().uuidString
        let request = UNNotificationRequest(identifier: uuidString, content: content, trigger: nil)
        
        let notificationCenter = UNUserNotificationCenter.current()
        notificationCenter.add(request) {error in
          if let theError = error {
            print("Couldn't notify user. ")
            print("Error = \(theError)")
          }
        }
        
      }
      //else dw about it
      
      
      
      
      
      
      
    }
    healthKitStore.execute(sampleQuery)
    
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
