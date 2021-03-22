import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';


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
  fechaI1: any = '';
  fechaF1: any = '';
  fechaI2: any = '';
  fechaF2: any = '';
  totalF1: any = '';
  totalF2: any = '';
  porF: any = '';

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
                    this.prepararVentas();
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

  prepararVentas(): any {
    let total = 0;
    let totala = 0;
    for (let i = 0; i < this.ventas.length; i++) {
      let venta = this.ventas[i];
      venta.totalF = numeral(venta.total).format('0,0.00 $');
      let ventaA = this.ventas_anteriores.find(e => e.nomtipar == venta.nomtipar);
      if (ventaA) {
        venta.totala = ventaA.total;
        venta.totalaF = numeral(venta.totala).format('0,0.00 $');
        venta.por = ((venta.total - venta.totala) / venta.totala);
        venta.porF = numeral(venta.por).format('0.00 %');
      } else {
        venta.totala = 0;
        venta.totalaF = numeral(0).format('0,0.00 $');
        venta.por = 0;
        venta.porF = numeral(0).format('0.00 %');
      }
      total += venta.total;
      totala += venta.totala;
      this.ventas[i] = venta;
    }
    let por = 0;
    if (totala) {
      por = (total - totala) / totala;
    }
    this.fechaI1 = moment(this.fechaInicial).format('DD/MM/YYYY');
    this.fechaI2 = moment(this.fechaInicialAnterior).format('DD/MM/YYYY');
    this.fechaF1 = moment(this.fechaFinal).format('DD/MM/YYYY');
    this.fechaF2 = moment(this.fechaFinalAnterior).format('DD/MM/YYYY');
    this.totalF1 = numeral(total).format('0,0.00 $');
    this.totalF2 = numeral(totala).format('0,0.00 $');
    this.porF = numeral(por).format('0.00 %');
    console.log("Ventas", this.ventas);
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

