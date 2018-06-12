import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalArticulosBuscarPage } from './modal-articulos-buscar';

@NgModule({
  declarations: [
    ModalArticulosBuscarPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalArticulosBuscarPage),
  ],
})
export class ModalArticulosBuscarPageModule {}
