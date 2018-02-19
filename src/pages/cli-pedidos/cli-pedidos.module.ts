import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliPedidosPage } from './cli-pedidos';

@NgModule({
  declarations: [
    CliPedidosPage,
  ],
  imports: [
    IonicPageModule.forChild(CliPedidosPage),
  ],
})
export class CliPedidosPageModule {}
