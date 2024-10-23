import fs from 'fs';

export const reps = process.env.REPS ? +process.env.REPS : 1;
export const headless = process.env.HEADED ? false : true;
export const browserName = (process.env.BROWSER_NAME as any) || 'chromium';

function readExecutablePath() {
  if (!process.env.READ_EXECUTABLE_PATH_FROM)
    return { executablePath: undefined, title: undefined };

  const contents = fs.readFileSync(process.env.READ_EXECUTABLE_PATH_FROM, 'utf8');
  const [title, ...parts] = contents.split('\n')[0].split(' ');
  return { title, executablePath: parts.join(' ') };
}

export function executablePath() {
  return process.env.EXECUTABLE_PATH || readExecutablePath().executablePath;
}

export function channel() {
  return process.env.CHANNEL;
}

export function title() {
  return channel() || readExecutablePath().title || 'chromium';
}

export function headlessTitle() {
  return headless ? (process.env.PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW ? 'headless=new' : 'headless=old') : 'headed';
}
