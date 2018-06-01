import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ModalOfertaCabeceraPage } from '../modal-oferta-cabecera/modal-oferta-cabecera'
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-visitas-agente',
  templateUrl: 'cli-visitas-agente.html',
})
export class CliVisitasAgentePage {
  settings: any;
  cliente: any = {};
  visitas: any = [];
  modalCabecera: any;
  tipo: number = 21;
  modalVisitas: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, 
    public modalCtrl: ModalController) {
      

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
    this.arigesData.getVisitas(this.settings.url, this.tipo, this.settings.user.login, this.cliente.codclien)
      .subscribe(
        (data) => {
          if(data.length > 0) {
            this.visitas = this.prepareVisitas(data);
          } else {
            this.showNoEncontrado();
          }
          
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  prepareVisitas(visitas): any {
    var d;
    
    for (var i = 0; i < visitas.length; i++) {
      // formateamos las cabeceras
      d = new Date(visitas[i].fechora);
      visitas[i].hora = d.getHours();
      visitas[i].minutos = d.getMinutes()
      visitas[i].fecha = moment(visitas[i].fechora).format('DD/MM/YYYY');
    }
    return visitas;
  }

  openModalVisita(visita): any {
    if(visita){
      this.modalVisitas = this.modalCtrl.create('ModalVisitasAgentePage', { visita : visita, edicion: true});
    } else {
      this.modalVisitas = this.modalCtrl.create('ModalVisitasAgentePage', { edicion: false});
    }
    this.modalVisitas.onDidDismiss(() => {
      this.ionViewWillEnter()
    });
    this.modalVisitas.present();
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
      subTitle: "No se ha encontrado ningúna visita para este usuario y cliente",
      buttons: ['OK']
    });
    alert.present();
  }

}
