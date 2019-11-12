import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationService } from './navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AliveCheckerService {

  private readonly _socket: Socket;
  private readonly _connected: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  private readonly connected$ = this._connected.asObservable();
  private readonly _requestDisconnect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly requestDisconnect$ = this._requestDisconnect.asObservable();
  private _firstTime = true;
  private _isConnected = false;

  constructor(private readonly navigation: NavigationService,
              private readonly toastr: ToastrService) {
    this._socket = new Socket({url: `${environment.makeURL(environment.url.socket, environment.port.socket)}`});
    this._socket.on('connect', () => this._socketConnected());
    this._socket.on('disconnect', (reason) => this._socketDisconnected(reason));
    navigation.subtitle = 'Odpojeno';
    navigation.icon = 'fa-circle text-danger';
  }

  public requestConnect() {
    this.navigation.subtitle = 'Připojuji';
    this.navigation.icon = 'fa-circle-notch';
    this.navigation.working = true;
    this._connected.next(ConnectionStatus.CONNECTING);
    this._socket.connect();
  }

  public requestDisconnect() {
    this._requestDisconnect.next(null);
    this._socket.disconnect();
  }

  protected _socketConnected() {
    this.navigation.subtitle = 'Připojeno';
    this.navigation.working = false;
    this.navigation.icon = 'fa-circle text-success';
    if (this._firstTime) {
      this.toastr.success('Spojení se serverem bylo vytvořeno.');
    } else {
      this.toastr.success('Spojení se serverem bylo obnoveno.');
    }
    this._connected.next(ConnectionStatus.CONNECTED);
    this._isConnected = true;
  }

  protected _socketDisconnected(reason) {
    this._firstTime = false;
    this.navigation.subtitle = 'Odpojeno';
    this.navigation.working = false;
    this.navigation.icon = 'fa-circle text-danger';
    this.toastr.error('Spojení se serverem bylo ztraceno');
    this._connected.next(ConnectionStatus.DISCONNECTED);
    this._isConnected = false;
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      this._socket.connect();
    }
  }

  get connectionStatus(): Observable<ConnectionStatus> {
    return this.connected$;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get isDisconnected(): boolean {
    return !this.isConnected;
  }

  get firstTime() {
    return this._firstTime;
  }

  get disconnect(): Observable<any> {
    return this.requestDisconnect$;
  }

}

export enum ConnectionStatus {
  DISCONNECTED, CONNECTING, CONNECTED
}
