import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cli-precios',
  templateUrl: 'cli-precios.html',
})
export class CliPreciosPage {

  settings: any;
  cliente: any = {};
  buscarArtForm: FormGroup;
  nomParcial: string = "";
  submitAttempt: boolean = false;
  articulos: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    this.buscarArtForm = formBuilder.group({
      nomParcial: ['', Validators.compose([Validators.required])]
    });
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
  }

  doSearch(): void {
    this.submitAttempt = true;
    if (this.buscarArtForm.valid) {
      var str = this.nomParcial
 
      for(var i = 0; i < str.length; i++) {
 
        str = str.replace('*', '%');
   
      }

      let loading = this.loadingCtrl.create({
        content: 'Buscando...'
      });
      loading.present();
      this.arigesData.getArticulosCliente(this.settings.url,
        this.cliente.codclien, this.cliente.codactiv, this.cliente.codtarif,
        str)
        .subscribe(
          (data) => {
            loading.dismiss();
            if (data.length == 0) this.showNoEncontrado();
            this.articulos = data;
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

  prepareArticulos(data): any {
    // formateo de valores numéricos
    for (var i = 0; i < data.length; i++) {
      data[i].precio.pvp = numeral(data[i].precio.pvp).format('0,0.00 $');
      data[i].precio.dto1 = numeral(data[i].precio.dto1).format('0,0');
      data[i].precio.dto2 = numeral(data[i].precio.dto2).format('0,0');
      data[i].precio.importe = numeral(data[i].precio.importe).format('0,0.00 $');
    }
    return data;
  }

  goArticulo(articulo): void {
    this.interData.setArticulo(articulo);
    this.navCtrl.push('CliPreciosDetallePage');
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
