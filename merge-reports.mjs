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
    const lines = fileLines.get(file) || [];
    lines.push({
      os: report.os,
      title: report.title,
      duration,
      average: duration / report.reps,
      headlessTitle: report.headlessTitle,
    });
    fileLines.set(file, lines);
  }
}

for (const [file, lines] of fileLines) {
  lines.sort((a, b) => {
    if (a.os !== b.os)
      return a.os < b.os ? -1 : 1;
    if (a.title !== b.title)
      return a.title < b.title ? -1 : 1;
    return a.duration - b.duration;
  });
}

const md = [];

for (const [file, lines] of fileLines) {
  md.push(`### ${file}`);
  md.push(`|os|browser|total|average|%|`);
  let last;
  let first = lines[0];
  for (const line of lines) {
    if (last?.title !== line.title) {
      md.push(`|---|---|---|---|---|`);
      first = line;
    }
    const percent = (line.duration / first.duration - 1) * 100;
    md.push(`|${line.os}|${line.title} ${line.headlessTitle}|${Math.round(line.duration)} ms|${Math.round(line.average)} ms|**+${Math.round(percent)}%**|`);
    last = line;
  }
  md.push('');
}

console.log(md.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY)
  await fs.promises.writeFile(process.env.GITHUB_STEP_SUMMARY, md.join('\n'));
