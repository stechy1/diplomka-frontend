import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Store } from "@ngrx/store";

import { FileRecord } from "@stechy1/diplomka-share";

import * as FileBrowserActions from '../store/file-browser-actions';

import { FileBrowserState } from "../..";
import { FileBrowserStateType } from "../domain/file-browser-state-type";

@Injectable()
export class FileBrowserFacade {

  private _folders: FileRecord[];

  constructor(private readonly store: Store<FileBrowserState>) {
    this.fileBrowserState.subscribe((state: FileBrowserStateType) => {
      this._folders = state.folderPath;
    });
  }

  public getContent(folder: FileRecord) {
    // Nadefinuji pomocnou proměnnou reprezentující aktuální cestu složek
    let folders = [];
    // Pokud je vybraná nějaká složky
    if (folder !== null) {
      // Získám cestu složek
      folders = [...this._folders];
      // Budu iterovat od poslední
      for (let i = folders.length - 1; i >= 0; i--) {
        // Získám jeden záznam
        const subfolder: FileRecord = folders[i];
        // Pokud tento záznam odpovídá vybrané složce
        if (subfolder.name === folder.name) {
          // Ukončím cyklus
          break;
        }
        // Složka neodpovídá vybrané, proto ji odeberu
        folders.splice(i);
      }
    }

    this.store.dispatch(FileBrowserActions.actionGetContentRequest({ folders }));
    }

  public createFolder(folderName: string) {
    this.store.dispatch(FileBrowserActions.actionCreateFolderRequest({ folders: this._folders, folderName }));
  }

  public upload(files: FileList) {
    this.store.dispatch(FileBrowserActions.actionUploadRequest({ folders: this._folders, files }));
  }

  public delete(file: FileRecord) {
    this.store.dispatch(FileBrowserActions.actionDeleteRequest({ folders: this._folders, file }));
  }

  get fileBrowserState(): Observable<FileBrowserStateType> {
    return this.store.select("fileBrowser");
  }
}
