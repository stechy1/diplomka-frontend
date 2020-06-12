import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { StimulatorFacade } from "@diplomka-frontend/stim-feature-stimulator/domain";
import { AliveCheckerFacade, ConnectionStatus } from "@diplomka-frontend/stim-lib-connection";


@Component({
  selector: 'stim-feature-settings-service-state',
  templateUrl: './service-state.component.html',
  styleUrls: ['./service-state.component.sass']
})
export class ServiceStateComponent implements OnInit {

  devices = [];
  firmwareForm = new FormGroup({
    text: new FormControl(null),
    firmware: new FormControl(null, [Validators.required])
  });

  public ConnectionStatus = ConnectionStatus;

  constructor(private readonly _service: StimulatorFacade,
              public readonly aliveChecker: AliveCheckerFacade,
              /*private readonly _ipc: IpcService*/) { }

  ngOnInit() {
  }

  handleDiscover() {
    this._service.discover();
    // this.devices = await this._service.discover();
  }

  async handleOpen(path: string) {
    // await this._service.open(path);
  }

  async handleStop() {
    // await this._service.stop();
  }

  handleFileSelect(event: Event) {
    const input = (event.target as HTMLInputElement);

    // // Vytvořím novou instanci třídy pro přečtení souboru
    // const reader = new FileReader();
    // const self = this;
    // // Nastavím payload, který se zavolá po přečtení souboru
    // reader.onload = () => {
    //   self.firmwareForm.setValue({firmware: reader.result, text: input.files[0].name});
    // };
    // reader.readAsDataURL(input.files[0]);
    this.firmwareForm.setValue({firmware: input.files[0], text: input.files[0].name});
  }

  handleUpdateStimulatorFirmware() {
    this._service.updateFirmware(this.firmwareForm.get('firmware').value);
  }

  // get serialConnected() {
  //   return this._service.isSerialConnected;
  // }
  //
  // get ipcConnected() {
  //   return this._ipc.isIpcConnected;
  // }

  get firmwareFilePath() {
    return this.firmwareForm.get('text').value;
  }
}
