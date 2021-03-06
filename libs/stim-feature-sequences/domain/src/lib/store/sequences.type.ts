import { Experiment, Output, Sequence } from '@stechy1/diplomka-share';

import { AppState } from '@diplomka-frontend/stim-lib-store';

import {
  EntityGroup,
  SelectedEntities,
} from '@diplomka-frontend/stim-lib-list-utils';

export interface SequencesState extends AppState {
  sequences: Sequence[];
  selectedSequences: SelectedEntities;
  selectionMode: boolean;
  ghosts: [];
  selectedSequence: {
    sequence: Sequence;
    originalSequence: Sequence;
    nameExists: boolean;
    isNew: boolean;
    experiments: Experiment<Output>[];
    experiment: Experiment<Output>;
  };
  groups: EntityGroup<Sequence>;
  hasGroups: boolean;
}
