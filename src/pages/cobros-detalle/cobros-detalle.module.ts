import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CobrosDetallePage } from './cobros-detalle';

@NgModule({
  declarations: [
    CobrosDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(CobrosDetallePage),
  ],
})
export class CobrosDetallePageModule {}
