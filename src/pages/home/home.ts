import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settings: any;
  nombreEmpresa: string = "";
  nombreUsuario: string = "";

  constructor(public navCtrl: NavController, public localData: LocalDataProvider) {
    
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {
          this.nombreEmpresa = this.settings.user.nomempre;
          this.nombreUsuario = this.settings.user.nomusu;
        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }
  goSettings(): void {
    this.navCtrl.push('SettingsPage');
  }

  goLogin(): void {
    this.navCtrl.push('LoginPage');
  }

  goClientes(): void {
    this.navCtrl.push('CliBuscarPage');
  }

  goArticulos(): void {
    this.navCtrl.push('ArticulosPage');
  }

  goPedidos(): void {
    this.navCtrl.push('PedidosPage');
  }
}
