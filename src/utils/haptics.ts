export function vibrateTap(): void {
  if ('vibrate' in navigator) navigator.vibrate(15);
}
