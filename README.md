# RecoApi
This Repository represents Reco-App's Firebase Cloud functions. It serves as the app's Rest Api.

## Prerequisites

Node.js
npm
Flutter Sdk

## Notes

Install firebase tools: Use: npm install -g firebase-tools
Login using: firebase login
Initialize your firebase: firebase init In this step you need to select your firebase account and the application folder you want to deploy on firebase.
Run "firebase deploy --only functions" in terminal/CLI to deploy project. Newly created functions should then pop up in the Cloud functions tab inside Firebase Console.

If "firebase deploy --only functions" fails, try "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
