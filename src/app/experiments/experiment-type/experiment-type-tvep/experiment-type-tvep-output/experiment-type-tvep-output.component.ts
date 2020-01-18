import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Options as SliderOptions } from 'ng5-slider/options';

import { environment } from '../../../../../environments/environment';
import { Experiment, ExperimentType } from '@stechy1/diplomka-share';
import { brightnessSliderOptions } from '../../../experiments.share';

@Component({
  selector: 'app-experiment-type-tvep-output',
  templateUrl: './experiment-type-tvep-output.component.html',
  styleUrls: ['./experiment-type-tvep-output.component.sass']
})
export class ExperimentTypeTvepOutputComponent implements OnInit, OnDestroy {

  patternLengthSliderOptions: SliderOptions = {
    floor: 1,
    ceil: 32,
    showTicks: false,
    showTicksValues: false,
    tickStep: 1,
    showSelectionBar: true,
    animate: false
  };

  @Input() form: FormGroup;
  @Input() count: number;
  @Input() experimentReady: Observable<Experiment>;

  readonly patternSizes: BehaviorSubject<number>[] = [];

  private _experimentReadySubscription: Subscription;
  private _patternLengthSubscriptions: Subscription[] = [];
  private _emptyExperiment = true;

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < environment.maxOutputCount; i++) {
      this.patternSizes.push(new BehaviorSubject<number>(1));
    }

    this._experimentReadySubscription = this.experimentReady.subscribe((experiment: Experiment) => {
      if (experiment.type !== ExperimentType.NONE) {
        this._emptyExperiment = false;
        for (let i = 0; i < environment.maxOutputCount; i++) {
          this._patternLengthSubscriptions.push(this.patternLength(i).valueChanges.subscribe(patternLength => {
            this.patternSizes[i].next(patternLength);
          }));
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (!this._emptyExperiment) {
      for (let i = 0; i < environment.maxOutputCount; i++) {
        this._patternLengthSubscriptions[i].unsubscribe();
      }
    }
    this._experimentReadySubscription.unsubscribe();
  }

  get brightnessSliderOptions(): SliderOptions {
    return brightnessSliderOptions;
  }

  get outputs() {
    return (this.form.get('outputs') as FormArray).controls;
  }

  outputType(index: number): FormGroup {
    return this.outputs[index].get('outputType') as FormGroup;
  }

  patternLength(index: number) {
    return this.outputs[index].get('patternLength');
  }

  out(index: number) {
    return this.outputs[index].get('out');
  }

  wait(index: number) {
    return this.outputs[index].get('wait');
  }

  brightness(index: number) {
    return this.outputs[index].get('brightness');
  }

}
