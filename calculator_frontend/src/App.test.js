import { render, screen } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
test('renders calculator display', () => {
  render(<App />);
  const display = screen.getByLabelText(/calculator display/i);
  expect(display).toBeInTheDocument();
});
