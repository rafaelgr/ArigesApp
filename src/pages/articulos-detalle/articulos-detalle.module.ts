import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticulosDetallePage } from './articulos-detalle';

@NgModule({
  declarations: [
    ArticulosDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ArticulosDetallePage),
  ],
})
export class ArticulosDetallePageModule {}
