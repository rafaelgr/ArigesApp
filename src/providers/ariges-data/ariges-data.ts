import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
}
