import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VentasAgentePage } from './ventas-agente';

@NgModule({
  declarations: [
    VentasAgentePage,
  ],
  imports: [
    IonicPageModule.forChild(VentasAgentePage),
  ],
})
export class VentasAgentePageModule { }
