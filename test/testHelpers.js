export function logInfo(message, args) {
  log('log', message, args);
}

export function logWarn(message, args) {
  log('warn', message, args);
}

export function logError(message, args) {
  log('error', message, args);
}

function log(method, message, args) {
  if(args) {
    console[method](message, JSON.stringify(args));
  } else {
    console[method](message);
  }
}
