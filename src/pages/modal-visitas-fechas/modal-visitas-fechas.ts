import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-modal-visitas-fechas',
  templateUrl: 'modal-visitas-fechas.html',
})
export class ModalVisitasFechasPage {

  fechaInicial: string;
  fechaFinal: string;
  visitasForm: FormGroup;
  settings: any;
  submitAttempt: boolean = false;
  errorFecha: boolean = false;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public formBuilder: FormBuilder, public localData: LocalDataProvider, public interData: InterDataProvider,
    public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {

    this.visitasForm = formBuilder.group({
      fechaInicial: ['', Validators.compose([Validators.required])],
      fechaFinal: ['', Validators.compose([Validators.required])]
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
    this.fechaFinal = moment(new Date()).format("YYYY-MM-DD");//se carga fecha de hoy por defecto en el constructor

    //se obtiene el primer día del mes actual y se carga en la fecha inicial
    var date = new Date();
    var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);

    this.fechaInicial = moment(primerDia).format("YYYY-MM-DD");
  }

  buscarVisitas(): void {
    this.submitAttempt = true;
    var masUndia = moment(this.fechaFinal).add('days', 1).format("YYYY-MM-DD");
    if (this.visitasForm.valid) {
      if(this.fechaInicial > this.fechaFinal) {
        this.errorFecha = true;
      } else {
        this.navCtrl.push('VisitasAgentePage', {fechaInicial: this.fechaInicial, fechaFinal: masUndia});
      }
    }
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

}
