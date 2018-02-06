import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goSettings(): void {
    this.navCtrl.push('SettingsPage');
  }

  goLogin(): void {
    this.navCtrl.push('LoginPage');
  }
}
