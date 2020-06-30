import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as numeral from 'numeral';


/**
 * Generated class for the ModalIntercambioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-intercambio',
  templateUrl: 'modal-intercambio.html',
})
export class ModalIntercambioPage {

  settings: any;
  correoForm: FormGroup;
  correo: string = "";
  tipo: any;
  submitAttempt = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider, public viewCtrl: ViewController, 
    public localData: LocalDataProvider, public formBuilder: FormBuilder, public alertCrtl: AlertController,
    public interData: InterDataProvider, public loadingCtrl: LoadingController) {
    this.correoForm = formBuilder.group({
      correo: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ionViewDidLoad() {
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

  loadData():void {
    this.tipo = this.interData.getTipoS2();
    const cliente = this.interData.getCliente();
    console.log("CLIENTE", cliente);
    if (cliente && cliente.maiclie1) {
      this.correo = cliente.maiclie1
    }
  }

  enviar(): void {
    this.submitAttempt = true;
    if (this.correoForm.valid) {
      var str = this.correo;
      this.viewCtrl.dismiss({
        correo: str
      });
    }
  }



  showError(error): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: JSON.stringify(error, null, 4),
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
