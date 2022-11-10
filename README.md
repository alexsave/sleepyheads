This is the Sleepyheads app.

A thing to note is that react-native-health didn't have all the functionality I needed it to have when I started working on this.
As such, I have manually added changes from https://github.com/agencyenterprise/react-native-health/pull/247/.
Might as well fork at this point.
Run this to copy the manual changes 

`cp RCTAppleHealthKit+Queries.m node_modules/react-native-health/RCTAppleHealthKit/`

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


Use this package, or native SIWA code with Swift and decode the idToken from Apple, to get the email and name of your user. DONE
Sign in with amplify with authenticationFlowType: "CUSTOM_AUTH", DONE
You'll have to implement 3 lambdas to define auth challenge, create auth challenge, and verify auth challenge response DONE
Add them as hooks to your Cognito user pool DONE
If your sign-in errors out with UserNotFoundException then sign Up with randomized password
If your sign in receives challengeName CUSTOM_CHALLENGE, respond with the idToken you've got from apple
In your verify challenge response hook use verifyAppleToken npm package to validate the token
In your define auth hook, issue the tokens, voila = you're signed in with your cognito user!
You might have to verify nonce for extra security
