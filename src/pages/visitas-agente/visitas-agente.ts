import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-visitas-agente',
  templateUrl: 'visitas-agente.html',
})
export class VisitasAgentePage {
  settings: any;
  cliente: any = {};
  visitas: any = [];
  modalCabecera: any;
  tipo: number = 6;
  modalVisitas: any;
  fechaInicial: any;
  fechaFinal: any;

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
    this.fechaInicial = this.navParams.get("fechaInicial");
    this.fechaFinal = this.navParams.get("fechaFinal");
    
    this.arigesData.getVisitasAgente(this.settings.url, this.tipo, this.settings.user.login, this.fechaInicial, this.fechaFinal)
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
      if (visitas[i].nomclien) {
        visitas[i].nombreCliente = visitas[i].nomclien;
      }
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
      subTitle: "No se ha encontrado ningúna visita para este usuario entre estas fechas",
      buttons: ['OK']
    });
    alert.present();
  }

}
