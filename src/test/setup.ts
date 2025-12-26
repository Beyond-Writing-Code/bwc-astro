import '@testing-library/jest-dom/vitest';

// Suppress jsdom navigation errors (not implemented in jsdom)
const originalError = console.error;
const originalWarn = console.warn;

const suppressJsdomWarnings = (message: string) => {
  return (
    message.includes('Not implemented: navigation') ||
    message.includes('Not implemented: HTMLFormElement.prototype.submit')
  );
};

console.error = (...args: unknown[]) => {
  const errorMessage = args[0]?.toString() || '';
  if (suppressJsdomWarnings(errorMessage)) return;
  originalError.call(console, ...args);
};

console.warn = (...args: unknown[]) => {
  const warnMessage = args[0]?.toString() || '';
  if (suppressJsdomWarnings(warnMessage)) return;
  originalWarn.call(console, ...args);
};
