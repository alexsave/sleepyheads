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
            let query: HKObserverQuery = HKObserverQuery(sampleType: self.sampleType, predicate: nil, updateHandler: self.stepCountChangedHandler)
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
  
  func stepCountChangedHandler(query: HKObserverQuery!, completionHandler: HKObserverQueryCompletionHandler, error: Error!){
    if let theError = error{
      print("Observer query failed. ")
      print("Error = \(theError)")
    }
    
    // Run the query.
    // Actually query the stepcount changes
    let query: HKSampleQuery = HKSampleQuery(sampleType: sampleType,
                                             predicate: nil,
                                             limit: HKObjectQueryNoLimit, // one day should be fine
                                             sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]) { (query, samples, error) in
      
      if let error = error {
        // Handle errors here.
        print("Query results handler error = \(error)")
      }
      
      // note: the query works fine
      DispatchQueue.main.async {
        // Process the samples here.
        // Send notification
        let content = UNMutableNotificationContent()
        content.title = "Mo sleep, mo problems"
        content.body = "\(samples![samples!.count-1].debugDescription) from thread \(Thread.current)"
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
    }
    healthKitStore.execute(query)
    
    completionHandler()
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
