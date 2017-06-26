import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { showNotifyDetailPage } from '../showNotifyDetail/showNotifyDetail';

declare var firebase;
declare var _;

@Component({
  selector: 'page-showNotify',
  templateUrl: 'showNotify.html'
})
export class ShowNotifyPage {

  public items

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public loadCtrl: LoadingController,
  ) {

    this.items = this.navParam.get("items")

  }

  detail(item){
    this.navCtrl.push(showNotifyDetailPage, item)
  }

}
