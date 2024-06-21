import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {InstrumentExchange, Instrument} from "../../models/models";

@Component({
  selector: 'app-real-time-data',
  templateUrl: './real-time-data.component.html',
  styleUrl: './real-time-data.component.css'
})
export class RealTimeDataComponent {
  @Input() realtimeData$: Observable<InstrumentExchange | null>;
  @Input() currentInstrument?: Instrument;
}
