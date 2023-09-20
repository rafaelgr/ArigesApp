import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';

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

  modalIntercambio: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, public modalCtrl: ModalController) {
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

  showMessage(msg): void {
    let alert = this.alertCrtl.create({
      title: "AVISO",
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  doSend(): void {
    this.modalIntercambio = this.modalCtrl.create('ModalIntercambioPage');
    
    this.modalIntercambio.onDidDismiss( datos => {
      if (!datos) return;
      this.arigesData.postS2Albaran(this.settings.url, datos.correo, this.albaran.codtipom + this.albaran.numalbar)
      .subscribe(
        data => {
          this.showMessage('Su solicitud se ha cursado correctamente.')
        },
        err => {
          this.showError(err);
        }
      )
    });
    this.interData.setTipoS2('ALB');
    this.interData.setCliente(null);
    this.modalIntercambio.present();
  }
}
