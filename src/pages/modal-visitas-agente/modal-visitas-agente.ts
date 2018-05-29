import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, DateTime } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';




@IonicPage()
@Component({
  selector: 'page-modal-visitas-agente',
  templateUrl: 'modal-visitas-agente.html',
})
export class ModalVisitasAgentePage {
  settings: any;
  cliente: any = {};
  visita = {
    usuario: "",
    fechora: "",
    codclien: 0,
    agente: 0,
    codtraba: "",
    estado: 0,
    tipo: 0,
    medio: "",
    observaciones: ""
    
  };

  formasPago: any = [];
  tipos: any = [];
  tipo: any
  tipoAccion: any;
  
 
  visitaForm: FormGroup;
  mayor: boolean = false;
  edicion: boolean = false;

  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, 
    public formBuilder: FormBuilder, public viewCtrl: ViewController) {

      this.tipo = 21;

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
    this.edicion =  this.navParams.get('edicion');
    
    this.cliente = this.interData.getCliente();
    if(this.edicion != true) {
      
      
      setTimeout(() => { this.tipoAccion = 21; }, 500)
    }else {
      this.visita = this.navParams.get('visita');
      setTimeout(() => {  this.tipoAccion = this.visita.tipo; }, 500)
     
    }
    this.arigesData.getTipoAccion(this.settings.url, this.tipo)
      .subscribe(
        (data) => {
          this.tipos = data;
        },
        (error) => {
          this.showError(error);
      });
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  guardarVisita(): void{
   
     
        if( this.edicion != true){
          this.arigesData.postVisita(this.settings.url, this.saveObjectMysql())
            .subscribe(
              (datos) => {
                this.viewCtrl.dismiss();
              },
              (error) => {
                this.showError(error);
            });
        }else {
          this.arigesData.putVisita(this.settings.url, this.saveObjectMysql())
            .subscribe(
              (datos) => {
                this.viewCtrl.dismiss();
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

  cantidadNoValida(): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: 'Debe introducir un valor y este no puede ser mayor que el total del visita.',
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss() {
   
    this.viewCtrl.dismiss();
  }

  recuperarMedio(): void {
    this.arigesData.getUnTipoAccion(this.settings.url, this.tipoAccion)
      .subscribe(
        (data) => {
          this.visita.medio = data[0].medio;
        },
        (error) => {
          this.showError(error);
      });
  }

  saveObjectMysql(): any {

    var visitaObje = {};
          var fecha;
          if(this.edicion){
            fecha = moment(new Date(this.visita.fechora)).format('YYYY-MM-DD HH:mm:ss');
            visitaObje = {
              usuario: this.visita.usuario, 
              fechora: fecha, 
              codclien: this.visita.codclien,
              tipo: this.tipoAccion,
              medio: this.visita.medio,
              observaciones: this.visita.observaciones
            }
          } else {
            fecha = new Date;
            visitaObje = {
              usuario: this.settings.user.login,
              fechora: fecha,
              codclien: this.cliente.codclien,
              agente: this.cliente.codagent,
              codtraba: this.settings.user.codtraba,
              estado: 0,
              tipo: this.tipoAccion,
              medio: this.visita.medio,
              observaciones: this.visita.observaciones,
              
            }
          }
          return visitaObje;
  }
}
