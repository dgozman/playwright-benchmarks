import fs from 'fs';
import path from 'path';

const fileLines = new Map();

const dir = process.argv[2];
for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
  if (!entry.isDirectory())
    continue;
  const reportPath = path.join(dir, entry.name, 'report.json');
  const report = JSON.parse(await fs.promises.readFile(reportPath, 'utf8'));
  for (const { file, duration } of report.files) {
    const lines = fileLines.get(file) || new Set();
    lines.add(`|${report.os}|${report.title}|${Math.round(duration)} ms|${Math.round(duration / report.reps)} ms|`);
    fileLines.set(file, lines);
  }
}

const md = [];

for (const [file, lines] of fileLines) {
  md.push(`### ${file}`);
  md.push(`|os|browser|total|average|`);
  md.push(`|---|---|---|---|`);
  md.push(...lines);
  md.push('');
}

console.log(md.join('\n'));
await fs.promises.writeFile(process.env.GITHUB_STEP_SUMMARY, md.join('\n'));
