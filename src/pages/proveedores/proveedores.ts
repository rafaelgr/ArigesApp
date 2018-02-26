import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-proveedores',
  templateUrl: 'proveedores.html',
})
export class ProveedoresPage {
  settings: any;
  buscarProvForm: FormGroup;
  submitAttempt: boolean = false;
  parnom: string = "";
  proveedores: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider,
    public localData: LocalDataProvider, public formBuilder: FormBuilder, public alertCrtl: AlertController,
    public interData: InterDataProvider, public loadingCtrl: LoadingController) {
    this.buscarProvForm = formBuilder.group({
      parnom: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {

        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  doSearch(): void {
    this.submitAttempt = true;
    if (this.buscarProvForm.valid) {
      let loading = this.loadingCtrl.create({
        content: 'Buscando...'
      });
      loading.present();
      this.arigesData.getProveedores(this.settings.url, this.parnom)
        .subscribe(
          (data) => {
            loading.dismiss();
            this.proveedores = this.prepareProveedores(data);
          },
          (error) => {
            loading.dismiss();
            if (error.status == 404) {
              this.showNoEncontrado();
            } else {
              this.showError(error);
            }
          }
        );
    }
  }

  prepareProveedores(data): any {
    return data;
  }


  goProveedor(proveedor): void {
    this.interData.setProveedor(proveedor);
    this.navCtrl.push('ProveedoresDetallePage');
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
      subTitle: "No se ha encontrado ningún proveedor con estos criterios",
      buttons: ['OK']
    });
    alert.present();
  }
}
