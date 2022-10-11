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
  let sampleType = HKObjectType.quantityType(forIdentifier: .stepCount)!
  
  override init() { }
  
  @objc public func startObservingStepCount() {
    print("startObserving called")
    /*let content = UNMutableNotificationContent()
    content.title = "Background delivery is set"
    content.body = "trying out notifications"
    
    let uuidString = UUID().uuidString
    let request = UNNotificationRequest(identifier: uuidString, content: content, trigger: nil)
    
    let notificationCenter = UNUserNotificationCenter.current()
    notificationCenter.add(request) {error in
      if let theError = error {
        print("Couldn't notify user. ")
        print("Error = \(theError)")
      }
    }*/
    let center = UNUserNotificationCenter.current()
    
    // this is key
    center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
    
      if let error = error {
        print(error)
      } else {
      
      }
    }
    
    
    let query: HKObserverQuery = HKObserverQuery(sampleType: sampleType, predicate: nil, updateHandler: self.stepCountChangedHandler)
    healthKitStore.execute(query)
    
    healthKitStore.enableBackgroundDelivery(for: sampleType, frequency: HKUpdateFrequency.immediate) { (success: Bool, error: Error!) in
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
        content.title = "Mo steps, mo problems"
        content.body = samples![samples!.count-1].debugDescription
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
