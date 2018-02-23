import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-descuentos-especiales',
  templateUrl: 'cli-descuentos-especiales.html',
})
export class CliDescuentosEspecialesPage {

  settings: any;
  cliente: any = {};
  descuentos: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {

  }

  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {
          this.loadData();
        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  loadData(): void {
    this.cliente = this.interData.getCliente();
    this.arigesData.getArticulosDescuentosEspeciales(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.descuentos = this.prepareDescuentos(data);
        },
        (error) => {
          if (error.status == 404) {
            this.showNoEncontrado();
          } else {
            this.showError(error);
          }
        }
      );
  }

  prepareDescuentos(data): any {
    // formateo de valores numéricos
    for (var i = 0; i < data.length; i++) {
      data[i].fechadto = moment(data[i].fechadto).format('DD/MM/YYYY');
      data[i].dtoline1 = numeral(data[i].dtoline1).format('0,0');
      data[i].dtoline2 = numeral(data[i].dtoline2).format('0,0');
    }
    return data;
  }


  showError(error): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: JSON.stringify(error, null, 4),
      buttons: ['OK']
    });
    alert.present();
  }

  showNoEncontrado(): void {
    let alert = this.alertCrtl.create({
      title: "AVISO",
      subTitle: "No se ha encontrado descuentos especiales para este cliente",
      buttons: ['OK']
    });
    alert.present();
  }

}
