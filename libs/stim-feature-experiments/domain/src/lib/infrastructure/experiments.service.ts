import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';

import { Experiment, ResponseObject, Sequence } from '@stechy1/diplomka-share';
import {
  BaseService,
  TOKEN_EXPERIMENTS_API_URL,
} from '@diplomka-frontend/stim-lib-common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExperimentsService extends BaseService<Experiment> {
  constructor(
    @Inject(TOKEN_EXPERIMENTS_API_URL) apiURL: string,
    protected readonly _http: HttpClient,
    protected readonly logger: NGXLogger
  ) {
    super(apiURL, _http, logger);
  }

  public nameExists(
    name: string,
    experimentID?: number
  ): Observable<ResponseObject<{ exists: boolean }>> {
    this.logger.info(
      `Odesílám požadavek pro otestování existence názvu experimentu: ${name}.`
    );
    return this._http.get<ResponseObject<{ exists: boolean }>>(
      `${this._accessPoint}/name-exists/${name}/${experimentID ?? 'new'}`
    );
  }

  public sequencesForExperiment(experiment: Experiment) {
    this.logger.info(
      'Odesílám požadavek pro získání všech sekvencí vygenerovaných pro zadaný experiment.'
    );
    return this._http.get<ResponseObject<Sequence[]>>(
      `${this._accessPoint}/sequences-for-experiment/${experiment.id}`
    );
  }
}
