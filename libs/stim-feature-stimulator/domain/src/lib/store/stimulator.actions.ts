import { createAction, props } from "@ngrx/store";
import { StimulatorStateType } from "../domain/stimulator-state";


export const actionStimulatorDiscover = createAction('[Stimulator] discover', props<{}>());
export const actionStimulatorDiscoveredPaths = createAction('[Stimulator] Discovered paths', props<{data: [{path: string}]}>());

export const actionStimulatorFirmwareUpdateRequest = createAction('[Stimulator] firmware update request', props<{ firmware: Blob }>());
export const actionStimulatorFirmwareUpdateDone = createAction('[Stimulator] firmware update request done', props<{}>());
export const actionStimulatorFirmwareUpdateFail = createAction('[Stimulator] firmware update request fail', props<{}>());

export const actionCommandRebootRequest = createAction('[Settings] Command reboot request', props<{}>());
export const actionCommandStimulatorStateRequest = createAction('[Settings] Command stimulator state request', props<{}>());
export const actionCommandStimulatorStateRequestDone = createAction('[Settings] Command stimulator state request done', props<{ state: StimulatorStateType }>());
export const actionCommandStimulatorStateRequestFail = createAction('[Settings] Command stimulator state request fail', props<{}>());

export const actionCommandStimulatorUploadRequest = createAction('[Settings] Command stimulator upload request', props<{ experimentID: number }>());
export const actionCommandStimulatorSetupRequest = createAction('[Settings] Command stimulator setup request', props<{ experimentID: number }>());
export const actionCommandStimulatorRunRequest = createAction('[Settings] Command stimulator run request', props<{ experimentID: number }>());
export const actionCommandStimulatorPauseRequest = createAction('[Settings] Command stimulator pause request', props<{ experimentID: number }>());
export const actionCommandStimulatorFinishRequest = createAction('[Settings] Command stimulator finish request', props<{ experimentID: number }>());
export const actionCommandStimulatorClearRequest = createAction('[Settings] Command stimulator clear request', props<{}>());
