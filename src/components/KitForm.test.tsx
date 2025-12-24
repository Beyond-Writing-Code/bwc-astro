import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import KitForm from './KitForm';

describe('KitForm', () => {
  let appendedScripts: HTMLScriptElement[] = [];
  let originalAppendChild: typeof HTMLDivElement.prototype.appendChild;

  beforeEach(() => {
    appendedScripts = [];
    originalAppendChild = HTMLDivElement.prototype.appendChild;
    HTMLDivElement.prototype.appendChild = function <T extends Node>(node: T): T {
      if (node instanceof HTMLScriptElement) {
        appendedScripts.push(node);
      }
      return originalAppendChild.call(this, node) as T;
    };
  });

  afterEach(() => {
    HTMLDivElement.prototype.appendChild = originalAppendChild;
    vi.restoreAllMocks();
  });

  it('renders a container div', () => {
    const { container } = render(<KitForm formId="test-form-id" />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('applies the className prop', () => {
    const { container } = render(<KitForm formId="test-form-id" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('loads the Kit script with correct formId', () => {
    render(<KitForm formId="abc123" />);

    expect(appendedScripts.length).toBe(1);
    const script = appendedScripts[0];
    expect(script.src).toContain('https://leafjessicaroy.kit.com/abc123.js');
    expect(script.getAttribute('data-uid')).toBe('abc123');
    expect(script.async).toBe(true);
  });
});
