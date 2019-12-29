import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';
import { Options as SliderOptions } from 'ng5-slider/options';

import { ExperimentType, ExperimentTVEP } from 'diplomka-share';

import { environment } from '../../../../environments/environment';
import { NavigationService } from '../../../navigation/navigation.service';
import { ExperimentsService } from '../../experiments.service';
import { BaseExperimentTypeComponent } from '../base-experiment-type.component';

@Component({
  selector: 'app-experiment-type-tvep',
  templateUrl: './experiment-type-tvep.component.html',
  styleUrls: ['./experiment-type-tvep.component.sass']
})
export class ExperimentTypeTvepComponent extends BaseExperimentTypeComponent<ExperimentTVEP> implements OnInit {

  outputCountParams: SliderOptions = {
    floor: 1,
    ceil: environment.maxOutputCount,
    showTicks: true,
    showTicksValues: true,
    tickStep: 1,
    animate: false
  };

  constructor(service: ExperimentsService,
              toastr: ToastrService,
              router: Router,
              route: ActivatedRoute,
              navigation: NavigationService,
              cdr: ChangeDetectorRef,
              logger: NGXLogger) {
    super(service, toastr, router, route, navigation, cdr, logger);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected _createOutputsFormControls(): FormGroup[] {
    const array = [];
    for (let i = 0; i < environment.maxOutputCount; i++) {
      const group = new FormGroup({
        id: new FormControl(null, Validators.required),
        experimentId: new FormControl(null, Validators.required),
        orderId: new FormControl(null, Validators.required),
        out: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(9999)]),
        wait: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(9999)]),
        patternLength: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(32)]),
        pattern: new FormControl(null, [Validators.required]),
        brightness: new FormControl(null, [
          Validators.required, Validators.min(0), Validators.max(100)
        ]),
        outputType: new FormGroup({
          led: new FormControl(null),
          audio: new FormControl(null),
          audioFile: new FormControl(null),
          image: new FormControl(null),
          imageFile: new FormControl(null)
        }, [Validators.required])
      });
      group.setParent(this.form);
      array.push(group);
    }

    return array;
  }

  protected _createFormControls(): { [p: string]: AbstractControl } {
    const superControls = super._createFormControls();
    const myControls = {
      outputCount: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(environment.maxOutputCount)]),
      outputs: new FormArray([])
    };

    return {...superControls, ...myControls};
  }

  protected _createEmptyExperiment(): ExperimentTVEP {
    return {
      name: '',
      description: '',
      created: new Date().getTime(),
      type: ExperimentType.TVEP,
      usedOutputs: {},
      outputCount: 1,
      outputs: []
    };
  }

  protected _updateFormGroup(experiment: ExperimentTVEP) {
    if (experiment.outputs.length > 0) {
      (this.form.get('outputs') as FormArray).controls = this._createOutputsFormControls();
    } else {
      (this.form.get('outputs') as FormArray).controls = [];
    }

    super._updateFormGroup(experiment);
  }

  get outputCount() {
    return this.form.get('outputCount');
  }

}
