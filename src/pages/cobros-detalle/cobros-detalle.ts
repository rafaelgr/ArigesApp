import { Component } from '@angular/core';
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
    numserie: "",
    codfaccl: "",
    fechafact: "",
    numorden: 0,
    tipoFormaPago: 0,
    fecha: "",
    impCobrado: 0,
    codusu: "",
    total: 0,
    observa: ""
  };

  formasPago: any = [];
  fPago: any;
  cantidad: number;
  observa: string;
  pagoForm: FormGroup;
  mayor: boolean = false;

  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, public formBuilder: FormBuilder) {

      this.cantidad = 0;
      

      setTimeout(() => { this.fPago = 0; }, 1000)
      
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
    this.cliente = this.interData.getCliente();
    this.cobro = this.navParams.get('cobro');
    this.arigesData.getTiposFormasPago(this.settings.url)
      .subscribe(
        (data) => {
          this.formasPago = data;
          this.cantidad = numeral(this.cantidad).format('0,0.00 $');
          
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
        this.arigesData.postCobroParcial(this.settings.url, this.saveObjectMysql())
      .subscribe(
        (datos) => {

        },
        
        (error) => {
          
            this.showError(error);
        });
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
      observa: this.observa
    }
    return cobroParcial;
  }
}
