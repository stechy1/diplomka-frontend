import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as ConsoleActions from '../store/console.actions';
import * as fromConsole from '../store/console.reducer';
import { ConsoleState } from '../store/console.state';

@Injectable({
  providedIn: 'root',
})
export class ConsoleFacade {
  constructor(private readonly store: Store) {}

  public get state(): Observable<ConsoleState> {
    return this.store.select(fromConsole.consoleFeature);
  }

  processCommand(rawCommand: string) {
    this.store.dispatch(ConsoleActions.parseCommand({ rawCommand }));
  }

  loadHistory() {
    this.store.dispatch(ConsoleActions.loadHistory());
  }

  clearHistory() {
    this.store.dispatch(ConsoleActions.clearHistory());
  }

  saveCommand(message: string) {
    this.store.dispatch(ConsoleActions.saveCommand({ rawCommand: message, fromUser: false }));
  }
}
