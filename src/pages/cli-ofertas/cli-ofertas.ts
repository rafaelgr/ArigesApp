import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ModalController } from 'ionic-angular';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-ofertas',
  templateUrl: 'cli-ofertas.html',
})
export class CliOfertasPage {

  settings: any;
  cliente: any = {};
  ofertas: any = [];
  modalCabecera: any;
 

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
    this.cliente = this.interData.getCliente();
    this.arigesData.getOfertas(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.ofertas = this.prepareOfertas(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  prepareOfertas(ofertas): any {
    for (var i = 0; i < ofertas.length; i++) {
      // formateamos las cabeceras
      ofertas[i].fecentre = moment(ofertas[i].fecentre).format('DD/MM/YYYY');
      ofertas[i].fecofert = moment(ofertas[i].fecofert).format('DD/MM/YYYY');
      ofertas[i].totalofe = numeral(ofertas[i].totalofe).format('0,0.00 $');
      // ahora hay que procesar las líneas
      for (var i2 = 0; i2 < ofertas[i].lineas.length; i2++) {
        ofertas[i].lineas[i2].dtoline1 = numeral(ofertas[i].lineas[i2].dtoline1).format('0,0.00');
        ofertas[i].lineas[i2].dtoline2 = numeral(ofertas[i].lineas[i2].dtoline2).format('0,0.00');
        ofertas[i].lineas[i2].precioar = numeral(ofertas[i].lineas[i2].precioar).format('0,0.00 $');
        ofertas[i].lineas[i2].importel = numeral(ofertas[i].lineas[i2].importel).format('0,0.00 $');
      }
    }
    return ofertas;
  }

  goOferta(oferta): void {
   
      this.interData.setOferta(oferta);
      this.navCtrl.push('CliOfertasDetallePage');
    
  }

  borrarOferta(oferta): void {
    this.confirmarBorrado(oferta);
    
  }

  editarOferta(oferta): void {
  
    this.interData.setOferta(oferta);
    this.navCtrl.push('EdicionOfertaPage');
  }


  openModalCabecera(): void  {
    this.modalCabecera = this.modalCtrl.create('ModalOfertaCabeceraPage');
    this.interData.setOferta(null);//si se crea una oferta yhecemos la oferta local nula
    this.modalCabecera.onDidDismiss(crear => {
      if(crear){
        this.navCtrl.push('EdicionOfertaPage');
       }
   
    });
    this.modalCabecera.present();
  }

  confirmarBorrado(oferta): any {
    let alert = this.alertCrtl.create({
      title: "AVISO",
      subTitle: "¿Está seguro que desea borrar el registro?",
      buttons: [
        {text: 'Aceptar',
         handler: ()=> {
          this.arigesData.deleteOferta(this.settings.url, oferta.numofert)
                .subscribe(
                  (data) => {
                    var num;
                    for(var i = 0; i < this.ofertas.length; i++) {
                     num = this.ofertas[i].numofert
                      if(num == data) {
                       
                        this.ofertas.splice(i, 1);
                        break;
                      }
                    }
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
         handler: () => { return}}
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
