import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AppVersion } from '@ionic-native/app-version';




@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settings: any;
  nombreEmpresa: string = "";
  nombreUsuario: string = "";
  modalFechas: any;
  version: any;
  

  constructor(public navCtrl: NavController, public localData: LocalDataProvider, public appVer: AppVersion, public plt: Platform) {
    
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
          
         
            this.appVer.getVersionNumber().then(data => {
              this.version = data;
            }, (error) => {
              console.log("herror al obtener la version");
            });
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

  goAlbaranes(): void {
    this.navCtrl.push('AlbaranesPage');
  }

  goProveedores(): void {
    this.navCtrl.push('ProveedoresPage');
  }

  goCobros(): void {
    this.navCtrl.push('CobrosPage');
  }

  goVisitas(): void {
    this.navCtrl.push('ModalVisitasFechasPage');
  }
}
