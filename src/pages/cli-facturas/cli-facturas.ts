import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-facturas',
  templateUrl: 'cli-facturas.html',
})
export class CliFacturasPage {

  settings: any;
  cliente: any = {};
  facturas: any = [];


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
    this.arigesData.getFacturas(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.facturas = this.prepareFacturas(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  prepareFacturas(data): any {
    var numalb;
    // formateo de los datos numéricos
    for (var i = 0; i < data.length; i++) {
      numalb = -1;
      // formateamos las cabeceras
      data[i].fecfactu = moment(data[i].fecfactu).format('DD/MM/YYYY');
      data[i].totalfac = numeral(data[i].totalfac).format('0,0.00 $');
      data[i].bases = numeral(data[i].bases).format('0,0.00 $');
      data[i].cuotas = numeral(data[i].cuotas).format('0,0.00 $');
      data[i].numfactu = data[i].letraser+data[i].numfactu;
      // ahora hay que procesar las líneas
    
      for (var i2 = 0; i2 < data[i].lineas.length; i2++) {
        if(numalb == data[i].lineas[i2].numalbar){
          numalb = data[i].lineas[i2].numalbar;
          data[i].lineas[i2].numalbar = -1;
        } else {
          numalb = data[i].lineas[i2].numalbar;
        }
        data[i].lineas[i2].dtoline1 = numeral(data[i].lineas[i2].dtoline1).format('0,0.00');
        data[i].lineas[i2].dtoline2 = numeral(data[i].lineas[i2].dtoline2).format('0,0.00');
        data[i].lineas[i2].precioar = numeral(data[i].lineas[i2].precioar).format('0,0.00 $');
        data[i].lineas[i2].importel = numeral(data[i].lineas[i2].importel).format('0,0.00 $');
      }
    }
    return data;
  }

  goFactura(factura): void {
    this.interData.setFactura(factura);
    this.navCtrl.push('CliFacturasDetallePage');
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
