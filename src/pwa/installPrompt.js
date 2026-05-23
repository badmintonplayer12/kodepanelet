export function createInstallPromptController({ onAvailabilityChange } = {}) {
  let installPromptEvent = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPromptEvent = event;
    notifyAvailabilityChange();
  });

  window.addEventListener('appinstalled', () => {
    installPromptEvent = null;
    notifyAvailabilityChange();
  });

  function isInstallAvailable() {
    return Boolean(installPromptEvent);
  }

  async function promptInstall() {
    if (!installPromptEvent) return false;

    const promptEvent = installPromptEvent;
    installPromptEvent = null;
    notifyAvailabilityChange();

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    return choice.outcome === 'accepted';
  }

  function notifyAvailabilityChange() {
    onAvailabilityChange?.(isInstallAvailable());
  }

  return {
    isInstallAvailable,
    promptInstall,
  };
}
