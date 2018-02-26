import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-albaranes-detalle',
  templateUrl: 'albaranes-detalle.html',
})
export class AlbaranesDetallePage {

  settings: any;
  cliente: any = {};
  albaran = {
    codtipom: '',
    numalbar: 0
  };
  alb = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController,
    private screenOrientation: ScreenOrientation) {
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
    this.albaran = this.interData.getAlbaran();
    this.arigesData.getAlbaranDetalle(this.settings.url, this.albaran.codtipom, this.albaran.numalbar)
      .subscribe(
        (data) => {
          this.alb = this.prepareAlbaran(data);
        },
        (error) => {
          this.showError(error);
        });

  }

  prepareAlbaran(data): any {
    // formateo de los datos numéricos
    data.fechaalb = moment(data.fechaalb).format('DD/MM/YYYY');
    if (data.fecenvio) {
      data.fecenvio = moment(data.fecenvio).format('DD/MM/YYYY');
      data.enviado = true;
    } else {
      data.enviado = false;
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
}
