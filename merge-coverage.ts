/* SOURCE: https://github.com/facebook/jest/issues/2418#issuecomment-478932514 */
/* tslint:disable:no-console */
/*
ts-node ./merge-coverage.ts --report ./coverage0/coverage-final.json --report ./coverage1/coverage-final.json
*/

import * as fs from 'fs-extra';
import { createReporter } from 'istanbul-api';
import { createCoverageMap } from 'istanbul-lib-coverage';
import * as yargs from 'yargs';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const argv = yargs.options({
    report: {
      type: 'array', // array of string
      desc: 'Path of json coverage report file',
      demandOption: true,
    },
    reporters: {
      type: 'array',
      default: ['json', 'lcov', 'text'],
    },
  }).argv;

  const reportFiles = argv.report as string[];
  const reporters = argv.reporters as string[];

  const map = createCoverageMap();

  reportFiles.forEach((file) => {
    const r = fs.readJsonSync(file);
    map.merge(r);
  });

  const reporter = createReporter();
  await reporter.addAll(reporters);
  reporter.write(map);
  console.log('Created a merged coverage report in ./coverage');
}

fs.unlinkSync(`${__dirname}/merge-coverage.js`);