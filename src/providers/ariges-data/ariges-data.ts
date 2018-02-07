import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';



@Injectable()
export class ArigesDataProvider {
  constructor(public http: HttpClient ) {
  }

  getLogin(apiUrl, login, password): any {
    return this.http.get(apiUrl + '/api/usuarios/login',{
      params: {
        'login': login,
        'password': password
      }
    });
  }
  getAgente(apiUrl, login): any {
    return this.http.get(apiUrl + '/api/trabajadores',{
      params: {
        'login': login
      }
    });
  }

}
