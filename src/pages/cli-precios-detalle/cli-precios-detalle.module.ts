import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliPreciosDetallePage } from './cli-precios-detalle';

@NgModule({
  declarations: [
    CliPreciosDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CliPreciosDetallePage),
  ],
})
export class CliPreciosDetallePageModule {}
