import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliOfertasDetallePage } from './cli-ofertas-detalle';

@NgModule({
  declarations: [
    CliOfertasDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CliOfertasDetallePage),
  ],
})
export class CliOfertasDetallePageModule {}
