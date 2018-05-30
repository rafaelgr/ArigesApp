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
    fecha:"",
    hora: 0,
    minutos: 0,
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
 
  tipoAccion: any;
  fecha: any;
  
 
  edicion: boolean = false;

  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, 
    public formBuilder: FormBuilder, public viewCtrl: ViewController) {

      
      this.tipoAccion = 21;

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
       this.fecha = new Date();
       this.visita.fecha = moment(this.fecha).format('DD/MM/YYYY');
       this.visita.hora = this.fecha.getHours();
       this.visita.minutos = this.fecha.getMinutes();
       this.recuperarMedio();
      
      setTimeout(() => { this.tipoAccion = 21; }, 500)
    }else {
      this.visita = this.navParams.get('visita');
      setTimeout(() => {  this.tipoAccion = this.visita.tipo; }, 500)
     
    }
    this.arigesData.getTipoAccion(this.settings.url, this.tipoAccion)
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
          
          if(this.edicion){
            this.fecha = moment(new Date(this.visita.fechora)).format('YYYY-MM-DD HH:mm:ss');
            visitaObje = {
              usuario: this.visita.usuario, 
              fechora: this.fecha, 
              codclien: this.visita.codclien,
              tipo: this.tipoAccion,
              medio: this.visita.medio,
              observaciones: this.visita.observaciones
            }
          } else {
            this.fecha = moment(this.fecha).format('YYYY-MM-DD HH:mm:ss');
            visitaObje = {
              usuario: this.settings.user.login,
              fechora: this.fecha,
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
