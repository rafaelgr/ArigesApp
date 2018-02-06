import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';




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

}
