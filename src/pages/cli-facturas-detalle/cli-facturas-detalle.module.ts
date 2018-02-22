import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliFacturasDetallePage } from './cli-facturas-detalle';

@NgModule({
  declarations: [
    CliFacturasDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CliFacturasDetallePage),
  ],
})
export class CliFacturasDetallePageModule {}
