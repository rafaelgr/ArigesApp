import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-cli-menu',
  templateUrl: 'cli-menu.html',
})
export class CliMenuPage {
  rootPage = 'CliResumenPage';
  pages: Array<{title: string, component: any}>;
  cliente: any

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public menu: MenuController) {
      this.pages = [
        { title: 'Resumen', component: 'CliResumenPage' },
        { title: 'Contacto', component: 'CliContactoPage' },
        { title: 'Ofertas', component: 'CliOfertasPage' },
        { title: 'Pedidos', component: 'CliPedidosPage' },
        { title: 'Albaranes', component: 'CliAlbaranesPage' },
        { title: 'Facturas', component: 'CliFacturasPage' },
        { title: 'Precios', component: 'CliPreciosPage' },
        { title: 'Precios especiales', component: 'CliPreciosEspecialesPage' },
        { title: 'Descuentos especiales', component: 'CliDescuentosEspecialesPage' }
      ];
      this.cliente = this.navParams.get('cliente');
  }

  ionViewDidLoad() {
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.rootPage = page.component;
  }

}
