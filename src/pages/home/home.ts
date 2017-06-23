import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public items = []

  constructor(public navCtrl: NavController) {
    this.items = [
      1,2,3,4,5,6,7,8,9
    ]
  }

}
