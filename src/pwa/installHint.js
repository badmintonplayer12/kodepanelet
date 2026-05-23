export function shouldShowIosInstallHint() {
  return isAppleTouchDevice() && !isRunningStandalone();
}

function isAppleTouchDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}
