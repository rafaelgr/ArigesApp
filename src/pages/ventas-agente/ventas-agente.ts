import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-ventas-agente',
  templateUrl: 'ventas-agente.html',
})
export class VentasAgentePage {
  settings: any;
  cliente: any = {};
  ventas: any = [];
  ventas_anteriores: any = [];
  modalCabecera: any;
  usuario: any = {};
  tipo: number = 6;
  modalVentas: any;
  fechaInicial: any;
  fechaFinal: any;
  fechaInicialAnterior: any;
  fechaFinalAnterior: any;

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
    this.fechaInicialAnterior = moment(this.fechaInicial).add('years', -1).format('YYYY-MM-DD');
    this.fechaFinalAnterior = moment(this.fechaFinal).add('years', -1).format('YYYY-MM-DD');
    this.arigesData.getVentasAgente(this.settings.url, this.settings.user.codagent1, this.fechaInicial, this.fechaFinal)
      .subscribe(
        (data) => {
          if (data.length > 0) {
            this.ventas = data;
            this.arigesData.getVentasAgente(this.settings.url, this.settings.user.codagent1, this.fechaInicialAnterior, this.fechaFinalAnterior)
              .subscribe(
                (data) => {
                  if (data.length > 0) {
                    this.ventas_anteriores = data;
                  } else {
                    this.showNoEncontrado();
                  }

                },
                (error) => {
                  this.showError(error);
                }
              );
          } else {
            this.showNoEncontrado();
          }

        },
        (error) => {
          this.showError(error);
        }
      );
  }

  prepareVentas(): any {

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
      subTitle: "No se ha encontrado ningúna venta para este usuario entre estas fechas o en su periodo anterior",
      buttons: ['OK']
    });
    alert.present();
  }

}

