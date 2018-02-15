import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';

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
    this.arigesData.getIndicadores(this.settings.url, this.cliente.codclien, this.cliente.codmacta)
      .subscribe(
        (data) => {
          this.indicadores = data;
        },
        (error) => {
          this.showError(error);
        }
      );
    this.arigesData.getVentaAnual(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.ventaAnual = data;
        },
        (error) => {
          this.showError(error);
        }
      );
    this.arigesData.getCobros(this.settings.url, this.cliente.codmacta)
      .subscribe(
        (data) => {
          this.cobros = data;
          console.log("COBROS : ", this.cobros);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  goCobro(cobro): void {

  }

  showError(error): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: JSON.stringify(error, null, 4),
      buttons: ['OK']
    });
    alert.present();
  }

}
