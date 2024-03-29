import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, ModalController} from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { CliMenuPage } from '../cli-menu/cli-menu';
import * as moment from 'moment';
import * as numeral from 'numeral';


@IonicPage()
@Component({
  selector: 'page-cli-resumen',
  templateUrl: 'cli-resumen.html',
})
export class CliResumenPage {
  settings: any;
  cliente: any = {};
  indicadores: any = {};
  ventaAnual: any = {
    
  };
  cobros: any = [];
  misDatos: any = [
   
  ];

  modalCobros: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public interData: InterDataProvider,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider, public alertCrtl: AlertController, 
    public menu: MenuController, public cliMenu: CliMenuPage, public modalCtrl: ModalController) {

     
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
    this.cliente = this.interData.getCliente();
    this.prepareLimCredito();
    this.arigesData.getIndicadores(this.settings.url, this.cliente.codclien, this.cliente.codmacta)
      .subscribe(
        (data) => {
          this.indicadores = this.prepareIndicadores(data);
        },
        (error) => {
          this.showError(error);
        }
      );
    this.arigesData.getVentaAnual(this.settings.url, this.cliente.codclien)
      .subscribe(
        (data) => {
          this.ventaAnual = data;
          this.prepareVentaAnual();
        },
        (error) => {
          this.showError(error);
        }
      );
    this.arigesData.getCobros(this.settings.url, this.cliente.codmacta)
      .subscribe(
        (data) => {
          this.cobros = this.prepareCobros(data);
        },
        (error) => {
          this.showError(error);
        }
      );
  }

  goCobro(cobro): void {
    var fecfactu = moment(cobro.fechafact, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.arigesData.getCobroParcial(this.settings.url, cobro.numserie, cobro.codfaccl, fecfactu, cobro.numorden)
    .subscribe(
      (data) => {
        var opciones = {};
        var cobros = this.prepareCobros(data);
        if(data.length > 0) {
          if(data[0].codusu == this.settings.user.login) {
            opciones = { cobro : cobros[0], desdeMenu: true, mismoUsuario: true }
          } else {
            opciones = { cobro : cobros[0], desdeMenu: true, mismoUsuario: false }
          }
        }else {
          opciones = { cobro : cobro, desdeMenu: false, mismoUsuario: true }
        }
        this.modalCobros = this.modalCtrl.create('CobrosDetallePage', opciones);
        this.modalCobros.present();
      },
      (error) => {
        this.showError(error);
      }
    );
  }

  prepareVentaAnual(): void {
   
    this.misDatos = [];
    for(var i = this.ventaAnual.data[1].length-1; i >= 0; i-- ) {
      this.ventaAnual.data[1][i] = numeral(this.ventaAnual.data[1][i]).format('0,0.00 $');
      var dato = {
        anyo: this.ventaAnual.labels[i],
        valor: this.ventaAnual.data[1][i]
      }
      this.misDatos.push(dato);
    }
    console.log(this.misDatos);
  }

  showError(error): void {
    let alert = this.alertCrtl.create({
      title: "ERROR",
      subTitle: JSON.stringify(error, null, 4),
      buttons: ['OK']
    });
    alert.present();
  }

  prepareCobros(cobros): any {
    for (var i = 0; i < cobros.length; i++) {
      var vencimiento = new Date(cobros[i].fechavenci);
      cobros[i].fechavenci = moment(new Date(cobros[i].fechavenci)).format('DD/MM/YYYY');
      cobros[i].fechafact = moment(new Date(cobros[i].fechafact)).format('DD/MM/YYYY');
      cobros[i].total = numeral(cobros[i].total).format('0,0.00 $');
      // marcar como vencido
      if (new Date() >= vencimiento) {
        cobros[i].vencido = true;
      } else {
        cobros[i].vencido = false;
      }
    }
    return cobros;
  }

  prepareIndicadores(indicadores): any {
    indicadores.saldoPendiente = numeral(indicadores.saldoPendiente).format('0,0.00 $');
    indicadores.saldoVencido = numeral(indicadores.saldoVencido).format('0,0.00 $');
    return indicadores;
  }

  prepareLimCredito(): any {
    this.cliente.limiteCredito = numeral( this.cliente.limiteCredito).format('0,0.00 $');
  }

  goPage(page) {
    // navigate to the new page if it is not the current page
    this.cliMenu.openPage(page);
  }

}
