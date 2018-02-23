import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';

@IonicPage()
@Component({
  selector: 'page-articulos',
  templateUrl: 'articulos.html',
})
export class ArticulosPage {
  settings: any;
  buscarArtForm: FormGroup;
  parnom: string = "";
  parpro: string = "";
  parfam: string = "";
  codigo: string = "";
  showProveedores: boolean = false;
  proveedores: any[];
  showFamilias: boolean = false;
  familias: any[];
  submitAttempt: boolean = false;
  articulos: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider,
    public localData: LocalDataProvider, public formBuilder: FormBuilder, public alertCrtl: AlertController,
    public interData: InterDataProvider) {
    this.buscarArtForm = formBuilder.group({
      parnom: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
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
    if (this.buscarArtForm.valid) {
      console.log("LANZAR BÚSQUEDA....");
    }
  }

  goArticulo(articulo): void {
    this.interData.setArticulo(articulo);
    //this.navCtrl.setRoot('CliMenuPage');
  }

  onChangeProveedor(): void {
    if (this.parpro.length > 2) {
      this.showProveedores = true;
      this.proveedores = [];
      this.arigesData.getProveedores(this.settings.url, this.parpro)
        .subscribe(
          (data) => {
            this.proveedores = data;
            if (data.length == 1 && this.parpro == data[0].nomprove) {
              this.showProveedores = false;
            }
          },
          (error) => {
            if (error.status == 404) {
              this.proveedores = [];
            } else {
              this.showError(error);
            }
          }
        )
    } else {
      this.showProveedores = false;
    }
  }

  selectProveedor(proveedor): void {
    this.parpro = proveedor.nomprove;
    this.showProveedores = false;
  }

  onChangeFamilia(): void {
    if (this.parfam.length > 2) {
      this.showFamilias = true;
      this.familias = [];
      this.arigesData.getFamilias(this.settings.url, this.parfam)
        .subscribe(
          (data) => {
            this.familias = data;
            if (data.length == 1 && this.parfam == data[0].nomfamia) {
              this.showFamilias = false;
            }
          },
          (error) => {
            if (error.status == 404) {
              this.familias = [];
            } else {
              this.showError(error);
            }
          }
        )
    } else {
      this.showFamilias = false;
    }
  }

  selectFamilia(familia): void {
    this.parfam = familia.nomfamia;
    this.showFamilias = false;
  }

  showError(error): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: JSON.stringify(error, null, 4),
      buttons: ['OK']
    });
    alert.present();
  }
}
