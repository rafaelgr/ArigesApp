import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as numeral from 'numeral';
/**
 * Generated class for the CobrosDetallePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cobros-detalle',
  templateUrl: 'cobros-detalle.html',
})
export class CobrosDetallePage {
  settings: any;
  cliente: any = {};
  cobro = {
  };
  formasPago: any = [];
  fPago: any;
  cantidad: number;
  pagoForm: FormGroup;
  @ViewChild('combo') myCombo;


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, public formBuilder: FormBuilder) {

      this.cantidad = 0;
      
      this.pagoForm = formBuilder.group({
        cantidad: ['', Validators.compose([Validators.required, Validators.min(1)])]
      });
  }

  ionViewWillEnter() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        this.loadData();
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {
          //this.loadData();
        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  loadData() :void {
    this.cliente = this.interData.getCliente();
    this.cobro = this.navParams.get('cobro');
    this.arigesData.getFormasPago(this.settings.url)
      .subscribe(
        (data) => {
          this.formasPago = data;
          this.cantidad = numeral(this.cantidad).format('0,0.00 $');
          //this.myCombo[0].selected = true;
          console.log(this.myCombo);
        },
        (error) => {
          this.showError(error);
      });
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  guardarPago(): void{
    if(this.pagoForm.valid){
      this.arigesData.postPagoParcial(this.settings.url, this.saveObjectMysql())
      .subscribe(
        (datos) => {

        },
        
        (error) => {
          
            this.showError(error);
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

  saveObjectMysql(): void {
    var cobroParcial = {}

    cobroParcial = {
      numserie: 0,
      numfactu: 0,
      fecfactu: "",
      numorden: 0,
      tipoFormaPago: this.fPago,
      fecha: new Date(),
      impCobrado: this.cantidad,
      codusu: "",
      observa: ""
    }
  }
}
