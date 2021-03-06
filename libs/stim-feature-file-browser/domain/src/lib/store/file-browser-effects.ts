import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, mergeMap, switchMap } from 'rxjs/operators';

import { FileRecord, ResponseObject } from '@stechy1/diplomka-share';

import { FileBrowserService } from '../infrastructure/file-browser.service';
import * as FileBrowserActions from './file-browser-actions';

@Injectable()
export class FileBrowserEffects {
  constructor(private readonly actions$: Actions, private readonly _service: FileBrowserService) {}

  folderContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileBrowserActions.actionGetContentRequest),
      switchMap((action) => {
        return this._service.getContent(action.folders).pipe(
          map((response: ResponseObject<FileRecord[]>) => {
            response.data.sort(this._service.comparator);
            return FileBrowserActions.actionGetContentResponse({
              folders: action.folders,
              files: response.data,
            });
          })
        );
      })
    )
  );

  createFolder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileBrowserActions.actionCreateFolderRequest),
      mergeMap((action) => {
        return this._service.createFolder(action.folders, action.folderName).pipe(
          map((response: ResponseObject<FileRecord[]>) => {
            response.data.sort(this._service.comparator);
            return FileBrowserActions.actionGetContentResponse({
              folders: action.folders,
              files: response.data,
            });
          })
        );
      })
    )
  );

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileBrowserActions.actionUploadRequest),
      switchMap((action) => {
        return this._service.upload(action.folders, action.files).pipe(
          map((response: ResponseObject<FileRecord[]>) => {
            response.data.sort(this._service.comparator);
            return FileBrowserActions.actionGetContentResponse({
              folders: action.folders,
              files: response.data,
            });
          })
        );
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileBrowserActions.actionDeleteRequest),
      mergeMap((action) => {
        return this._service.delete(action.folders, action.file).pipe(
          map((response: ResponseObject<FileRecord[]>) => {
            response.data.sort(this._service.comparator);
            return FileBrowserActions.actionGetContentResponse({
              folders: action.folders,
              files: response.data,
            });
          })
        );
      })
    )
  );
}
