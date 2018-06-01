import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLocalizacionPage } from './modal-localizacion';

@NgModule({
  declarations: [
    ModalLocalizacionPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLocalizacionPage),
  ],
})
export class ModalLocalizacionPageModule {}
