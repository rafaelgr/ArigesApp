import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CopyPastePage } from './copy-paste';

@NgModule({
  declarations: [
    CopyPastePage,
  ],
  imports: [
    IonicPageModule.forChild(CopyPastePage),
  ],
})
export class CopyPastePageModule {}
