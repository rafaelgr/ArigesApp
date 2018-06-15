import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import "rxjs/Rx";

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

 
  
datos = {
  numlinea: 0,
  precioar: 0,
  cantidad: 0,
  importel: 0,
  dtoline1: 0,
  dtoline2: 0,
  origpre: "",
  sobreresto: false,
  pvp: 0,
  cliente: {
    codclien: "",
    codactiv: "",
    codtarif: ""
  },
  articulos:[],
  articulo: {
    codartic: "",
    codalmac: 0,
    codproveX: 0,
    nomartic:"",
    precio:{
      dto1:0,
      dto2:0,
      origen: 0,
      pvp:0,
    },
  },
  oferta: {numofert: 0, totalofe: 0,lineas:[]}
}


  linea: any = {};//variable para la edicion de lineas
  nomartic: any = "";
  cantidad: number;
  encontrado: boolean = false;
  falta: boolean = false;
  seleccionado: boolean = false;//booleana relacionada en la antigua busqueda de articulos
  
  nomartiControl: FormControl;
  modalBuscarArticulos: any;
  @ViewChild('focusInput') myInput ;
  @ViewChild('articulo') myArticulo ;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider,public modalCtrl: ModalController,
     public arigesData: ArigesDataProvider, public alertCrtl: AlertController, public loadingCtrl: LoadingController) {

      this.nomartiControl = new FormControl();
      this.linForm = formBuilder.group({
        nomartic: ['', Validators.compose([Validators.required])],
        cantidad: ['', Validators.compose([Validators.required, Validators.min(1)])]
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
          this.nomartiControl.valueChanges.debounceTime(700).subscribe( data => {
            if (!data || data.length < 3 || !this.seleccionado) {
              return;
            }
            this.searchArticulos();
          }

          );
        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  loadData():void {
    this.datos.cliente = this.interData.getCliente();
    this.datos.oferta = this.interData.getOferta();
    this.linea = this.interData.getLineaOferta();
    this.datos.sobreresto = this.settings.user.tipodtos;
    
    //si hay linea, es edicion y cargamos el formulario con los valores de la linea
    if(this.linea){
      this.datos.numlinea = this.linea.numlinea;
      this.nomartic = this.linea.nomartic;
      this.datos.precioar = this.linea.precioar;
      this.cantidad = this.linea.cantidad;
      this.datos.importel = this.linea.importel;
      this.datos.articulo.precio.dto1 = this.linea.dtoline1;
      this.datos.articulo.precio.dto2 = this.linea.dtoline2;
      this.datos.articulo.codalmac = this.linea.codalmac;
      this.datos.articulo.codartic = this.linea.codartic;
      this.datos.origpre = this.linea.origpre;
      this.datos.articulo.codproveX = this.linea.codproveX;
      

      //formateamos los campos numericos con los que vamos a calcular
      this.datos.importel = Number(this.datos.importel.toString().replace(/€/, '').replace(/,/, ".").trim());
      this.datos.precioar = Number(this.datos.precioar.toString().replace(/€/, '').replace(/,/, ".").trim());
      this.datos.articulo.precio.dto1 = Number(this.datos.articulo.precio.dto1.toString().replace(/,/, ".").trim());
      this.datos.articulo.precio.dto2 = Number(this.datos.articulo.precio.dto2.toString().replace(/,/, ".").trim());

      
    }else {
      setTimeout(() => {
        
        this.myArticulo.setFocus();
      },1000);
  
    }
  }

  searchArticulos(): any {
    
    let loading = this.loadingCtrl.create({
      content: 'Buscando articulos...'
    });
    loading.present();
    
    this.arigesData.getArticulosCliente(
        this.settings.url,
        this.datos.cliente.codclien,
        this.datos.cliente.codactiv,
        this.datos.cliente.codtarif,
        this.nomartic)
        .subscribe(
          (data) => {
            loading.dismiss();
            this.encontrado = true;
            this.datos.articulos = data;
            
            //si no devuelve articulos sale del método
            if(this.datos.articulos.length == 0) {
              return;
            }
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
    this.datos.articulo = articulo;
   
      //cargamos las variables relacionadas con el articulo con el objeto seleccionado
      this.nomartic =  articulo.nomartic;
      this.datos.precioar = articulo.precio.pvp;
      this.datos.dtoline1 = articulo.precio.dto1;
      this.datos.dtoline2 = articulo.precio.dto2;
      this.datos.origpre = articulo.precio.origen;
      this.datos.articulo.codproveX = articulo.codprove;
      this.myInput.setFocus();
      
    
      
      
   
      this.datos.articulo = articulo;
      //ocultamos los resultados de la busqueda de articulos
      this.encontrado = false;
      //marcamos que se ha seleccionado un articulo para que el observable no se vuelva a ejecutar
      this.seleccionado = false;
      this.cambiaCantidad();
  }

  cambiaCantidad(): void {
    var cant;
    //calculamos los descuentos segundo descuento
    if(!this.datos.sobreresto) {//sobreresto false se suman los decuentos y se aplican sobre el pvp
      this.datos.importel = this.round(this.cantidad * (this.datos.precioar-(((this.datos.dtoline1+this.datos.dtoline2)/100)*this.datos.precioar)));
    } else {//sobreresto true se aplica el primer descuento y luego el segunco sobte el resto
      cant = this.datos.importel = this.round(this.cantidad * (this.datos.precioar-((this.datos.dtoline1/100)*this.datos.precioar)));
      this.datos.importel = this.round(cant-((this.datos.dtoline2/100)*cant));
    }

    if(!this.cantidad) {
      this.datos.cantidad = this.cantidad;
      this.datos.importel = 0;
    }else {
      this.datos.cantidad = this.cantidad;
      this.datos.importel = this.datos.importel;
    }

  };

  guardarLinea() {
    if(this.linForm.valid){
      //alta
      if(this.datos.numlinea == 0){
      
      this.arigesData.postLineaOferta(this.settings.url, this.saveObjectMysql())
      .subscribe(
        (data) => {
          if(this.datos.oferta.lineas == undefined) {this.datos.oferta.lineas = []}
         
          //recuperamos las ofertas de la base de datos
          this.arigesData.getOfertas(this.settings.url, this.datos.cliente.codclien)
          .subscribe(
            (datos) => {
              //buscamos la oferta con la que estamos trabajando, le asignamos el total de la oferta recuperada a la 
              ///oferta local y la formateamos
              for(var j = 0; j < datos.length; j++) {
                if(data.numofert == datos[j].numofert) {
                  this.datos.oferta.numofert = datos[j].numofert;
                  this.datos.oferta.totalofe = datos[j].totalofe;
                  this.datos.oferta.totalofe = numeral(this.datos.oferta.totalofe).format('0,0.00 $');
                  break;
                }
              }
              //formateamos los valores de la linea recién creada
              this.formateaValores(data);

              this.datos.oferta.lineas.push(data);//añadimos la linea recien creada al array de lineas de la oferta local

              this.interData.setOferta(this.datos.oferta)//guardamos la oferta con la linea recién creada
              this.dismiss();
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
      } else {
        
        this.arigesData.putLineaOferta(this.settings.url, this.saveObjectMysql())
        .subscribe(
          (data) => {
            this.arigesData.getOfertas(this.settings.url, this.datos.cliente.codclien)
            .subscribe(
              (datos) => {
                //buscamos la oferta en la que estamos trabajando, le asignamos el total de la oferta recuperada a la 
                ///oferta local y la formateamos
                for(var k = 0; k < datos.length; k++) {
                  if(data.numofert == datos[k].numofert) {
                    this.datos.oferta.totalofe = datos[k].totalofe;
                    this.datos.oferta.totalofe = numeral(this.datos.oferta.totalofe).format('0,0.00 $');
                    break;
                  }
                }
                //formateamos los valores de la linea recién creada
                this.formateaValores(data);
  
                //buscamos la linea modificada en el array de lineas de la oferta local
                var num;
                for(var i = 0; i < this.datos.oferta.lineas.length; i++){
                  num = this.datos.oferta.lineas[i].numlinea
                  if( num == data.numlinea) {
                    this.datos.oferta.lineas.splice(i, 1, data);//añadimos la linea recien modificada al array de lineas de la oferta
                  }
                }
               
                this.interData.setLineaOferta(null);//establecemos la linea en edición a null una vez editada
                this.dismiss();//volvemos a la página de edición
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
      
    } else {
      this.falta = true;
    }
  }

  formateaValores(data): void {
    data.dtoline1 = numeral(data.dtoline1).format('0,0.00');
    data.dtoline2 = numeral(data.dtoline2).format('0,0.00');
    data.precioar = numeral(data.precioar).format('0,0.00 $');
    data.importel = numeral(data.importel).format('0,0.00 $');
  }

  round(value): number {
    return(Math.round(value * 100) / 100);
  }


  dismiss() {
    var oferta = this.interData.getOferta();
    this.interData.setLineaOferta(null);//establecemos la linea en edición a null
    this.viewCtrl.dismiss(oferta);
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

  noSeleccionado(): void {
    this.seleccionado = true;
  }

  openModalBuscarArticulos(): void  {
    this.modalBuscarArticulos = this.modalCtrl.create('ModalArticulosBuscarPage');
    
    this.modalBuscarArticulos.onDidDismiss( (seleccionado) => {
      var articulo;
      if(seleccionado) {
        articulo = this.interData.getArticulo();
        this.selectArticulo(articulo);
      }
    });
    this.modalBuscarArticulos.present();
  }

  saveObjectMysql(): any {
    var linofert = {};
    
    if(!this.linea){
      linofert = {
        numofert: this.datos.oferta.numofert,
        numlinea: 0,
        codartic: this.datos.articulo.codartic,
        codalmac: this.settings.user.codalmac,
        nomartic: this.nomartic,
        cantidad: this.cantidad,
        precioar: this.datos.precioar,
        dtoline1: this.datos.articulo.precio.dto1,
        dtoline2: this.datos.articulo.precio.dto2,
        importel: this.datos.importel,
        origpre: this.datos.origpre,
        codproveX: this.datos.articulo.codproveX
        
      };
    }else {
      linofert = {
        numofert: this.datos.oferta.numofert,
        numlinea: this.linea.numlinea,
        codartic: this.datos.articulo.codartic,
        codalmac: this.settings.user.codalmac,
        nomartic: this.nomartic,
        cantidad: this.cantidad,
        precioar: this.datos.precioar,
        dtoline1: this.datos.articulo.precio.dto1,
        dtoline2: this.datos.articulo.precio.dto2,
        importel: this.datos.importel,
        origpre: this.datos.origpre,
        codproveX: this.datos.articulo.codproveX
    }
    };
    return linofert;
  }
}
