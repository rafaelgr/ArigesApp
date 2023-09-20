import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-albaranes',
  templateUrl: 'albaranes.html',
})
export class AlbaranesPage {
  settings: any;
  albaranes: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider,
    public localData: LocalDataProvider, public alertCrtl: AlertController,
    public interData: InterDataProvider, public loadingCtrl: LoadingController) {
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
    this.arigesData.getAlbaranesAgente(this.settings.url, this.settings.user.codagent1)
      .subscribe(
        (data) => {
          this.albaranes = this.prepareAlbaranes(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }


  prepareAlbaranes(data): any {
    for (var i = 0; i < data.length; i++) {
      data[i].fechaalb = moment(data[i].fechaalb).format('DD/MM/YYYY');
      if (data[i].fecenvio) {
        data[i].fecenvio = moment(data[i].fecenvio).format('DD/MM/YYYY');
        data[i].enviado = true;
      } else {
        data[i].enviado = false;
      }
    }
    return data;
  }


  goAlbaran(albaran): void {
    this.interData.setAlbaran(albaran);
    this.navCtrl.push('AlbaranesDetallePage');
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
      subTitle: "No se ha encontrado ningún artículo con estos criterios",
      buttons: ['OK']
    });
    alert.present();
  }
}
