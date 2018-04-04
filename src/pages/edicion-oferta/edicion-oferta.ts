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


 volverOfertasGeneral(): void {
  this.navCtrl.setRoot('CliOfertasPage');
 }

 crearLinea() : void {
  let modalLinea = this.modalCtrl.create('ModalOfertaLineaPage');
  
  modalLinea.present();
 }

 editarLinea(linea): void {
   this.interData.setLineaOferta(linea);
  let modalLinea = this.modalCtrl.create('ModalOfertaLineaPage');
  modalLinea.present();
 }

 openModalCabecera(): void {
  let modalCabecera = this.modalCtrl.create('ModalOfertaCabeceraPage');
  modalCabecera.present();
 }

 borrarLineaOferta(linea): void {
  this.confirmarBorrado(linea);
 }

 confirmarBorrado(linea): any {
  let alert = this.alertCrtl.create({
    title: "AVISO",
    subTitle: "¿Está seguro que desea borrar el registro?",
    buttons: [
      {text: 'Aceptar',
       handler: ()=> {
        this.arigesData.deleteLineaOferta(this.settings.url, this.oferta.numofert, linea.numlinea)
        .subscribe(
          (data) => {
            var num;
           for(var i = 0; i < this.oferta.lineas.length; i++) {
            num = this.oferta.lineas[i].numlinea
             if(num == linea.numlinea) {
              
               this.oferta.lineas.splice(i, 1);
               break;
             }
           }
           this.interData.setOferta(this.oferta);
          },
          (error) => {
            if (error.status == 404) {
              this.showNoEncontrado();
            } else {
              this.showError(error);
            }
          }
        );
       }},
      {text: 'cancelar',
       handler: () => {return}}
    ]
  });
  alert.present();
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
