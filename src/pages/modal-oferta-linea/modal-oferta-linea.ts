import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
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
  dtoline1: 0,
  dtoline2: 0,
  sobreresto: false,
  pvp: 0,
  cliente: {
    codclien: "",
    codactiv: "",
    codtarif: ""
  },
  articulos:[],
  articulo: {},
  oferta: {numofert: 0, totalofe: 0,lineas:[]}
}


  linea: any = {};//variable para la edicion de lineas
  nomartic: any = "";
  cantidad: number = 0
  encontrado: boolean = false;
  falta: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider, 
     public arigesData: ArigesDataProvider, public alertCrtl: AlertController, public loadingCtrl: LoadingController) {

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
    //si hay linea, es edicion y cargamos el formulario con los valores de la linea
    if(this.linea){
      this.datos.numlinea = this.linea.numlinea;
      this.nomartic = this.linea.nomartic;
      this.datos.precioar = this.linea.precioar;
      this.cantidad = this.linea.cantidad;
      this.datos.importel = this.linea.importel;
      this.linped.numlinea = this.linea.numlinea;
      this.searchArticulos();
    }
  }

  searchArticulos(): any {
    if (!this.nomartic || this.nomartic.length < 3) {
        return;
    }
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
            //si se trata de una edicion cargamos los datos del articulo de la linea
            if(this.linped.numlinea != 0 && this.datos.articulos.length == 1) {
              this.selectArticulo(this.datos.articulos[0]);
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
   
    //cargamos el objeto linea con los datos seleccionados
      this.linped.numofert = this.datos.oferta.numofert;
      this.linped.codartic = articulo.codartic;
      this.linped.codalmac = 1;
      this.linped.nomartic = articulo.nomartic;
      this.linped.precioar = articulo.precio.pvp;
      this.linped.origpre = articulo.precio.origen;
      this.linped.dtoline1 = articulo.precio.dto1;
      this.linped.dtoline2 = articulo.precio.dto2;

      //cargamos las variables de binding con los objetos seleccionados
      this.nomartic =  articulo.nomartic;
      this.datos.precioar = articulo.precio.pvp;
      this.datos.dtoline1 = articulo.precio.dto1;
      this.datos.dtoline2 = articulo.precio.dto2;
      this.datos.sobreresto = articulo.precio.sobreResto;
      
    
      if(!this.cantidad) {
        this.cantidad = 0;
      }
      
   
      this.datos.articulo = articulo;
      //ocultamos los resultados de la busqueda de articulos
      this.encontrado = false;
      this.cambiaCantidad();
  }

  cambiaCantidad(): void {
    var cant;
    //calculamos los descuentos segundo descuento
    if(!this.datos.sobreresto) {//sobreresto false se suman los decuentos y se aplican sobre el pvp
      this.linped.importel = this.round(this.cantidad * (this.linped.precioar-(((this.datos.dtoline1+this.datos.dtoline2)/100)*this.linped.precioar)));
    } else {//sobreresto true se aplica el primer descuento y luego el segunco sobte el resto
      cant = this.linped.importel = this.round(this.cantidad * (this.linped.precioar-((this.datos.dtoline1/100)*this.linped.precioar)));
      this.linped.importel = this.round(cant-((this.datos.dtoline2/100)*cant));
    }

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
         
          //recuperamos las ofertas de la base de datos
          this.arigesData.getOfertas(this.settings.url, this.datos.cliente.codclien)
          .subscribe(
            (datos) => {
              //buscamos la oferta con la que estamos trabajando, le asignamos el total de la oferta recuperada a la 
              ///oferta local y la formateamos
              for(var i = 0; i < datos.length; i++) {
                if(data.numofert == datos[i].numofert) {
                  this.datos.oferta.totalofe = datos[i].totalofe;
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
        
        this.arigesData.putLineaOferta(this.settings.url, this.linped)
        .subscribe(
          (data) => {
            this.arigesData.getOfertas(this.settings.url, this.datos.cliente.codclien)
            .subscribe(
              (datos) => {
                //buscamos la oferta en la que estamos trabajando, le asignamos el total de la oferta recuperada a la 
                ///oferta local y la formateamos
                for(var i = 0; i < datos.length; i++) {
                  if(data.numofert == datos[i].numofert) {
                    this.datos.oferta.totalofe = datos[i].totalofe;
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
}
