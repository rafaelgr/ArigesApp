import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';



@Injectable()
export class ArigesDataProvider {
  constructor(public http: HttpClient) {
  }

  getLogin(apiUrl, login, password): any {
    return this.http.get(apiUrl + '/api/usuarios/login', {
      params: {
        'login': login,
        'password': password
      }
    });
  }
  getAgente(apiUrl, login): any {
    return this.http.get(apiUrl + '/api/trabajadores', {
      params: {
        'login': login
      }
    });
  }

  getClientes(apiUrl, agente, parnom): any {
    let params = {
      'parnom': parnom,
      'agente': agente
    };
    return this.http.get(apiUrl + '/api/clientes/clientes-agente', {
      params: params
    });
  }

  getClientesExt(apiUrl, agente, parnom): any {
    let params = {
      'parnom': parnom,
      'agente': agente
    };
    return this.http.get(apiUrl + '/api/clientes/clientes-agente/ext', {
      params: params
    });
  }

  getIndicadores(apiUrl, codclien, codmacta): any {
    let params = {
      'codclien': codclien,
      'codmacta': codmacta
    };
    return this.http.get(apiUrl + '/api/indicadores', {
      params: params
    });
  }
  getVentaAnual(apiUrl, codclien): any {
    return this.http.get(apiUrl + '/api/clientes/vanual/' + codclien);
  }

  getCobros(apiUrl, codmacta): any {
    let params = {
      'codmacta': codmacta
    };
    return this.http.get(apiUrl + '/api/cobros', {
      params: params
    });
  }

  getOfertas(apiUrl, codclien): any {
    return this.http.get(apiUrl + '/api/ofertas/cliente/' + codclien);
  }

  getPedidosCliente(apiUrl, codclien): any {
    return this.http.get(apiUrl + '/api/pedidos/cliente/' + codclien);
  }

  getAlbaranesCliente(apiUrl, codclien): any {
    return this.http.get(apiUrl + '/api/albaranes/cliente/' + codclien);
  }

  getFacturas(apiUrl, codclien): any {
    return this.http.get(apiUrl + '/api/facturas/cliente/' + codclien);
  }

  getFacturasComentarios(apiUrl, codclien): any {
    return this.http.get(apiUrl + '/api/facturas/cliente/comentarios/' + codclien);
  }


  getArticulos(apiUrl, parnom): any {
    let params = {
      'parnom': parnom
    };
    return this.http.get(apiUrl + '/api/articulos', {
      params: params
    });
  }

  getArticulosExt(apiUrl, parnom, parpro, parfam, codigo, obsole, rotacion): any {
    
    let params = {
      'parnom': parnom,
      'parpro': parpro,
      'parfam': parfam,
      'codigo': codigo,
      'obsole': obsole, 
      'rotacion': rotacion
    };
    return this.http.get(apiUrl + '/api/articulos/ext', {
      params: params
    });
  }

  getArticulosExtBis(apiUrl, parnom, parpro, parfam, codigo, obsole, rotacion): any {
    
    let params = {
      'parnom': parnom,
      'parpro': parpro,
      'parfam': parfam,
      'codigo': codigo,
      'obsole': obsole, 
      'rotacion': rotacion
    };
    return this.http.get(apiUrl + '/api/articulos/ext/bis', {
      params: params
    });
  }

  getArticulosCliente(apiUrl, codclien, codactiv, codtarif, parnom): any {
    let params = {
      'codclien': codclien,
      'codactiv': codactiv,
      'codtarif': codtarif,
      'parnom': parnom
    };
    return this.http.get(apiUrl + '/api/articulos/cliente', {
      params: params
    });
  }

  getArticulosClienteExt(apiUrl, codclien, codactiv, codtarif, parnom, parpro, parfam, codigo, obsole, rotacion): any {
    let params = {
      'codclien': codclien,
      'codactiv': codactiv,
      'codtarif': codtarif,
      'parnom': parnom,
      'parpro': parpro,
      'parfam': parfam,
      'codigo': codigo,
      'obsole': obsole,
      'rotacion': rotacion
    };
    return this.http.get(apiUrl + '/api/articulos/cliente/ext', {
      params: params
    });
  }

  getArticulosPreciosEspeciales(apiUrl, codclien): any {
    let params = {
      'codclien': codclien
    };
    return this.http.get(apiUrl + '/api/articulos/precios-especiales', {
      params: params
    });
  }

  getArticulosDescuentosEspeciales(apiUrl, codclien): any {
    let params = {
      'codclien': codclien
    };
    return this.http.get(apiUrl + '/api/articulos/descuentos-especiales', {
      params: params
    });
  }

  getProveedores(apiUrl, parnom): any {
    let params = {
      'parnom': parnom
    };
    return this.http.get(apiUrl + '/api/proveedores', {
      params: params
    });
  }

  getProveedoresDescuentosRappeles(apiUrl, codprove): any {
    return this.http.get(apiUrl + '/api/proveedores/descuentos-rappeles', {
        params: {
            "codprove": codprove
        }
    })
}

  getFamilias(apiUrl, parnom): any {
    let params = {
      'parnom': parnom
    };
    return this.http.get(apiUrl + '/api/familias', {
      params: params
    });
  }

  getPedidos(apiUrl): any {
    return this.http.get(apiUrl + '/api/pedidos');
  }


  getPedidosAgente(apiUrl, codagent): any {
    
    let params = {
      'codagent': codagent
    };
    return this.http.get(apiUrl + '/api/pedidos/agente', {
      params: params
    });;
  }

  getPedido(apiUrl, numpedcl): any {
    let params = {
      'numpedcl': numpedcl
    };
    return this.http.get(apiUrl + + '/api/pedidos/pedido',{
      params: params
    });
  }

  getAlbaranes(apiUrl): any {
    return this.http.get(apiUrl + '/api/albaranes');
  }

  getAlbaranesAgente(apiUrl, codagent): any {
    
    let params = {
      'codagent': codagent
    };
    return this.http.get(apiUrl + '/api/albaranes/agente', {
      params: params
    });;
  }

  

  getAlbaranDetalle(apiUrl, codtipom, numalbar): any {
    let params = {
      'codtipom': codtipom,
      'numalbar': numalbar
    };
    return this.http.get(apiUrl + '/api/albaranes/detalle',{
      params: params
    });
  }


  getCobroParcial(apiUrl, numserie, numfactu, fecfactu, numorden): any {
    let params = {
      'numserie': numserie,
      'numfactu': numfactu,
      'fecfactu': fecfactu,
      'numorden': numorden
    };
    return this.http.get(apiUrl + '/api/cobros/parciales/cobro/devolver', {
      params : params
    });
  }

  

  getCobrosUsuario(apiUrl, codusu): any {
    let params = {
      'codusu': codusu
    };
    return this.http.get(apiUrl + '/api/cobros/parciales/cobro/devolver/usuario', {
      params : params
    });
  }

  getTiposFormasPago(apiUrl): any {
    return this.http.get(apiUrl + '/api/fpago/tiposFormasPago');
  }

  getTipoAccion(apiUrl, tipo): any {
    let params = {
      'tipo': tipo
    };
    return this.http.get(apiUrl + '/api/acciones/tipos', { 
      params: params}
    );
  }

  getUnTipoAccion(apiUrl, tipo): any {
    let params = {
      'tipo': tipo
    };
    return this.http.get(apiUrl + '/api/acciones/tipos/uno', { 
      params: params}
    );
  }

  postCabeceraOferta(apiUrl, oferta): any {
    return this.http.post(apiUrl + '/api/ofertas/caboferta', oferta);
  }

  getVisitas(apiUrl, tipo, login, codclien): any {
    let params = {
      'tipo': tipo,
      'login': login,
      'codclien': codclien
    };
    return this.http.get(apiUrl + '/api/acciones/', {
      params: params
    });
  }

  getVisitasAgente(apiUrl, tipo, login, fechaInicial, fechaFinal): any {
    let params = {
      'tipo': tipo,
      'login': login,
      'fechaInicial': fechaInicial,
      'fechaFinal': fechaFinal
    };
    return this.http.get(apiUrl + '/api/acciones/tipos/agente/logado', {
      params: params
    });
  }

  putCabeceraOferta(apiUrl, oferta): any {
    return this.http.put(apiUrl + '/api/ofertas/caboferta', oferta);
  }
 

  postLineaOferta(apiUrl, oferta): any {
    return this.http.post(apiUrl + '/api/ofertas/linoferta', oferta);
  }

  postCobroParcial(apiUrl, cobroParcial) : any {
    return this.http.post(apiUrl + '/api/cobros/nuevo/parcial', cobroParcial);
  }

  postVisita(apiUrl, visita) : any {
    return this.http.post(apiUrl + '/api/acciones/', visita);
  }

  putVisita(apiUrl, visita) : any {
    return this.http.put(apiUrl + '/api/acciones/', visita);
  }

  putCobroParcial(apiUrl, cobroParcial): any {
    return this.http.put(apiUrl + '/api/cobros/cobroparcial', cobroParcial);
  }

  putLineaOferta(apiUrl, oferta): any {
    return this.http.put(apiUrl + '/api/ofertas/linoferta', oferta);
  }
 
  deleteLineaOferta(apiUrl, numofert, numlinea): any {
    return this.http.delete(apiUrl + '/api/ofertas/linoferta?numofert='+ numofert +'&numlinea='+ numlinea);
  }

  deleteOferta(apiUrl, numofert): any {
    return this.http.delete(apiUrl + '/api/ofertas/caboferta?numofert='+ numofert);
  }
}
