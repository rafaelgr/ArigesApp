import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import * as numeral from 'numeral';


/**
 * Generated class for the ModalArticulosBuscarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-articulos-buscar',
  templateUrl: 'modal-articulos-buscar.html',
})
export class ModalArticulosBuscarPage {

  settings: any;
  buscarArtForm: FormGroup;
  parnom: string = "";
  parpro: string = "";
  parfam: string = "";
  codigo: string = "";
  cliente: any = {};
  showProveedores: boolean = false;
  proveedores: any[];
  showFamilias: boolean = false;
  familias: any[];
  submitAttempt: boolean = false;
  articulos: any[];
  obsole: boolean;
  rotacion: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public arigesData: ArigesDataProvider, public viewCtrl: ViewController, 
    public localData: LocalDataProvider, public formBuilder: FormBuilder, public alertCrtl: AlertController,
    public interData: InterDataProvider, public loadingCtrl: LoadingController) {
    this.buscarArtForm = formBuilder.group({
      parnom: ['', Validators.compose([])]
    });
  }

  ionViewDidLoad() {
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

  loadData():void {
    this.cliente = this.interData.getCliente();
    this.obsole = false;
    this.rotacion = false;
  }

  doSearch(): void {
    this.submitAttempt = true;
    if (this.buscarArtForm.valid) {
     var str = this.parnom
 
    for(var i = 0; i < str.length; i++) {
 
      str = str.replace('*', '%');
 
    }
    if(str == "" && this.parpro == "" && this.parfam == "" && this.codigo == "") {
      var error = "Se tiene que rellenar al menos uno de los campos";
      this.showError(error);
      return;
    }
 
    let loading = this.loadingCtrl.create({
      content: 'Buscando...'
    });
    loading.present();
    this.arigesData.getArticulosClienteExt(
      this.settings.url, 
      this.cliente.codclien,
      this.cliente.codactiv,
      this.cliente.codtarif, 
      str, 
      this.parpro,
      this.parfam, 
      this.codigo, 
      this.obsole,
      this.rotacion)
      .subscribe(
        (data) => {
          loading.dismiss();
          this.articulos = this.prepareArticulos(data);
          if(data.length == 0) {
              this.showNoEncontrado();
              this.articulos = data;
          }
        },
        (error) => {
          loading.dismiss();
          if (error.status == 404) {
            this.articulos = [];
            this.showNoEncontrado();
          } else {
            this.showError(error.error);
          }
        }
      );
    }
  }

  prepareArticulos(data): any {
    // formatear datos
    for (var i = 0; i < data.length; i++) {
      data[i].preciove = numeral(data[i].preciove).format('0,0.00 $');
      data[i].stock = numeral(data[i].stock).format('0,0.00');
      data[i].reservas = numeral(data[i].reservas).format('0,0');
      data[i].pedido = numeral(data[i].pedido).format('0,0');
      if (data[i].rotacion == 0) {
        data[i].rotacion = "NO";
      } else {
        data[i].rotacion = "SI";
      }
    }
    return data;
  }


  goArticulo(articulo): void {
    this.interData.setArticulo(articulo);
    this.viewCtrl.dismiss(true);
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

  showNoEncontrado(): void {
    let alert = this.alertCrtl.create({
      title: "AVISO",
      subTitle: "No se ha encontrado ningún artículo con estos criterios",
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
