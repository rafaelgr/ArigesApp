import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliFacturasPage } from './cli-facturas';

@NgModule({
  declarations: [
    CliFacturasPage,
  ],
  imports: [
    IonicPageModule.forChild(CliFacturasPage),
  ],
})
export class CliFacturasPageModule {}
