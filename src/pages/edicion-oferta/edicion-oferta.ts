import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as moment from 'moment';
import * as numeral from 'numeral';
/**
 * Generated class for the EdicionOfertaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edicion-oferta',
  templateUrl: 'edicion-oferta.html',
})
export class EdicionOfertaPage {

  settings: any;
  cliente: any = {};
  oferta: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider, 
    public arigesData: ArigesDataProvider, public alertCrtl: AlertController, public modalCtrl: ModalController) {

    /* this.linForm = formBuilder.group({
       fecha: ['', Validators.compose([Validators.required])]
     });*/
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
  this.oferta = this.interData.getOferta();
}



showError(error): void {
  let alert = this.alertCrtl.create({
    title: "ERROR",
    subTitle: JSON.stringify(error, null, 4),
    buttons: ['OK']
  });
  alert.present();
}

 volverOfertasGeneral(): void {
  this.navCtrl.setRoot('CliOfertasPage');
 }

 crearLinea() : any {
  let modalLinea = this.modalCtrl.create('ModalOfertaLineaPage');
  modalLinea.present();
 }

 openModalCabecera() {
  let modalCabecera = this.modalCtrl.create('ModalOfertaCabeceraPage');
  modalCabecera.present();
 }
}
