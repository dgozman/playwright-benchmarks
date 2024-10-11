import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import path from 'path';
import fs from 'fs';
import { title, reps, headlessTitle } from './common';

export default class TotalTimeReporter implements Reporter {
  private _startTime = new Map<string, number>();
  private _endTime = new Map<string, number>();
  private _config: FullConfig;

  printsToStdio(): boolean {
    return false;
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this._config = config;
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    const file = test.location.file;
    if (!this._startTime.has(file))
      this._startTime.set(file, performance.now());
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const file = test.location.file;
    this._endTime.set(file, performance.now());
  }

  async onEnd(result: FullResult) {
    const files = [...this._startTime.keys()].map(file => ({
      file: path.relative(this._config.rootDir, file),
      duration: this._endTime.get(file)! - this._startTime.get(file)!,
    }));
    const json = {
      os: { 'darwin': 'macos', 'linux': 'linux', 'win32': 'windows' }[process.platform],
      title: title(),
      headlessTitle: headlessTitle(),
      reps,
      files,
    };
    fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(json, null, 2));
  }
}
