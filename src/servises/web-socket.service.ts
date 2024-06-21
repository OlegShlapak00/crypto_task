import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  $socketData = new BehaviorSubject<any>(null);
  private socket: WebSocket;
  private previousInstrument?: string;

  subscribeForInstrument(instrumentId: string): void {
    if (!this.socket) {
      this.createSocket().subscribe((isOpen) => {
        isOpen && this.socketSubscribe(instrumentId);
      });
      this.previousInstrument = instrumentId;
    } else {
      this.socketUnsubscribe(this.previousInstrument as string);
      this.socketSubscribe(instrumentId);
      this.$socketData.next({ last: {price: '', timestamp: ''} }); //clear data for previous instrument
      this.previousInstrument = instrumentId;
    }
  }

  private createSocket(): Observable<boolean> {
    const opened$ = new BehaviorSubject(false);
    const token = localStorage.getItem("id_token");
    this.socket = new WebSocket(`wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${token}`);

    this.socket.onopen = () => {
      opened$.next(true);
    };

    this.socket.onmessage = (event) => {
      this.$socketData.next(JSON.parse(event.data));
    };

    this.socket.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };

    return opened$;
  }

  private socketSubscribe(instrumentId: string) {
    this.socket.send(JSON.stringify({
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": instrumentId,
      "provider": "simulation",
      "subscribe": true,
      "kinds": [
        // subscribe to last value. Just for demo
        "last"
      ]
    }));
  }

  private socketUnsubscribe(instrumentId: string) {
    this.socket.send(JSON.stringify({
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": instrumentId,
      "provider": "simulation",
      "subscribe": false,
      "kinds": [
        "last"
      ]
    }));
  }
}
