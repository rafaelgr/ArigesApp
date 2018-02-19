import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-albaranes',
  templateUrl: 'cli-albaranes.html',
})
export class CliAlbaranesPage {

  settings: any;
  cliente: any = {};
  albaranes: any = [];


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
    this.arigesData.getAlbaranes(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.albaranes = this.prepareAlbaranes(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  prepareAlbaranes(data): any {
    // formateo de los datos numéricos
    for (var i = 0; i < data.length; i++) {
      // formateamos las cabeceras
      data[i].fechaalb = moment(data[i].fechaalb).format('DD/MM/YYYY');
      data[i].totalalb = numeral(data[i].totalalb).format('0,0.00 $');
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

  goAlbaran(albaran): void {
    this.interData.setAlbaran(albaran);
    this.navCtrl.push('CliAlbaranesDetallePage');
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
