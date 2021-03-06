import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';

import {
  MessageCodes,
  ResponseObject,
  SocketMessage,
  SocketMessageSpecialization,
  SocketMessageType,
  StimulatorDataStateMessage,
  StimulatorStateEvent,
} from '@stechy1/diplomka-share';
import * as ConnectionActions from '@diplomka-frontend/stim-lib-connection';
import { ExperimentsFacade } from '@diplomka-frontend/stim-feature-experiments/domain';

import { StimulatorService } from '../infrastructure/stimulator.service';
import { StimulatorStateType } from '../domain/stimulator-state';
import * as StimulatorActions from './stimulator.actions';
import { StimulatorState } from './stimulator.state';
import { stimulatorFeature } from './stimulator.reducer';

@Injectable()
export class StimulatorEffects {
  constructor(private readonly _service: StimulatorService, private readonly _facade: ExperimentsFacade, private readonly actions$: Actions, private readonly store: Store) {}

  discover$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionStimulatorDiscoverRequest),
      switchMap(() => {
        return this._service.discover().pipe(
          map((response: { data: [{ path: string }] }) => {
            // TODO error handling
            return StimulatorActions.actionStimulatorDiscoverDone(response);
          })
        );
      })
    )
  );
  open$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConnectionActions.actionStimulatorConnectRequest),
      switchMap((action) => {
        return this._service.open(action.path).pipe(
          map((response: ResponseObject<void>) => {
            switch (response.message.code) {
              case MessageCodes.CODE_SUCCESS_LOW_LEVEL_PORT_OPPENED:
                return ConnectionActions.actionStimulatorConnected();
              case MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPPENED:
                return ConnectionActions.actionStimulatorConnected();
              default:
                return ConnectionActions.actionStimulatorConnected();
            }
          })
        );
      })
    )
  );
  close$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConnectionActions.actionStimulatorDisconnectRequest),
      switchMap(() => {
        return this._service.close().pipe(
          map(() => {
            return ConnectionActions.actionStimulatorDisconnected();
          })
        );
      })
    )
  );
  connectionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConnectionActions.actionStimulatorConnectionStatusRequest),
      switchMap(() => {
        return this._service.connectionStatus().pipe(
          map((response: ResponseObject<{ connected: boolean }>) => {
            return response.data.connected ? ConnectionActions.actionStimulatorConnected() : ConnectionActions.actionStimulatorDisconnected();
          })
        );
      })
    )
  );

  updateFirmware$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionStimulatorFirmwareUpdateRequest),
      mergeMap((action) =>
        this._service.updateFirmware(action.path).pipe(
          map(() => {
            return StimulatorActions.actionStimulatorFirmwareUpdateDone();
          })
        )
      )
    )
  );

  reboot$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StimulatorActions.actionCommandRebootRequest),
        switchMap(() => {
          return this._service.reboot();
        })
      ),
    { dispatch: false }
  );

  state$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorStateRequest),
      switchMap(() => {
        return this._service.stimulatorState().pipe(
          map((response: ResponseObject<StimulatorStateEvent | undefined>) => {
            return StimulatorActions.actionCommandStimulatorStateRequestDone({
              state: response ? response.data.state : StimulatorStateType.READY,
            });
          }),
          catchError(() => {
            return of(StimulatorActions.actionCommandStimulatorStateRequestFail());
          })
        );
      })
    )
  );

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorUploadRequest),
      withLatestFrom(this._facade.state),
      switchMap(([action, experimentState]) =>
        this._service.experimentUpload(experimentState.selectedExperiment.experiment.id).pipe(
          mergeMap(() => {
            return [StimulatorActions.actionCommandStimulatorUploadRequestDone(), StimulatorActions.actionCommandStimulatorSetupRequest()];
          }),
          catchError(() => {
            return [StimulatorActions.actionCommandStimulatorSetupRequestFail()];
          })
        )
      )
    )
  );

  setup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorSetupRequest),
      withLatestFrom(this._facade.state),
      switchMap(([action, experimentState]) =>
        this._service.experimentSetup(experimentState.selectedExperiment.experiment.id).pipe(
          map(() => {
            return StimulatorActions.actionCommandStimulatorSetupRequestDone();
          }),
          catchError(() => {
            return of(StimulatorActions.actionCommandStimulatorSetupRequestFail());
          })
        )
      )
    )
  );

  run$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorRunRequest),
      withLatestFrom(this._facade.state),
      switchMap(([action, experimentState]) =>
        this._service.experimentRun(experimentState.selectedExperiment.experiment.id).pipe(
          map(() => {
            return StimulatorActions.actionCommandStimulatorRunRequestDone();
          }),
          catchError(() => {
            return of(StimulatorActions.actionCommandStimulatorRunRequestFail());
          })
        )
      )
    )
  );

  pause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorPauseRequest),
      withLatestFrom(this._facade.state),
      switchMap(([action, experimentState]) =>
        this._service.experimentPause(experimentState.selectedExperiment.experiment.id).pipe(
          map(() => {
            return StimulatorActions.actionCommandStimulatorPauseRequestDone();
          }),
          catchError(() => {
            return of(StimulatorActions.actionCommandStimulatorPauseRequestFail());
          })
        )
      )
    )
  );

  finish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorFinishRequest),
      withLatestFrom(this._facade.state),
      switchMap(([action, experimentState]) =>
        this._service.experimentFinish(experimentState.selectedExperiment.experiment.id, action.force).pipe(
          map(() => {
            return StimulatorActions.actionCommandStimulatorFinishRequestDone();
          }),
          catchError(() => {
            return of(StimulatorActions.actionCommandStimulatorFinishRequestFail());
          })
        )
      )
    )
  );

  clear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StimulatorActions.actionCommandStimulatorClearRequest),
      withLatestFrom(this.store.select(stimulatorFeature)),
      switchMap(([action, state]: [any, StimulatorState]) => {
        let result: Observable<void | ResponseObject<unknown>>;
        if (state.stimulatorState <= StimulatorStateType.SETUP || state.stimulatorState >= StimulatorStateType.FINISH) {
          result = this._service.experimentClear();
        } else {
          result = EMPTY;
        }

        return result.pipe(
          map((response: ResponseObject<unknown>) => {
            if (response === undefined) {
              return StimulatorActions.actionStimulatorNoop();
            }
            return StimulatorActions.actionCommandStimulatorClearRequestDone();
          }),
          catchError(() => {
            return of(StimulatorActions.actionCommandStimulatorClearRequestFail());
          })
        );
      })
    )
  );

  stimulatorState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConnectionActions.actionSocketData),
      map((action) => action.data as SocketMessage),
      filter((message: SocketMessage) => message.specialization === SocketMessageSpecialization.STIMULATOR),
      map((message: SocketMessage) => {
        let action;
        switch (message.type) {
          case SocketMessageType.STIMULATOR_DATA_STATE: {
            const stimulatorDataStateMessage = message as StimulatorDataStateMessage;
            action = StimulatorActions.actionCommandStimulatorStateRequestDone({
              state: stimulatorDataStateMessage.data.state,
            });
            break;
          }
          default:
            action = StimulatorActions.actionStimulatorNoop();
        }
        // return action.pipe(
        //   catchError(() => {
        //     return of(StimulatorActions.actionStimulatorNoop());
        //   })
        // );
        return action;
      })
    )
  );

  setOutput$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StimulatorActions.actionCommandStimulatorSetOutput),
        mergeMap((action) => {
          return this._service.setOutput(action.index, action.enabled);
        })
      ),
    { dispatch: false }
  );
}
