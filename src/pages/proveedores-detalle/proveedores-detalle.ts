import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-proveedores-detalle',
  templateUrl: 'proveedores-detalle.html',
})
export class ProveedoresDetallePage {

  settings: any;
  cliente: any = {};
  proveedor = {
    codprove: ""
  };
  descuentos: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController,
    private screenOrientation: ScreenOrientation) {
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
    this.proveedor = this.interData.getProveedor();
    this.arigesData.getProveedoresDescuentosRappeles(this.settings.url ,this.proveedor.codprove)
    .subscribe(
      (data) => {
        for (var i=0; i < data.length; i++){
          data[i].fechadto = moment(data[i].fechadto).format('DD/MM/YYYY');
          data[i].dtoline1 = numeral(data[i].dtoline1).format('0,0');
          data[i].dtoline2 = numeral(data[i].dtoline2).format('0,0');
          data[i].rap1 = numeral(data[i].rap1).format('0,0');
          data[i].rap2 = numeral(data[i].rap2).format('0,0');
      }
        this.descuentos = data;
      },
      (error) => {
        if (error.status == 404) {
         this.descuentos.length = 0;
        } else {
          this.showError(error);
        }
      }
    );;
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
