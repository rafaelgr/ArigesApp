import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliDetallePage } from './cli-detalle';

@NgModule({
  declarations: [
    CliDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CliDetallePage),
  ],
})
export class CliDetallePageModule {}
