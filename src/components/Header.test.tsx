import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the site title', () => {
    render(<Header />);
    expect(screen.getByText('Beyond Writing Code')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Art')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Header />);
    const logo = screen.getByAltText(/colorful watercolor creature/i);
    expect(logo).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    const nav = screen.getByRole('navigation');

    expect(nav).not.toHaveClass('nav-open');

    fireEvent.click(menuButton);
    expect(nav).toHaveClass('nav-open');

    fireEvent.click(menuButton);
    expect(nav).not.toHaveClass('nav-open');
  });

  it('closes menu when navigation link is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    const nav = screen.getByRole('navigation');

    fireEvent.click(menuButton);
    expect(nav).toHaveClass('nav-open');

    const aboutLink = screen.getByText('About');
    fireEvent.click(aboutLink);
    expect(nav).not.toHaveClass('nav-open');
  });

  it('has correct aria-expanded attribute on menu button', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
