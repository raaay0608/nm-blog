export function iso2LocaleDate(value) {
  if (!value) {
    return '';
  }
  return (new Date(value)).toLocaleString();
}

export function readableFileSize(value) {
  if (!value) {
    return '';
  }
  let i = 0;
  let currentValue = value; // eslint-disable-line no-unused-vars
  const byteUnits = [' B', ' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  while (currentValue > 1024) {
    currentValue /= 1024;
    i += 1;
    if (i >= 8) {
      break;
    }
  }

  return Math.max(currentValue, 0.1).toFixed(1) + byteUnits[i];
}
