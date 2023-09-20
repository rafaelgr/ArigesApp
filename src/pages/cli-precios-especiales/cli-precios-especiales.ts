import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-precios-especiales',
  templateUrl: 'cli-precios-especiales.html',
})
export class CliPreciosEspecialesPage {

  settings: any;
  cliente: any = {};
  articulos: any = [];


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
    this.arigesData.getArticulosPreciosEspeciales(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.articulos = this.prepareArticulos(data);
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

  prepareArticulos(data): any {
    for (var i = 0; i < data.length; i++) {
      data[i].precioac = numeral(data[i].precioac).format('0,0.00 $');
      data[i].dtoespe = numeral(data[i].dtoespe).format('0,0.00');
    }
    return data;
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
      subTitle: "No se ha encontrado precios especiales para este cliente",
      buttons: ['OK']
    });
    alert.present();
  }

}
