export interface ChartDataRecord {
  x: Date;
  y: number[];
}

export interface InstrumentExchange {
  price: number;
  timestamp: string;
}


export interface Instrument {
  id: string;
  name: string;
}
