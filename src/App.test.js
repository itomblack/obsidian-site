import { fireEvent, render, screen } from '@testing-library/react';
import ProjectGallery from './components/obsidian/ProjectGallery';
import TestimonialCarousel from './components/obsidian/TestimonialCarousel';

test('renders the selected work gallery', () => {
  render(<ProjectGallery />);
  expect(screen.getByRole('region', { name: /selected work/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /maven clinic product experience/i })).toBeInTheDocument();
});

test('keeps logo and arrow testimonial controls in sync', () => {
  render(<TestimonialCarousel />);

  const maven = screen.getByRole('button', { name: /show testimonial from maven/i });
  const arrow = screen.getByRole('button', { name: /show testimonial from arrow/i });

  expect(maven).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Tori Bartlett')).toBeInTheDocument();

  fireEvent.click(arrow);
  expect(arrow).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Yash Joshi')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /next testimonial/i }));
  expect(screen.getByRole('button', { name: /show testimonial from teddy baldassarre/i })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Kendra Davey')).toBeInTheDocument();
});
