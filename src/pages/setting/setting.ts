import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';

declare var firebase;

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})
export class SettingPage {

    showSignInButton = false

    constructor(
        public navCtrl: NavController,
        public event: Events,
        public alertCtrl: AlertController,
    ) {

        this.event.subscribe("firebase:logedIn", ()=>{
            console.log("has firebase:logedIn in setting")
            this.getAuth()
        })

        this.getAuth()

    }

    getAuth(){
        var user = firebase.auth().currentUser;
        if(!user){
            this.showSignInButton = true
        }else{
            this.showSignInButton = false
        }
    }

    signOut(){
        firebase.auth().signOut().then(function() {
            window.location.reload()
        }, function(error) {
        
        });
    }

    signIn(){

        FirebaseLib.signInGoogle().then((result) => {

            this.showSignInButton = false
            var user = result.user;
            
            let alert = this.alertCtrl.create({
                title: 'Wellcome',
                subTitle: 'Wellcome ' + user.displayName,
                buttons: ['OK']
            });
            alert.present();
            
            this.showSignInButton = false
            this.event.publish("firebase:logedIn")
            
        })
    }

}
