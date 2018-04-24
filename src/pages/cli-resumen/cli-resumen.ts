import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';


@IonicPage()
@Component({
  selector: 'page-cli-resumen',
  templateUrl: 'cli-resumen.html',
})
export class CliResumenPage {
  settings: any;
  cliente: any = {};
  indicadores: any = {};
  ventaAnual: any = {};
  cobros: any = [];
  // solo en pruebas
  labels = [];
  series = ['Media', 'Cliente'];
  data = [
      [],
      []
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {
      
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
    this.prepareLimCredito();
    this.arigesData.getIndicadores(this.settings.url, this.cliente.codclien, this.cliente.codmacta)
      .subscribe(
        (data) => {
          this.indicadores = this.prepareIndicadores(data);
        },
        (error) => {
          this.showError(error);
        }
      );
    this.arigesData.getVentaAnual(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.ventaAnual = data;
          this.prepareVentaAnual();
        },
        (error) => {
          this.showError(error);
        }
      );
    this.arigesData.getCobros(this.settings.url, this.cliente.codmacta)
      .subscribe(
        (data) => {
          this.cobros = this.prepareCobros(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  goCobro(cobro): void {
    
  }

  prepareVentaAnual(): void {
    this.labels = this.ventaAnual.labels;
    this.series = this.ventaAnual.series;
    this.data = this.ventaAnual.data;
  }

  showError(error): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: JSON.stringify(error, null, 4),
      buttons: ['OK']
    });
    alert.present();
  }

  prepareCobros(cobros): any {
    for (var i = 0; i < cobros.length; i++) {
      var vencimiento = new Date(cobros[i].fechavenci);
      cobros[i].fechavenci = moment(new Date(cobros[i].fechavenci)).format('DD/MM/YYYY');
      cobros[i].fechafact = moment(new Date(cobros[i].fechafact)).format('DD/MM/YYYY');
      cobros[i].total = numeral(cobros[i].total).format('0,0.00 $');
      // marcar como vencido
      if (new Date() >= vencimiento) {
        cobros[i].vencido = true;
      } else {
        cobros[i].vencido = false;
      }
    }
    return cobros;
  }

  prepareIndicadores(indicadores): any {
    indicadores.saldoPendiente = numeral(indicadores.saldoPendiente).format('0,0.00 $');
    indicadores.saldoVencido = numeral(indicadores.saldoVencido).format('0,0.00 $');
    return indicadores;
  }

  prepareLimCredito(): any {
    this.cliente.limiteCredito = numeral( this.cliente.limiteCredito).format('0,0.00 $');
  }

}
