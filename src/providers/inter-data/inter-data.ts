import { Injectable } from '@angular/core';

@Injectable()
export class InterDataProvider {
  cliente: any;
  oferta: any;
  pedido: any;
  albaran: any;

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

  setPedido(pedido): void {
    this.pedido = pedido;
  }

  getPedido(): any {
    return this.pedido;
  }

  setAlbaran(albaran): void {
    this.albaran = albaran;
  }

  getAlbaran(): any {
    return this.albaran;
  }  
}
