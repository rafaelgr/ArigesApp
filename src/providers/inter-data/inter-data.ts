import { Injectable } from '@angular/core';

@Injectable()
export class InterDataProvider {
  cliente: any;
  oferta: any;
  pedido: any;
  pedpro: any;
  albaran: any;
  factura: any;
  articulo: any;
  proveedor: any;
  lineaOferta: any;
  tipoS2: any;

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

  setPedidoProveedor(pedpro): void {
    this.pedpro = pedpro;
  }

  getPedidoProveedor(): any {
    return this.pedpro;
  }

  setAlbaran(albaran): void {
    this.albaran = albaran;
  }

  getAlbaran(): any {
    return this.albaran;
  }

  setFactura(factura): void {
    this.factura = factura;
  }

  getFactura(): any {
    return this.factura;
  }

  setArticulo(articulo): void {
    this.articulo = articulo;
  }

  getArticulo(): any {
    return this.articulo;
  }

  setProveedor(proveedor): void {
    this.proveedor = proveedor;
  }

  getProveedor(): any {
    return this.proveedor;
  }

  setLineaOferta(lineaOferta): void {
    this.lineaOferta = lineaOferta;
  }

  getLineaOferta(): any {
    return this.lineaOferta;
  }

  setTipoS2(tipoS2): void {
    this.tipoS2 = tipoS2;
  }

  getTipoS2(): any {
    return this.tipoS2;
  }
}
