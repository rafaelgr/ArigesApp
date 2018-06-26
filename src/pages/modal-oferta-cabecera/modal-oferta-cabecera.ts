import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as moment from 'moment';



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
  datos: any = {
    oferta: { totalofe: 0},
    cliente: {},
    parnomcli: "",
    nomagent: ""
  };




  observa: string = ""
  totalofe: number = 0;
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
    var cadena;
    this.datos.oferta = this.interData.getOferta();
    this.datos.cliente = this.interData.getCliente();
    this.datos.parnomcli = this.datos.cliente.nomclien;
    if (!this.datos.oferta) {
      //caso alta
      this.fecha = moment(new Date()).format("YYYY-MM-DD");//se carga fecha de hoy por defecto en el constructor

    } else {
      var fecha_dos = this.datos.oferta.fecofert;//se carga fecha de base de datos por defecto en un método
      this.fecha = moment(fecha_dos, "DD/MM/YYYY").format("YYYY-MM-DD");
      this.totalofe = this.datos.oferta.totalofe;
      cadena = this.datos.oferta.observa01+" "+this.datos.oferta.observa02+" "
      +this.datos.oferta.observa03+" "+this.datos.oferta.observa04+" "+this.datos.oferta.observa05;

      this.observa = cadena.replace(/undefined | null/gi, '').trim(); 
      if(this.observa == 'null' || this.observa == 'undefined') {
        this.observa = '';
      }
    }
  }

  guardarCabecera() {
    if (this.cabForm.valid) {
      //alta
      if (!this.datos.oferta) {
        this.arigesData.postCabeceraOferta(this.settings.url, this.saveObjectMysql())
          .subscribe(
            (data) => {
              var crear = true;
              data.fecofert = moment(data.fecofert, "YYYY-MM-DD").format("DD/MM/YYYY");
              data.fecentre = moment(data.fecentre, "YYYY-MM-DD").format("DD/MM/YYYY");
              this.interData.setOferta(data);
              this.dismiss(crear);
            },
            (error) => {
              if (error.status == 404) {
                this.showNoEncontrado();
              } else {
                this.showError(error);
              }
            }
          );
      } else {
        this.arigesData.putCabeceraOferta(this.settings.url, this.saveObjectMysql())
          .subscribe(
            (data) => {
             var crear = false;
              this.datos.oferta.fecofert = moment(this.fecha, "YYYY-MM-DD").format("DD/MM/YYYY");
              this.datos.oferta.fecentre = moment(this.fecha, "YYYY-MM-DD").format("DD/MM/YYYY");
              this.datos.oferta.observa01 = data.observa01;
              this.datos.oferta.observa02 = data.observa02;
              this.datos.oferta.observa03 = data.observa03;
              this.datos.oferta.observa04 = data.observa04;
              this.datos.oferta.observa05 = data.observa05;
              this.interData.setOferta(this.datos.oferta);
              this.dismiss(crear);
            },
            (error) => {
              if (error.status == 404) {
                this.showNoEncontrado();
              } else {
                this.showError(error);
              }
            }
          );
      }

    }
  }

  dismiss(crear) {
    if(crear) {
      this.viewCtrl.dismiss(crear);
    } else {
      this.viewCtrl.dismiss();
    }
    
  }

  saveObjectMysql(): any {
    var cabofert = {};
    var ob = [];
    var indice = 0;
    for (var i = 0; i <= 4; i++) {
      ob[i] = this.observa.substr(indice, 79);
      indice += 80
    }
    if(!this.datos.oferta){
      cabofert = {
        fecofert: this.fecha,
        fecentre: this.fecha,
        codclien: this.datos.cliente.codclien,
        nomclien: this.datos.cliente.nomclien,
        domclien: this.datos.cliente.domclien,
        codpobla: this.datos.cliente.codpobla,
        pobclien: this.datos.cliente.pobclien,
        proclien: this.datos.cliente.proclien,
        nifclien: this.datos.cliente.nifclien,
        telclien: this.datos.cliente.telclie1,
        codagent: this.datos.cliente.codagent,
        coddirec: null,
        codtraba: this.settings.user.codtraba,
        codforpa: this.datos.cliente.codforpa,
        tipofact: this.datos.cliente.tipofact,
        dtoppago: this.datos.cliente.dtoppago,
        dtognral: this.datos.cliente.dtognral,
        observa01: ob[0],
        observa02: ob[1],
        observa03: ob[2],
        observa04: ob[3],
        observa05: ob[4]
      };
    }else {
      cabofert = {
        fecofert: this.fecha,
        fecentre: this.fecha,
        numofert: this.datos.oferta.numofert,
        codclien: this.datos.cliente.codclien,
        nomclien: this.datos.cliente.nomclien,
        domclien: this.datos.cliente.domclien,
        codpobla: this.datos.cliente.codpobla,
        pobclien: this.datos.cliente.pobclien,
        proclien: this.datos.cliente.proclien,
        nifclien: this.datos.cliente.nifclien,
        codagent: this.datos.cliente.codagent,
        coddirec: null,
        codtraba: this.settings.user.codtraba,
        codforpa: this.datos.cliente.codforpa,
        tipofact: this.datos.cliente.tipofact,
        dtoppago: this.datos.cliente.dtoppago,
        dtognral: this.datos.cliente.dtognral,
        observa01: ob[0],
        observa02: ob[1],
        observa03: ob[2],
        observa04: ob[3],
        observa05: ob[4]
    }
    };
    return cabofert;
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
