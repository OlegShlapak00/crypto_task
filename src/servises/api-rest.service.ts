import {Injectable} from '@angular/core';
import {apiKey} from '../configs/api';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {

  constructor(private http: HttpClient) {
  }

  getDataForChart(base: string, quote: string): Observable<any> {
    return this.http.get(`https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_${base}_${quote}/history?apikey=${apiKey}&period_id=1DAY`);
  }

  getAllExchanges(): Observable<any> {
    return this.http.get(` https://rest.coinapi.io/v1/symbols?apikey=${apiKey}&filter_symbol_id=BINANCE_SPOT_`);
  }
}
