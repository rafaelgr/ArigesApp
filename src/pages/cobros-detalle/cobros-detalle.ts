import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as numeral from 'numeral';

@IonicPage()
@Component({
  selector: 'page-cobros-detalle',
  templateUrl: 'cobros-detalle.html',
})
export class CobrosDetallePage {
  settings: any;
  cliente: any = {};
  cobro = {
    numserie: "",
    codfaccl: "",
    codforpa: 0,
    fechafact: "",
    numorden: 0,
    tipoFormaPago: 0,
    fecha: "",
    impcobrado: 0,
    codusu: "",
    total: 0,
    observa: "",
    nomclien: ""
  };

  formasPago: any = [];
  fPago: any;
  cantidad: number;
 
  pagoForm: FormGroup;
  mayor: boolean = false;
  desdeMenu: boolean = false;

  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, 
    public formBuilder: FormBuilder, public viewCtrl: ViewController) {

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
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  loadData() :void {
    this.desdeMenu =  this.navParams.get('desdeMenu');
    this.cobro = this.navParams.get('cobro');

    if(this.desdeMenu != true) {
      this.cliente = this.interData.getCliente();
      this.cobro.nomclien = this.cliente.nomclien;
      setTimeout(() => { this.fPago = 0; }, 500)
    }else {
      this.cantidad = Number(this.cobro.impcobrado.toString().replace(/€/, '').replace(/,/, ".").trim());
      setTimeout(() => {  this.fPago = this.cobro.codforpa; }, 500)
     
    }
    this.arigesData.getTiposFormasPago(this.settings.url)
      .subscribe(
        (data) => {
          this.formasPago = data;
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
      var total = Number(this.cobro.total.toString().replace(/€/, '').replace(/,/, ".").trim());
      this.mayor = false;
      if(this.cantidad < total) {
        if( this.desdeMenu != true){
          this.arigesData.postCobroParcial(this.settings.url, this.saveObjectMysql())
            .subscribe(
              (datos) => {
                this.viewCtrl.dismiss();
              },
              (error) => {
                this.showError(error);
            });
        }else {
          this.arigesData.putCobroParcial(this.settings.url, this.saveObjectMysql())
            .subscribe(
              (datos) => {
                this.viewCtrl.dismiss();
              },
              (error) => {
                this.showError(error);
            });
        }
      }else {
        this.cantidadNoValida();
      }
    }else {
      this.cantidadNoValida();
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

  cantidadNoValida(): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: 'Debe introducir un valor y este no puede ser mayor que el total del cobro.',
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss() {
   
    this.viewCtrl.dismiss();
  }

  saveObjectMysql(): any {
    var cobroParcial = {}

    var fecha = moment(this.cobro.fechafact, 'DD/MM/YYYY').format('YYYY-MM-DD')
    cobroParcial = {
      numserie: this.cobro.numserie,
      numfactu: this.cobro.codfaccl,
      fecfactu: fecha,
      numorden: this.cobro.numorden,
      tipoFormaPago: this.fPago,
      fecha: new Date(),
      impCobrado: this.cantidad,
      codusu: this.settings.user.login,
      observa: this.cobro.observa
    }
    return cobroParcial;
  }
}
