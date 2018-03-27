import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as moment from 'moment';
import * as numeral from 'numeral';

/**
 * Generated class for the ModalOfertaLineaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-oferta-linea',
  templateUrl: 'modal-oferta-linea.html',
})
export class ModalOfertaLineaPage {

  linForm: FormGroup;
  settings: any = [];
  nomagent: any;
  fecha: string;

  linped = {
    numpedcl: 0,
    numlinea: 0,
    codartic: 0,
    codalmac: 1,
    nomartic: "",
    cantidad: 0,
    precioar: 0,
    dtoline1: 0,
    dtoline2: 0,
    importel: 0,
    bultosser: 0
};


  nomartic: any = ""


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider, 
     public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {

      this.linForm = formBuilder.group({
        nomartic: ['', Validators.compose([Validators.required])]
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

  loadData():void {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
