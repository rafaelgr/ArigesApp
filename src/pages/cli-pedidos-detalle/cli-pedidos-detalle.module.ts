import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliPedidosDetallePage } from './cli-pedidos-detalle';

@NgModule({
  declarations: [
    CliPedidosDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CliPedidosDetallePage),
  ],
})
export class CliPedidosDetallePageModule {}
