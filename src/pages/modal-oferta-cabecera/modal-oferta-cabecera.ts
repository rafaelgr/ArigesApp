import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as moment from 'moment';
import * as numeral from 'numeral';


/**
 * Generated class for the ModalOfertaCabeceraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-oferta-cabecera',
  templateUrl: 'modal-oferta-cabecera.html',
})
export class ModalOfertaCabeceraPage {

  datos:any = {
    oferta: null,
    cliente: {},
    linea: null,
    articulo: null,
    cantidad: null,
    parnomcli: "",
    nomagent: ""
};

cabofer = {
  numofert: 0,
  fecofert:null,
  fecentre: null,
  codclien: null,
  nomclien: "",
  domclien: "",
  codpobla: "",
  pobclien: "",
  proclien: "",
  nifclien: "",
  telclien: "",
  codtraba: 0,
  codagent: null,
  codforpa: 0,
  coddirec: null
};

  cabForm: FormGroup;
  settings: any = [];
  nomagent: any;
  fecha: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
     public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider, 
     public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {

     
     
      this.cabForm = formBuilder.group({
        fecha: ['', Validators.compose([Validators.required])]
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

  loadData(): void {
    
    this.datos.oferta = this.interData.getOferta();
    this.datos.cliente = this.interData.getCliente();
    this.datos.parnomcli = this.datos.cliente.nomclien;
    if(!this.datos.oferta){
      //caso alta
      this.fecha = moment(new Date()).format("YYYY-MM-DD");//se carga fecha de hoy por defecto en el constructor
     
    } else {
      var fecha_dos = this.datos.oferta.fecofert;//se carga fecha de base de datos por defecto en un método
      this.fecha = moment(fecha_dos, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
  }

  guardarCabecera() {
    if(this.cabForm.valid){
      //alta
      if(!this.datos.oferta){
      this.cabofer.fecofert = this.fecha
      this.cabofer.fecentre = this.fecha
      this.cabofer.codclien = this.datos.cliente.codclien;
      this.cabofer.nomclien = this.datos.cliente.nomclien;
      this.cabofer.domclien = this.datos.cliente.domclien;
      this.cabofer.codpobla= this.datos.cliente.codpobla;
      this.cabofer.pobclien= this.datos.cliente.pobclien;
      this.cabofer.proclien= this.datos.cliente.proclien;
      this.cabofer.nifclien= this.datos.cliente.nifclien;
      this.cabofer.codagent= this.datos.cliente.codagent;

      this.arigesData.postCabeceraOferta(this.settings.url, this.cabofer)
      .subscribe(
        (data) => {
          this.interData.setOferta(data);
          this.navCtrl.setRoot('EdicionOfertaPage');
         
        },
        (error) => {
          if (error.status == 404) {
            let alert = this.alertCrtl.create({
              title: "AVISO",
              subTitle: "No se ha podido crear",
              buttons: ['OK']
            });
            alert.present();
          } else {
            let alert = this.alertCrtl.create({
              title: "ERROR",
              subTitle: JSON.stringify(error, null, 4),
              buttons: ['OK']
            });
            alert.present();
          }
        }
      );
      } else {
        this.cabofer.numofert = this.datos.oferta.numofert;
        this.cabofer.fecofert = this.fecha;
        this.cabofer.fecentre = this.fecha;
        this.cabofer.codclien = this.datos.cliente.codclien;
        this.cabofer.nomclien = this.datos.cliente.nomclien;
        this.cabofer.domclien = this.datos.cliente.domclien;
        this.cabofer.codpobla= this.datos.cliente.codpobla;
        this.cabofer.pobclien= this.datos.cliente.pobclien;
        this.cabofer.proclien= this.datos.cliente.proclien;
        this.cabofer.nifclien= this.datos.cliente.nifclien;
        this.cabofer.codagent= this.datos.cliente.codagent;
        this.arigesData.putCabeceraOferta(this.settings.url, this.cabofer)
        .subscribe(
          (data) => {
            this.interData.setOferta(data);
            this.navCtrl.setRoot('EdicionOfertaPage');
          },
          (error) => {
            if (error.status == 404) {
              let alert = this.alertCrtl.create({
                title: "AVISO",
                subTitle: "No se ha podido Modificar",
                buttons: ['OK']
              });
              alert.present();
            } else {
              let alert = this.alertCrtl.create({
                title: "ERROR",
                subTitle: JSON.stringify(error, null, 4),
                buttons: ['OK']
              });
              alert.present();
            }
          }
        );
      }
      
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
