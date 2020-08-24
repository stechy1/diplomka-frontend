import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ExperimentResult, ExperimentType } from '@stechy1/diplomka-share';

import {
  EntityGroup,
  SelectedEntities,
} from '@diplomka-frontend/stim-lib-list-utils';

@Component({
  selector: 'stim-feature-experiment-results-item-list',
  templateUrl: './experiment-results-item-list.component.html',
  styleUrls: ['./experiment-results-item-list.component.sass'],
})
export class ExperimentResultsItemListComponent implements OnInit {
  @Input() experimentResultGroups: EntityGroup<ExperimentResult>;
  @Input() selectedExperimentResults: SelectedEntities;
  @Input() selectionMode: boolean;
  @Output() view: EventEmitter<ExperimentResult> = new EventEmitter<
    ExperimentResult
  >();
  @Output() delete: EventEmitter<ExperimentResult> = new EventEmitter<
    ExperimentResult
  >();
  @Output() select: EventEmitter<ExperimentResult> = new EventEmitter<
    ExperimentResult
  >();

  ExperimentType = ExperimentType;

  constructor() {}

  ngOnInit() {}

  handleView(experimentResult: ExperimentResult) {
    this.view.next(experimentResult);
  }

  handleDelete(experimentResult: ExperimentResult) {
    this.delete.next(experimentResult);
  }

  handleExperimentResultIconClick(experimentResult: ExperimentResult) {
    if (this.selectionMode) {
      return;
    }

    this.select.emit(experimentResult);
  }
}