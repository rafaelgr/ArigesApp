import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliPreciosPage } from './cli-precios';

@NgModule({
  declarations: [
    CliPreciosPage,
  ],
  imports: [
    IonicPageModule.forChild(CliPreciosPage),
  ],
})
export class CliPreciosPageModule {}
