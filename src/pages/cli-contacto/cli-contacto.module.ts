import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliContactoPage } from './cli-contacto';

@NgModule({
  declarations: [
    CliContactoPage,
  ],
  imports: [
    IonicPageModule.forChild(CliContactoPage),
  ],
})
export class CliContactoPageModule {}
