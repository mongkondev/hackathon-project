import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

declare var firebase;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {

      const messaging = firebase.messaging();

      messaging.requestPermission()
      .then(function() {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...

        messaging.getToken()
        .then(function(currentToken) {
          if (currentToken) {
            console.log('currentToken : ', currentToken);
            
            var user = firebase.auth().currentUser;
            if(user){
              var userRef = firebase.database().ref('userFcm/' + user.uid)
              userRef.set(currentToken)
            }

            //sendTokenToServer(currentToken);
            //updateUIForPushEnabled(currentToken);
          } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            //updateUIForPushPermissionRequired();
            //setTokenSentToServer(false);
          }
        })
        .catch(function(err) {
          console.log('An error occurred while retrieving token. ', err);
          //showToken('Error retrieving Instance ID token. ', err);
          //setTokenSentToServer(false);
        });

      })
      .catch(function(err) {
        console.log('Unable to get permission to notify.', err);
      });


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
  }
}
