import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliResumenPage } from './cli-resumen';

@NgModule({
  declarations: [
    CliResumenPage,
  ],
  imports: [
    IonicPageModule.forChild(CliResumenPage),
  ],
})
export class CliResumenPageModule {}
