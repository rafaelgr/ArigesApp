import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
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
  observa: string;

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
  var cadena;
  this.cliente = this.interData.getCliente();
  this.oferta = this.interData.getOferta();
  //concatenamos las observaciones
  cadena = this.oferta.observa01+" "+this.oferta.observa02+" "
      +this.oferta.observa03+" "+this.oferta.observa04+" "+this.oferta.observa05;

      this.observa = cadena.replace(/undefined|null/gi, '').trim(); 
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
   var cadena;
  let modalCabecera = this.modalCtrl.create('ModalOfertaCabeceraPage');
  modalCabecera.onDidDismiss(crear => {
    if(!crear){
        //concatenamos las observaciones
        cadena = this.oferta.observa01+" "+this.oferta.observa02+" "
          +this.oferta.observa03+" "+this.oferta.observa04+" "+this.oferta.observa05;

        this.observa = cadena.replace(/undefined/gi, '').trim(); 
     }
 
  });
  modalCabecera.present();
 }

 borrarLineaOferta(linea): void {
  this.arigesData.deleteLineaOferta(this.settings.url, this.oferta.numofert, linea.numlinea)
        .subscribe(
          (data) => {

            this.arigesData.getOfertas(this.settings.url, this.cliente.codclien)
            .subscribe(
              (datos) => {
                //buscamos la oferta en la que estamos trabajando, le asignamos el total de la oferta recuperada a la 
                ///oferta local y la formateamos
                for(var i = 0; i < datos.length; i++) {
                  if(this.oferta.numofert == datos[i].numofert) {
                    this.oferta.totalofe = datos[i].totalofe;
                    this.oferta.totalofe = numeral(this.oferta.totalofe).format('0,0.00 $');
                    break;
                  }
                }
                //eliminamos del array de lineas de la oferta local la linea elimninada
                var num;
                for(var j = 0; j < this.oferta.lineas.length; j++) {
                  num = this.oferta.lineas[j].numlinea
                   if(num == linea.numlinea) {
                    
      
                     this.oferta.lineas.splice(j, 1);
                     break;
                   }
                 }
                 this.interData.setOferta(this.oferta);
              },
              (error) => {
                this.showError(error);
              }
            );
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

 confirmarBorrado(linea): any {
  let alert = this.alertCrtl.create({
    title: "AVISO",
    subTitle: "¿Está seguro que desea borrar el registro?",
    buttons: [
      {text: 'Aceptar',
       handler: ()=> {
        this.borrarLineaOferta(linea);
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
