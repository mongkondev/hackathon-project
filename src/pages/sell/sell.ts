import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';

declare var firebase;

@Component({
    selector: 'page-sell',
    templateUrl: 'sell.html'
})
export class SellPage {

    public showSignInButton = false
    public data = {}

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController
    ) {
        
        var user = firebase.auth().currentUser;
        if(!user){
            this.showSignInButton = true
        }

    }

    save(){
        console.log(this.data)
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
            
        })
    }

}
