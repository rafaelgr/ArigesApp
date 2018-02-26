import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProveedoresDetallePage } from './proveedores-detalle';

@NgModule({
  declarations: [
    ProveedoresDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ProveedoresDetallePage),
  ],
})
export class ProveedoresDetallePageModule {}
