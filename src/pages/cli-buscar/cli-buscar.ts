import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArigesDataProvider} from '../../providers/ariges-data/ariges-data';

@IonicPage()
@Component({
  selector: 'page-cli-buscar',
  templateUrl: 'cli-buscar.html',
})
export class CliBuscarPage {
  settings: any;
  buscarCliForm: FormGroup;
  nomParcial: string = "";
  submitAttempt: boolean = false;
  clientes:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider,
    public localData: LocalDataProvider, public formBuilder: FormBuilder, public alertCrtl: AlertController) {
      this.buscarCliForm = formBuilder.group({
        nomParcial: ['', Validators.compose([Validators.required])]
      });
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        console.log("SETTINGS: ", data);
        this.settings = JSON.parse(data);
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {

        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  doSearch(): void {
    this.submitAttempt = true;
    if (this.buscarCliForm.valid) {
      this.arigesData.getClientes(this.settings.url, this.settings.user.codagent, this.nomParcial)
      .subscribe(
        (data)=>{
          console.log("DATA: ", data);
          this.clientes = data;
        },
        (error)=>{
          console.log("ERROR: ", error);
          console.log("STATUS:", error.status);
          if (error.status == 404){
            let alert = this.alertCrtl.create({
              title: "AVISO",
              subTitle: "No se ha encontrado ningún cliente con estos criterios",
              buttons: ['OK']
            });
            alert.present();
          }else{
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
