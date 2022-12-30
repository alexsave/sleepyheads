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
        return
      }
      
      center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
        if let error = error {
          print(error)
          return
        }
        
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
        
        // also will be different content if auto upload
        let autoU: Bool = defaults.bool(forKey: "autoUploadSleep")
        
        if (autoU) {
          content.title = "New sleep available for upload"
        } else {
          content.title = "New sleep uploaded"
        }
        
        // Can we wake up the app and save to async storage from here? Yes, we do
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM-dd-yyyy HH:mm"
        dateFormatter.locale = .current
        let startD = dateFormatter.string(from: lastInbedSample.startDate)
        let endD = dateFormatter.string(from : lastInbedSample.endDate)
        
        // add and notify
        // no I don't like this
        content.body = "Sleep from \(startD) to \(endD)"
        
        // you upload from the feed screen if it's the most recent
        if #available(iOS 13.0, *) {
          content.targetContentIdentifier = "feedScreen"
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
