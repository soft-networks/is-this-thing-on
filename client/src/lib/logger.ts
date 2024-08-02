let debug = true;

export function logCallbackSetup(message: any, optionalParams?: any[]) {
  logger("🟢 " + message, optionalParams);
}
export function logCallbackDestroyed(message: any, optionalParams?: any[]) {
  logger("⚫️ " + message, optionalParams);
}
export function logFirebaseUpdate(message: any, optionalParams?: any[]) {
  logger("🔵 " + message, optionalParams);
}
export function logVideo(message: any, videoURL: string) {
  if (debug) console.log("🎥 " + message + " WATCH: ", videoURL);
}
export function logError(message: any, optionalParams?: any[]) {
  logger("🌕 " + message, optionalParams);
}
export function logInfo(message: any, optionalParams?: any[]) {
  logger("• " + message, optionalParams);
}

export function logger(message: any, optionalParams?: any[]) {
  if (debug) {
    if (optionalParams) console.log(message, optionalParams);
    else console.log(message);
  }
}
