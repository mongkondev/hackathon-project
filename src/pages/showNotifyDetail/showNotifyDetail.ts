import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

declare var firebase;
declare var _;

@Component({
  selector: 'page-showNotifyDetail',
  templateUrl: 'showNotifyDetail.html'
})
export class showNotifyDetailPage {

  public item
  public product

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public loadCtrl: LoadingController,
  ) {

    this.item = this.navParam.data

    firebase.database().ref('products/' + this.item.productId).on('value', (snapshot) => {

      this.product = snapshot.val()

      this.product.thumbnail = 'assets/img/no_image_thumb.gif'

      if(this.product.images){
        if(this.product.images[0]){
          this.product.thumbnail = this.product.images[0]
        }
      }

      console.log(this.product)

    })

  }

  numberFormat(text){
    return text.toFixed(2).replace(/./g, function(c, i, a) {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  }

}
