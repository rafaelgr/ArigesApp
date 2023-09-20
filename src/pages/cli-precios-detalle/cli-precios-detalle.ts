import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-precios-detalle',
  templateUrl: 'cli-precios-detalle.html',
})
export class CliPreciosDetallePage {

  settings: any;
  cliente: any = {};
  articulo = {
    nomartic: "",
    codartic: 0,
    stock: 0,
    precio: {
      origen: "",
      pvp: 0,
      dto1: 0,
      dto2: 0,
      importe: 0
    }
  };


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
    this.articulo = this.interData.getArticulo();
    this.preparePrecios();
  }

  preparePrecios(): void{
    this.articulo.precio.dto1 = numeral(this.articulo.precio.dto1).format('0,0.00');
    this.articulo.precio.dto2 = numeral(this.articulo.precio.dto2).format('0,0.00');
    this.articulo.precio.pvp = numeral(this.articulo.precio.pvp).format('0,0.00 $');
    this.articulo.precio.importe = numeral(this.articulo.precio.importe).format('0,0.00 $');
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
