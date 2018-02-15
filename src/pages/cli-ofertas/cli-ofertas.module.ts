import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliOfertasPage } from './cli-ofertas';

@NgModule({
  declarations: [
    CliOfertasPage,
  ],
  imports: [
    IonicPageModule.forChild(CliOfertasPage),
  ],
})
export class CliOfertasPageModule {}
