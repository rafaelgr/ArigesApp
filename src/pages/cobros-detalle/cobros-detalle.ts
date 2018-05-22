import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';
/**
 * Generated class for the CobrosDetallePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cobros-detalle',
  templateUrl: 'cobros-detalle.html',
})
export class CobrosDetallePage {
  settings: any;
  cliente: any = {};
  cobro = {
  };
  


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {
  }

  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.loadData();
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {
          //this.loadData();
        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  loadData() :void {
    this.cliente = this.interData.getCliente();
    this.cobro = this.navParams.get('cobro');
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

}
