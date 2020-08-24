import { createAction, props } from '@ngrx/store';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

import { IOEvent } from '@stechy1/diplomka-share/lib/serial-data-events';

export const actionPlayerIOEvent = createAction(
  '[Player] io event',
  props<{ ioEvent: IOEvent }>()
);

export const actionPrepareExperimentPlayerRequest = createAction(
  '[Player] prepare experiment player',
  props<{ options: PlayerConfiguration }>()
);
export const actionPrepareExperimentPlayerRequestDone = createAction(
  '[Player] prepare experiment player done',
  props<{
    autoplay: boolean;
    betweenExperimentInterval: number;
    repeat: number;
  }>()
);
export const actionPrepareExperimentPlayerRequestFail = createAction(
  '[Player] prepare experiment player fail',
  props<{}>()
);

export const actionPlayerUpdateState = createAction(
  '[Player] update player state from server',
  props<{
    initialized: boolean;
    experimentRound: number;
    ioData: IOEvent[][];
    autoplay: boolean;
    betweenExperimentInterval: number;
    repeat: number;
    isBreakTime: boolean;
  }>()
);

export const actionPlayerCreateNewExperimentRound = createAction(
  '[Player] create new experiment round',
  props<{}>()
);