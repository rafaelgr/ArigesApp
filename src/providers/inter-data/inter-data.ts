import { Injectable } from '@angular/core';

@Injectable()
export class InterDataProvider {
  cliente: any;
  oferta: any;

  constructor() {

  }

  setCliente(cliente): void {
    this.cliente = cliente;
  }

  getCliente(): any {
    return this.cliente;
  }

  setOferta(oferta): void {
    this.oferta = oferta;
  }

  getOferta(): any {
    return this.oferta;
  }

}
