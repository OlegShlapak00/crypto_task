import {Injectable} from "@angular/core";
import {apiKey} from "../configs/api";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  $socketData = new BehaviorSubject(null);
  private socket = new WebSocket('ws://ws.coinapi.io/v1/');

  constructor() {
    this.socket.onmessage = (event) => {
      this.$socketData.next(JSON.parse(event.data));
    };

    this.socket.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };
  }

  subscribeForAssets(base: string, quote: string): void {
    this.sendData(base, quote);
    this.$socketData.next(null);
  }

  sendData(base: string, quote: string) {
    this.socket.send(JSON.stringify({
      "type": "hello",
      "apikey": apiKey,
      "subscribe_data_type": ["trade"],
      "subscribe_filter_asset_id": [`${base}/${quote}`]
    }));
  }
}
