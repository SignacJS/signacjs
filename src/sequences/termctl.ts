const clearScreen = { str: "c" };
const switchToAlternate = { csi: true, str: "?1049h" };
const switchToNormal = { csi: true, str: "?1047l" };

const setCursor = (x: number, y: number) => ({ csi: true, str: `${x};${y}G` });

export { clearScreen, switchToAlternate, switchToNormal, setCursor };
