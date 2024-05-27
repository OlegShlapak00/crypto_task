import {Component, OnInit} from "@angular/core";
import {ApiRestService} from "../servises/api-rest.service";
import {catchError, debounceTime, map, Observable, startWith, take, throttleTime} from "rxjs";
import {WebSocketService} from "../servises/web-socket.service";
import {FormControl, Validators} from "@angular/forms";
import {AssetExchange, AssetType, ChartDataRecord} from "../models/models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'crypto';
  realtimeData$: Observable<AssetExchange>;
  allAssets: AssetType[];
  transformedChartData: ChartDataRecord[] | null = null;
  baseControl = new FormControl('', [Validators.required]);
  quoteControl = new FormControl('', [Validators.required]);
  filteredBaseOptions$: Observable<string[]>;
  filteredQuoteOptions$: Observable<string[]>;
  currentAssets: AssetType;

  constructor(private apiRestService: ApiRestService, private websocketService: WebSocketService) {}

  ngOnInit(): void {

    this.apiRestService.getAllExchanges().pipe(take(1)).subscribe(data => {
      this.allAssets = data.map((asset: AssetType) => {
        return {
          asset_id_base: asset.asset_id_base,
          asset_id_quote: asset.asset_id_quote
        }
      });
    });

    this.realtimeData$ = this.websocketService.$socketData.pipe(throttleTime(1000) as any);

    this.filteredBaseOptions$ = this.baseControl.valueChanges.pipe(
      startWith(''),
      map(() => this.filterAsset('BASE')),
      debounceTime(500)
    );

    this.filteredQuoteOptions$ = this.quoteControl.valueChanges.pipe(
      startWith(''),
      map(() => this.filterAsset('QUOTE')),
      debounceTime(500)
    );
  }

  transformData(data: any): ChartDataRecord[] {
    return data.map((entry: any) => ({
      date: new Date(entry.time_period_start),
      price: entry.price_close
    }));
  }

  subscribeAsset(): void {
    this.currentAssets = {
      asset_id_base : this.baseControl.value?.toUpperCase() || '',
      asset_id_quote: this.quoteControl.value?.toUpperCase() || ''
    }

    this.websocketService.subscribeForAssets(this.currentAssets.asset_id_base, this.currentAssets.asset_id_quote);

    this.apiRestService
      .getDataForChart(this.currentAssets.asset_id_base, this.currentAssets.asset_id_quote)
      .pipe(take(1), catchError(() => {
        this.transformedChartData = null;
        return [];
      }))
      .subscribe(chartData => {
        this.transformedChartData = this.transformData(chartData);
      });
  }

  private filterAsset(type: 'BASE' | 'QUOTE'): string[] {
    return this.allAssets
      ?.filter((asset) => asset.asset_id_base.toLowerCase().includes((this.baseControl.value || '').toLowerCase())
        && asset.asset_id_quote.toLowerCase().includes((this.quoteControl.value || '').toLowerCase()))
      ?.map((asset: AssetType) => type === 'BASE' ? asset.asset_id_base : asset.asset_id_quote)
      ?.filter((value: string, index: number, array: string[]) => array.indexOf(value) === index);

  }
}
