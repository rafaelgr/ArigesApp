import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';

@IonicPage()
@Component({
  selector: 'page-cli-ofertas-detalle',
  templateUrl: 'cli-ofertas-detalle.html',
})
export class CliOfertasDetallePage {

  settings: any;
  cliente: any = {};
  oferta: any = {};
  observa: string;
  modalIntercambio: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider, public modalCtrl: ModalController,
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
    var cadena;
    this.cliente = this.interData.getCliente();
    this.oferta = this.interData.getOferta();

    cadena = this.oferta.observa01+" "+this.oferta.observa02+" "
      +this.oferta.observa03+" "+this.oferta.observa04+" "+this.oferta.observa05;

      this.observa = cadena.replace(/undefined|null/gi, '').trim(); 

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
      this.arigesData.postS2Oferta(this.settings.url, datos.correo, this.oferta.numofert)
      .subscribe(
        data => {
          this.showMessage('Su solicitud se ha cursado correctamente.')
        },
        err => {
          this.showError(err);
        }
      )
    });
    this.interData.setTipoS2('OFE');
    this.modalIntercambio.present();
  }
}
