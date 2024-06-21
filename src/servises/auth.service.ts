import {Injectable} from '@angular/core';
import moment from "moment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {url, userCredentials} from "../environments/environments";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  setSession(authResult: {expires_in: string, access_token: string}) {
    const expiresIn = moment().add(authResult.expires_in, 'second');

    localStorage.setItem('id_token', authResult.access_token);
    localStorage.setItem("expires_in", JSON.stringify(expiresIn.valueOf()));
  }

  login(): Observable<any> {
    //seems this request doesn`t work for application/json params
    let body = new URLSearchParams();

    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');
    body.set('username', userCredentials.username);
    body.set('password', userCredentials.password);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post(`${url}/identity/realms/fintatech/protocol/openid-connect/token`, body.toString(), options);
  }

  logout() { // Just for example
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_in");
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration(): moment.Moment {
    const expiration = localStorage.getItem("expires_in");
    const expiresAt = JSON.parse(expiration as string);
    return moment(expiresAt);
  }

}
