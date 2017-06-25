import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';
import FirebaseLib from '../../services/firebaseLib';

import { ShowNotifyPage } from '../showNotify/showNotify';

declare var firebase;
declare var _;

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})
export class SettingPage {

    showSignInButton = false
    countProducts = null
    notifys = []

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

            firebase.database().ref('userNotify/' + user.uid).on('value', (snapshot) => {

                this.notifys = []

                snapshot.forEach((childSnapshot) => {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    childData._id = childKey

                    this.notifys.push(childData)
                });

                this.notifys = _.orderBy(this.notifys, 'created_at', 'desc');

            });

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

    showNotifys(){

        console.log(this.notifys)

        this.navCtrl.push(ShowNotifyPage, {
            items : this.notifys
        })
    }

    showProfile(){

    }

}
