export const formatMilliSeconds = ms => {
  ms -= ms % 1000;
  ms /= 1000;
  return formatSeconds(ms);
};

export const formatSeconds = s => {
  let seconds = s % 60;
  s -= seconds;
  s /= 60;

  let minutes = s % 60;
  s -= minutes;
  s /= 60;

  let hours = s % 24;
  s -= hours;
  s /= 24;
  let days = s;

  if (seconds < 10)
    seconds = '0' + seconds;
  if (minutes < 10)
    minutes = '0' + minutes;
  if (hours < 10)
    hours = '0' + hours;

  return `${days}:${hours}:${minutes}:${seconds}`;
};
