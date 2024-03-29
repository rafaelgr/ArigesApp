import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
  selector: 'page-articulos-detalle',
  templateUrl: 'articulos-detalle.html',
})
export class ArticulosDetallePage {

  settings: any;
  cliente: any = {};
  articulo = {
    codartic: "",
    nomartic: "",
    almacenes: [
      
    ]
  };
  textCopy: string = "";

 


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController,
    public clipboard: Clipboard) {
      
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

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  loadData(): void {
    this.articulo = this.interData.getArticulo();
    this.textCopy = this.articulo.codartic + "  " +this.articulo.nomartic;
    this.textCopy =  this.textCopy.toString();
    for(var k = 0; k < this.articulo.almacenes.length; k++) {
        this.articulo.almacenes[k].contador = k + 1;
      
    }
    try{
      this.clipboard.clear();
    } catch(e) {
      console.log(e);
    }
  }

  //Copy Event
  copyText(){
    try{
      this.clipboard.copy(this.textCopy)
     .then(rs => {
        this.showCopiado();
      }).catch(error => {
        this.showError(error);
      });
    }catch(e) {
      console.log(e)
      this.showError(e);
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

  showCopiado(): void {
    let alert = this.alertCrtl.create({
      title: "AVISO",
      subTitle: "Se copió el código y nombre del artículo con éxito",
      buttons: ['OK']
    });
    alert.present();
  }
}



