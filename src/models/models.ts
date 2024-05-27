export interface AssetType {
  asset_id_base: string;
  asset_id_quote: string;
}

export interface ChartDataRecord {
  date: Date;
  price: number;
}

export interface AssetExchange {
  price: number;
  time_exchange: string;
}
