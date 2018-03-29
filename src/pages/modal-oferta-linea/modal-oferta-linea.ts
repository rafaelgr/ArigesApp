import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

/**
 * Generated class for the ModalOfertaLineaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-oferta-linea',
  templateUrl: 'modal-oferta-linea.html',
})
export class ModalOfertaLineaPage {

  linForm: FormGroup;
  settings: any = [];
  nomagent: any;
  fecha: string;

  linped = {
    numofert: 0,
    numlinea: 0,
    codartic: 0,
    codalmac: 1,
    nomartic: "",
    cantidad: 0,
    precioar: 0,
    dtoline1: 0,
    dtoline2: 0,
    importel: 0,
    origpre: "",
    codprovex: 0
};

datos = {
  numlinea: 0,
  precioar: 0,
  cantidad: 0,
  importel: 0,
  cliente: {
    codclien: "",
    codactiv: "",
    codtarif: ""
  },
  articulos:[],
  articulo: {},
  oferta: {numofert: 0, lineas:[]}
}


  nomartic: any = "";
  cantidad: number = 0
  searchArticulo: boolean;
  encontrado: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider, 
     public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {

      this.linForm = formBuilder.group({
        nomartic: ['', Validators.compose([Validators.required])],
        cantidad: ['', Validators.compose([Validators.required])]
      });

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

  loadData():void {
    this.datos.cliente = this.interData.getCliente();
    this.datos.oferta = this.interData.getOferta();
  }

  searchArticulos(): any {
    if (!this.nomartic || this.nomartic.length < 3) {
        this.searchArticulo = false;
        return;
    }
    
    this.searchArticulo = true;
    this.arigesData.getArticulosCliente(
        this.settings.url,
        this.datos.cliente.codclien,
        this.datos.cliente.codtarif,
        this.datos.cliente.codactiv,
        this.nomartic)
        .subscribe(
          (data) => {
            this.encontrado = true;
            this.datos.articulos = data;
          },
          (error) => {
            if (error.status == 404) {
              let alert = this.alertCrtl.create({
                title: "AVISO",
                subTitle: "No se ha podido Crear",
                buttons: ['OK']
              });
              alert.present();
            } else {
              let alert = this.alertCrtl.create({
                title: "ERROR",
                subTitle: JSON.stringify(error, null, 4),
                buttons: ['OK']
              });
              alert.present();
            }
          }
        );
  }

  selectArticulo(articulo): void {
   
    //cargamos el objeto linea con los datos seleccionados
      this.linped.numofert = this.datos.oferta.numofert;
      this.linped.codartic = articulo.codartic;
      this.linped.codalmac = 1;
      this.linped.nomartic = articulo.nomartic;
      this.linped.precioar = articulo.precio.importe;
      this.linped.origpre = articulo.precio.origen;
      this.linped.dtoline1 = 0;
      this.linped.dtoline2 = 0;

      //cargamos las variables de binding con los objetos seleccionados
      this.nomartic =  articulo.nomartic;
      this.datos.precioar = articulo.precio.importe;
      this.cantidad = 0;
   
      this.datos.articulo = articulo;
      //ocultamos los resultados de la busqueda de articulos
      this.encontrado = false;
  }

  cambiaCantidad(): void {
    this.linped.importel = this.round(this.cantidad * this.linped.precioar);
    this.linped.cantidad = this.cantidad;
    this.datos.importel = this.linped.importel;

  };

  guardarLinea() {
    if(this.linForm.valid){
      //alta
      if(this.linped.numlinea == 0){
      

      this.arigesData.postLineaOferta(this.settings.url, this.linped)
      .subscribe(
        (data) => {
          if(this.datos.oferta.lineas == undefined) {this.datos.oferta.lineas = []}
          this.datos.oferta.lineas.push(data);//añadimos la linea recien creada al array de lineas de la oferta
          this.interData.setOferta(this.datos.oferta)//guardamos la oferta con la linea recién creada
          this.navCtrl.setRoot('EdicionOfertaPage');
        },
        (error) => {
          if (error.status == 404) {
            let alert = this.alertCrtl.create({
              title: "AVISO",
              subTitle: "No se ha podido crear",
              buttons: ['OK']
            });
            alert.present();
          } else {
            let alert = this.alertCrtl.create({
              title: "ERROR",
              subTitle: JSON.stringify(error, null, 4),
              buttons: ['OK']
            });
            alert.present();
          }
        }
      );
      } else {
        
        this.arigesData.putLineaOferta(this.settings.url, this.linped)
        .subscribe(
          (data) => {
            
            this.navCtrl.setRoot('EdicionOfertaPage');//volvemos a la página de edición
          },
          (error) => {
            if (error.status == 404) {
              let alert = this.alertCrtl.create({
                title: "AVISO",
                subTitle: "No se ha podido Modificar",
                buttons: ['OK']
              });
              alert.present();
            } else {
              let alert = this.alertCrtl.create({
                title: "ERROR",
                subTitle: JSON.stringify(error, null, 4),
                buttons: ['OK']
              });
              alert.present();
            }
          }
        );
      }
      
    }
  }

  round(value): number {
    return(Math.round(value * 100) / 100);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
