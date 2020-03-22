import { browser } from 'protractor';

import { ExperimentType } from '@stechy1/diplomka-share';

import { ApplicationPage } from '../../../app.po';
import { ExperimentsPage } from '../../experiments.po';
import { ExperimentTypeAbstractSpecHelper } from '../experiment-type-abstract-helper.spec';
import { ExperimentTypeCvepPage } from './experiment-type-cvep.po';

describe('Experiment CVEP', () => {

  let app: ApplicationPage;
  let experiments: ExperimentsPage;
  let page: ExperimentTypeCvepPage;

  beforeEach(async () => {
    page = new ExperimentTypeCvepPage();
    experiments = new ExperimentsPage();
    app = new ApplicationPage();
    await browser.waitForAngularEnabled(false);
  });

  it('Should be able to create new experiment, check the list and delete the created experiment.', async () => {
    const experimentHelper: ExperimentTypeAbstractSpecHelper = new ExperimentTypeAbstractSpecHelper(app, experiments, page);
    await experimentHelper.testCreateNewExperiment(ExperimentType.CVEP, 'cvep-test');
  });

});