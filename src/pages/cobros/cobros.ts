import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { FormGroup, Validators } from '@angular/forms';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

/**
 * Generated class for the CobrosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cobros',
  templateUrl: 'cobros.html',
})
export class CobrosPage {
  settings: any;
  cobros: any[];
  modalCobros: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider,
    public localData: LocalDataProvider, public alertCrtl: AlertController,
    public interData: InterDataProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
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
    this.arigesData.getCobrosUsuario(this.settings.url, this.settings.user.login)
      .subscribe(
        (data) => {
          this.cobros = this.prepareCobros(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }


  prepareCobros(data): any {
    // formateo de los datos numéricos y las fechas
    for (var i = 0; i < data.length; i++) {
      
      data[i].fechafact = moment(data[i].fechafact).format('DD/MM/YYYY');
      data[i].fechavenci = moment(data[i].fechavenci).format('DD/MM/YYYY');
      data[i].total = numeral(data[i].total).format('0,0.00 $');
      data[i].impcobrado = numeral(data[i].impcobrado).format('0,0.00 $');
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

  goCobro(cobro): any {
    this.modalCobros = this.modalCtrl.create('CobrosDetallePage', { cobro : cobro, desdeMenu: true});
    this.modalCobros.onDidDismiss(() => {
      this.ionViewWillEnter()
    });
    this.modalCobros.present();
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
