import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliBuscarPage } from './cli-buscar';

@NgModule({
  declarations: [
    CliBuscarPage,
  ],
  imports: [
    IonicPageModule.forChild(CliBuscarPage),
  ],
})
export class CliBuscarPageModule {}
