# RecoApi
This Repository represents Reco-App's Firebase Cloud functions. It serves as the app's Rest Api.

## Prerequisites

Node.js
npm
Flutter Sdk

## Notes

1.  Install firebase tools: Use: ```npm install -g firebase-tools```
2. Login using: ```firebase login```
3. Initialize your firebase: ```firebase init``` In this step you need to select your firebase account and the application folder you want to deploy on firebase.
4. Run ```firebase deploy --only functions``` in terminal/CLI to deploy project. Newly created functions should then pop up in the Cloud functions tab inside Firebase Console.

If ```firebase deploy --only functions``` fails, try ```Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass```

To Debug and emulate, run ```npm install -g @google-cloud/functions-emulator``` 
Then, run ```firebase emulators:start --inspect-functions``` to emulate firestore and cloud functions locally.
In your IDE, run 'Attach' on the Node Application.
