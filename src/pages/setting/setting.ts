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
    countProducts = null

    constructor(
        public navCtrl: NavController,
        public event: Events,
        public alertCtrl: AlertController,
    ) {

        this.event.subscribe("firebase:logedIn", ()=>{
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

            firebase.database().ref('userProducts/' + user.uid).on('value', (snapshot) => {
                if(snapshot.val()){
                    this.countProducts = Object.keys(snapshot.val()).length
                }
            });

            /*FirebaseLib.countProducts().then(count=>{
                this.countProducts = count
            })*/
            
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

            FirebaseLib.updateProfile()

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
