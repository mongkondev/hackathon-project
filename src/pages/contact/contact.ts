import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

declare var firebase;
declare var _;

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public data = {
    mobile_phone : null,
    email : null,
    description : null,
    name : null,
    uid : null,
    productId : null,
    created_at : null,
  }

  public item

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public loadCtrl: LoadingController,
  ) {
    this.item = this.navParam.data

    var user = firebase.auth().currentUser;

    if(user){

      //if(user.mobile_phone){
        this.data.name = user.displayName
      //}

      //if(user.mobile_phone){
        this.data.email = user.email
      //}

      //if(user.mobile_phone){
        this.data.mobile_phone = user.phoneNumber
      //}
    }

  }

  save(){

    let loading = this.loadCtrl.create()
    loading.present()

    let userNotify = firebase.database().ref('userNotify/' + this.item.uid)

    var user = firebase.auth().currentUser;

    if(user){
      this.data.uid = user.uid
    }

    if(this.data.mobile_phone){

      var userRef = firebase.database().ref('userProfile/' + user.uid + '/mobile_phone')
      userRef.set(this.data.mobile_phone)

    }

    this.data.productId = this.item._id
    this.data.created_at = firebase.database.ServerValue.TIMESTAMP

    userNotify.push(this.data).then(()=>{

      this.data = {
        mobile_phone : null,
        email : null,
        description : null,
        name : null,
        uid : null,
        productId : null,
        created_at : null,
      }

      loading.dismiss()
      this.navCtrl.pop()

    })

    
    

    

    /*firebase.database().ref('userNotify/' + item.uid).on('value', (snapshot) => {

    })*/

  }

}
