export function playAlertSound() {
  const audio = new Audio("/sounds/critical.mp3");
  audio.play().catch(() => {});
}
