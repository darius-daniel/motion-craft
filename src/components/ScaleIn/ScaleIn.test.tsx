import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi, beforeEach } from 'vitest';
import ScaleIn from './ScaleIn';

beforeEach(() => {
  // Reset matchMedia mock before each test
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as any);
});

test('Renders children correctly', () => {
  const { container } = render(<ScaleIn>Test content</ScaleIn>);
  expect(container.firstElementChild?.nodeName).toBe('DIV');
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('Renders custom element type', () => {
  const { container } = render(<ScaleIn as="section">Test content</ScaleIn>);
  expect(container.firstChild?.nodeName).toBe('SECTION');
});

test('Applies custom className', () => {
  const { container } = render(
    <ScaleIn className="custom-class">Test content</ScaleIn>
  );
  expect(container.firstElementChild?.className).toContain('custom-class');
});

test('Calls onAnimationComplete callback', async () => {
  const onComplete = vi.fn();
  render(<ScaleIn duration={100} onAnimationComplete={onComplete} />);

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Applies custom style', () => {
  const { container } = render(
    <ScaleIn style={{ color: '#ffeeff' }}>Test content</ScaleIn>
  );
  const element = container.firstElementChild;

  expect(element).toHaveStyle({ color: '#ffeeff' });
});

test('Skips animation when prefers-reduced-motion is enabled', async () => {
  // Mock prefersReducedMotion to return true (animation disabled)
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: true,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as any);

  const onComplete = vi.fn();
  let { container } = render(
    <ScaleIn respectMotionPreference={true} onAnimationComplete={onComplete}>
      Test Content
    </ScaleIn>
  );
  let element = container.firstElementChild;
  expect(element).toHaveTextContent('Test Content');

  // When animation is skipped, callback should be called immediately
  await waitFor(() => {
    expect(onComplete).toHaveBeenCalledOnce();
  });

  // Test with fade prop
  const onComplete2 = vi.fn();
  ({ container } = render(
    <ScaleIn
      fade
      respectMotionPreference={true}
      onAnimationComplete={onComplete2}
    >
      Test Content
    </ScaleIn>
  ));
  element = container.firstElementChild;
  expect(element).toHaveTextContent('Test Content');

  await waitFor(() => {
    expect(onComplete2).toHaveBeenCalledOnce();
  });
});

test('Works with custom scaleFrom value', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn scaleFrom={0.5} duration={100} onAnimationComplete={onComplete}>
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Works with custom scaleTo value', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn scaleTo={1.2} duration={100} onAnimationComplete={onComplete}>
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Works with custom transformOrigin', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn
      transformOrigin="top left"
      duration={100}
      onAnimationComplete={onComplete}
    >
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Works with fade effect', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn
      fade
      scaleFrom={0.8}
      duration={100}
      onAnimationComplete={onComplete}
    >
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Works without fade effect', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn scaleFrom={0.8} duration={100} onAnimationComplete={onComplete}>
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('With default duration', async () => {
  const defaultDuration = 500;
  const onComplete = vi.fn();
  render(<ScaleIn onAnimationComplete={onComplete}></ScaleIn>);

  // Should not be called immediately
  expect(onComplete).not.toHaveBeenCalled();

  // Should be called after default duration
  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: defaultDuration + 100 }
  );
});

test('With custom duration', async () => {
  const onComplete = vi.fn();
  const duration = 350;
  render(
    <ScaleIn onAnimationComplete={onComplete} duration={duration}></ScaleIn>
  );

  expect(onComplete).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: duration + 100 }
  );
});

test('With default delay', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn onAnimationComplete={onComplete} respectMotionPreference></ScaleIn>
  );

  // With reduced motion, callback should be called immediately
  await waitFor(() => {
    expect(onComplete).toHaveBeenCalledOnce();
  });
});

test('With custom delay', async () => {
  const delay = 200;
  const onComplete = vi.fn();
  render(
    <ScaleIn
      onAnimationComplete={onComplete}
      duration={0}
      delay={delay}
    ></ScaleIn>
  );

  expect(onComplete).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: delay + 100 }
  );
});

test('With custom delay and duration', async () => {
  const delay = 200;
  const duration = 450;
  const onComplete = vi.fn();
  render(
    <ScaleIn
      duration={duration}
      delay={delay}
      onAnimationComplete={onComplete}
    ></ScaleIn>
  );

  expect(onComplete).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: delay + duration + 100 }
  );
});

test('Combines scaleFrom, scaleTo, and fade', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn
      scaleFrom={0.5}
      scaleTo={1.2}
      fade
      duration={100}
      onAnimationComplete={onComplete}
    >
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Works with different timing functions', async () => {
  const onComplete = vi.fn();
  render(
    <ScaleIn
      timingFunction="ease-in-out"
      duration={100}
      onAnimationComplete={onComplete}
    >
      Test Content
    </ScaleIn>
  );

  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledOnce();
    },
    { timeout: 200 }
  );
});

test('Handles ref forwarding', () => {
  const ref = { current: null };
  render(
    <ScaleIn ref={ref}>
      <div>Test Content</div>
    </ScaleIn>
  );

  expect(ref.current).not.toBeNull();
});
