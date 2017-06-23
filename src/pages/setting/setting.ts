import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';

declare var firebase;

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})
export class SettingPage {

    showSignInButton = false

    constructor(public navCtrl: NavController) {
            
        var user = firebase.auth().currentUser;
        if(!user){
            this.showSignInButton = true
        }

    }

    signIn(){
        FirebaseLib.signInGoogle().then((result) => {
            this.showSignInButton = false
        })
    }

}
