import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticulosPage } from './articulos';

@NgModule({
  declarations: [
    ArticulosPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticulosPage),
  ],
})
export class ArticulosPageModule {}
