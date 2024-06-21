import {Component, OnDestroy, OnInit} from "@angular/core";
import {ApiRestService} from "../servises/api-rest.service";
import {filter, map, Observable, throttleTime} from "rxjs";
import {WebSocketService} from "../servises/web-socket.service";
import {FormControl, Validators} from "@angular/forms";
import {InstrumentExchange, ChartDataRecord, Instrument} from "../models/models";
import {AuthService} from "../servises/auth.service";
import {retryWithDelay} from "../helpers/helpers";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'crypto';
  realtimeData$: Observable<InstrumentExchange | null>;
  transformedChartData: ChartDataRecord[] = [];
  instrumentControl = new FormControl('', [Validators.required]);
  instrumentList$: Observable<Instrument[]>;
  currentInstrument?: Instrument;
  allInstruments: Instrument[];

  constructor(
    private apiRestService: ApiRestService,
    private websocketService: WebSocketService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.login().subscribe((resultData: {expires_in: string, access_token: string}) => {
      this.authService.setSession(resultData);
    });

    this.apiRestService
      .getFilteredProviders('')
      .pipe(
        map(result => {
          this.allInstruments = result.data.map((symbol: any) => {
            return {
              id: symbol.id,
              name: `${symbol.baseCurrency}/${symbol.currency}`
            }
        })}),
        retryWithDelay(400, 3)
      ).subscribe();

    this.instrumentList$ = this.instrumentControl.valueChanges.pipe(
      map(symbol => this.allInstruments.filter(option => option.name.includes(symbol?.toUpperCase() || '')))
    );

    this.realtimeData$ = this.websocketService.$socketData.pipe(
      filter((data) => !!(data?.last)),
      map((data: { last: InstrumentExchange }) => data.last),
      throttleTime(1000),
    );

  }

  transformData(data: any): ChartDataRecord[] {
    return data.map((entry: any) => ({
      x: new Date(entry.t),
      y: [entry.o, entry.h, entry.l, entry.c]
    }));
  }

  subscribeForInstrument(): void {
    this.currentInstrument = this.allInstruments.find((option => option.name === this.instrumentControl.value));
    this.currentInstrument && this.websocketService.subscribeForInstrument(this.currentInstrument.id);
    this.currentInstrument && this.apiRestService.getDataForChart(this.currentInstrument.id).subscribe(result => {
     this.transformedChartData = this.transformData(result.data);
    });

  }



  ngOnDestroy(): void {
  }
}
