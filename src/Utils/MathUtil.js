export const formatDuration = ms => {
  ms -= ms % 1000;
  ms /= 1000;

  let seconds = ms % 60;
  ms -= seconds;
  ms /= 60;

  let minutes = ms % 60;
  ms -= minutes;
  ms /= 60;

  let hours = ms % 24;
  ms -= hours;
  ms /= 24;
  let days = ms;

  if (seconds < 10)
    seconds = '0' + seconds;
  if (minutes < 10)
    minutes = '0' + minutes;
  if (hours < 10)
    hours = '0' + hours;

  return `${days}:${hours}:${minutes}:${seconds}`;
};
