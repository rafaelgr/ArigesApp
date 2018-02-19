import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-pedidos',
  templateUrl: 'cli-pedidos.html',
})
export class CliPedidosPage {

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
    this.arigesData.getPedidos(this.settings.url, this.cliente.codclien)
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
      data[i].fecentre = moment(data[i].fecentre).format('DD/MM/YYYY');
      data[i].fecpedcl = moment(data[i].fecpedcl).format('DD/MM/YYYY');
      data[i].totalped = numeral(data[i].totalped).format('0,0.00 $');
      // ahora hay que procesar las líneas
      for (var i2 = 0; i2 < data[i].lineas.length; i2++) {
          data[i].lineas[i2].dtoline1 = numeral(data[i].lineas[i2].dtoline1).format('0,0.00');
          data[i].lineas[i2].dtoline2 = numeral(data[i].lineas[i2].dtoline2).format('0,0.00');
          data[i].lineas[i2].precioar = numeral(data[i].lineas[i2].precioar).format('0,0.00 $');
          data[i].lineas[i2].importel = numeral(data[i].lineas[i2].importel).format('0,0.00 $');
      }
  }
    return data;
  }

  goPedido(pedido): void {
    this.interData.setPedido(pedido);
    this.navCtrl.push('CliPedidosDetallePage');
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
