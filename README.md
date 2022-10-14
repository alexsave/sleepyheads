This is the Sleepyheads app.

A thing to note is that react-native-health didn't have all the functionality I needed it to have when I started working on this.
As such, I have manually added changes from https://github.com/agencyenterprise/react-native-health/pull/247/.
Might as well fork at this point.

Theme color: #2F097E or even #300880

# Design notes:

## Workflow 
So you download the app.
* We need **Sleepyheads** not sleepyheads to appears. ✅
* We need an icon.✅
* We need a custom splash screen.✅
  
Once launched, the first prompt should be 
* to log in or sign up
  * handle this with Amplify login

Once authenticated
* Health permissions
* Notification permissions
* Setting to upload automatically

These three settings have 8 combinations, which will affect background behavior

| Health | Notifications | Auto-Upload | Behavior                                            | 
|--------|---------------|-------------|-----------------------------------------------------|
| N      |               |             | Only manual uploads                                 |   
| Y      | N             | N           | Prompt from within app to upload                    |   
| Y      | N             | Y           | Automatically upload without telling them           |   
| Y      | Y             | N           | Prompt that new sleep is available to upload        |   
| Y      | Y             | Y           | Automatically upload, and tell them to check it out |   

So, background delivery is only enabled if Health & (Notifications | Auto-upload) is enabled
Of course, if health is off notifications are on, they'll get notifications about likes and stuff.

I think we ask for Health access, then notifications, then ask about auto-uploading.
These can be Native modules callable from RN.

Only after the permissions are checked do we set the observer query

Then what? 

On first launch, ask them to upload the most recent month or so of sleep. I like Strava's screen.

