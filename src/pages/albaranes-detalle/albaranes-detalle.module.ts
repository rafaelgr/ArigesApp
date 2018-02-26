import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlbaranesDetallePage } from './albaranes-detalle';

@NgModule({
  declarations: [
    AlbaranesDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(AlbaranesDetallePage),
  ],
})
export class AlbaranesDetallePageModule {}
