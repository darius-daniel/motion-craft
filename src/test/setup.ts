import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

Object.defineProperty(Element.prototype, 'animate', {
  writable: true,
  value: vi.fn().mockImplementation((_keyframes, options: KeyframeEffectOptions = {}) => {
    const duration = Number(options.duration ?? 0);
    const delay = Number(options.delay ?? 0);
    let timeoutId: ReturnType<typeof setTimeout>;
    let rejectFinished: (reason?: unknown) => void;

    const finished = new Promise<void>((resolve, reject) => {
      rejectFinished = reject;
      timeoutId = setTimeout(resolve, duration + delay);
    });

    return {
      cancel: vi.fn(() => {
        clearTimeout(timeoutId);
        rejectFinished(new DOMException('Aborted', 'AbortError'));
      }),
      finish: vi.fn(),
      pause: vi.fn(),
      play: vi.fn(),
      reverse: vi.fn(),
      finished,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  }),
});

beforeEach(() => {
  matchMediaMock.mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
});
