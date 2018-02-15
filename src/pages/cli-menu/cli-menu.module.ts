import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CliMenuPage } from './cli-menu';

@NgModule({
  declarations: [
    CliMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(CliMenuPage),
  ],
})
export class CliMenuPageModule {}
