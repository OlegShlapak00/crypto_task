import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {url} from "../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  constructor(private http: HttpClient) {}

  getDataForChart(instrumentId: string): Observable<any> {

    return this.http.get(`${url}/api/bars/v1/bars/count-back`, {
      params: {
        instrumentId,
        provider: 'simulation',
        interval: 1,
        periodicity: 'minute',
        barsCount: 20,
      }
    });
  }

  getFilteredProviders(symbol: string): Observable<any> {
    //get providers only for Forex simulation, for example
    return this.http.get(`${url}/api/instruments/v1/instruments?provider=simulation&kind=forex&size=110&symbol=${symbol.toUpperCase()}`);
  }

}
