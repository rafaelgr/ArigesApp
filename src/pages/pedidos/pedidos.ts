import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { FormGroup, Validators } from '@angular/forms';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class PedidosPage {
  settings: any;
  pedidos: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider,
    public localData: LocalDataProvider, public alertCrtl: AlertController,
    public interData: InterDataProvider, public loadingCtrl: LoadingController) {
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
    this.arigesData.getPedidosAgente(this.settings.url, this.settings.user.codagent1)
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
    // formateo de los datos numéricos
    for (var i = 0; i < data.length; i++) {
      // formateamos las cabeceras
      data[i].fecpedcl = moment(data[i].fecpedcl).format('DD/MM/YYYY');
      if (data[i].totalped) {
        data[i].totalped = numeral(data[i].totalped).format('0,0.00 $');
      }
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
    this.navCtrl.push('PedidosDetallePage');
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
      subTitle: "No se ha encontrado ningún artículo con estos criterios",
      buttons: ['OK']
    });
    alert.present();
  }
}
