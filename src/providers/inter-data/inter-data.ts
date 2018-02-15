import { Injectable } from '@angular/core';

@Injectable()
export class InterDataProvider {
  cliente: any;

  constructor() {

  }

  setCliente(cliente): void {
    this.cliente = cliente;
  }

  getCliente(): any {
    return this.cliente;
  }

}
