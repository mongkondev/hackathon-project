import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

declare var firebase;
declare var _;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public items = []
  public isLoading = false

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {

    this.isLoading = true

    let loading = this.loadingCtrl.create()
    loading.present()

    //var products = firebase.database().ref('products').orderByKey().limitToLast(2).endAt('-KnSsEXq9TpffsBw46yM').on('value', (snapshot) => {
    var products = firebase.database().ref('products').on('value', (snapshot) => {
      this.items = []

      console.log(snapshot.val())

      snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        childData.thumbnail = 'assets/img/no_image_thumb.gif'

        if(childData.images){
          if(childData.images[0]){
            childData.thumbnail = childData.images[0]
          }
        }

        this.items.push(childData)
      });

      this.items = _.orderBy(this.items, 'created_at', 'desc');

      loading.dismiss()
      this.isLoading = false

    });

  }

  openGoogleMap(item){
    console.log(item.latlng)
    window.open('https://maps.google.com?q='+item.latlng);
  }

  numberFormat(text){
    return text.toFixed(2).replace(/./g, function(c, i, a) {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  }

}
