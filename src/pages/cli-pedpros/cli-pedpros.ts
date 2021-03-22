import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-pedpros',
  templateUrl: 'cli-pedpros.html',
})
export class CliPedProsPage {

  settings: any;
  cliente: any = {};
  pedidos: any = [];


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
    this.arigesData.getPedidosProveedorCliente(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.pedidos = this.preparePedidos(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  preparePedidos(data): any {
    for (var i = 0; i < data.length; i++) {
      // formateamos las cabeceras
      data[i].fecpedpr = moment(data[i].fecpedpr).format('DD/MM/YYYY');
      for (var i2 = 0; i2 < data[i].lineas.length; i2++) {
      }
    }
    return data;
  }

  goPedido(pedido): void {
    this.interData.setPedidoProveedor(pedido);
    this.navCtrl.push('CliPedProsDetallePage');
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
