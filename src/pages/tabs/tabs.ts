import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { SellPage } from '../sell/sell';
import { SettingPage } from '../setting/setting';

declare var firebase;

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SellPage;
  tab3Root = SettingPage;

  constructor(
    public event: Events
  ) {

  }

  onClickHome(){
		//this.getAuth()
	}

  getAuth(){
      var user = firebase.auth().currentUser;
      if(user){
          this.event.publish("firebase:logedIn")
      }
  }

}
