import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
test('renders calculator display', () => {
  render(<App />);
  const display = screen.getByLabelText(/calculator display/i);
  expect(display).toBeInTheDocument();
});

// PUBLIC_INTERFACE
test('performs addition correctly', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '3' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('5');
});

// PUBLIC_INTERFACE
test('performs subtraction correctly', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '9' }));
  fireEvent.click(screen.getByRole('button', { name: '-' }));
  fireEvent.click(screen.getByRole('button', { name: '6' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('3');
});

// PUBLIC_INTERFACE
test('performs multiplication correctly', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '7' }));
  fireEvent.click(screen.getByRole('button', { name: '×' }));
  fireEvent.click(screen.getByRole('button', { name: '8' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('56');
});

// PUBLIC_INTERFACE
test('performs division correctly', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '8' }));
  fireEvent.click(screen.getByRole('button', { name: '÷' }));
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('4');
});

// PUBLIC_INTERFACE
test('shows error on division by zero', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '÷' }));
  fireEvent.click(screen.getByRole('button', { name: '0' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent(/Err/i);
});

// PUBLIC_INTERFACE
test('clear (C) button only clears display, not state', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '8' }));
  fireEvent.click(screen.getByRole('button', { name: '-' }));
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: 'C' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('0');
  // State should still have '8 -', so 8 - 3 should be 5
  fireEvent.click(screen.getByRole('button', { name: '3' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('5');
});

// PUBLIC_INTERFACE
test('reset (AC) button resets all state', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '4' }));
  fireEvent.click(screen.getByRole('button', { name: '×' }));
  fireEvent.click(screen.getByRole('button', { name: '7' }));
  fireEvent.click(screen.getByRole('button', { name: 'AC' }));
  // After AC, starting new calculation
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('4');
});

// PUBLIC_INTERFACE
test('handles decimal point and floating operations correctly', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '.' }));
  fireEvent.click(screen.getByRole('button', { name: '5' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '3' }));
  fireEvent.click(screen.getByRole('button', { name: '.' }));
  fireEvent.click(screen.getByRole('button', { name: '7' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('6.2');
});

// PUBLIC_INTERFACE
test('prevents multiple dots in a number', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '1' }));
  fireEvent.click(screen.getByRole('button', { name: '.' }));
  fireEvent.click(screen.getByRole('button', { name: '.' }));
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('1.2');
});

// PUBLIC_INTERFACE
test('keyboard support for calculation and clear/reset', () => {
  render(<App />);
  const display = screen.getByLabelText(/calculator display/i);

  // 5 + 2 = (using keyboard)
  fireEvent.keyDown(window, { key: '5' });
  fireEvent.keyDown(window, { key: '+' });
  fireEvent.keyDown(window, { key: '2' });
  fireEvent.keyDown(window, { key: '=' });
  expect(display).toHaveTextContent('7');

  // Clear display with keyboard "C"
  fireEvent.keyDown(window, { key: 'c' });
  expect(display).toHaveTextContent('0');

  // AC shortcut with keyboard "a"
  fireEvent.keyDown(window, { key: 'a' });
  expect(display).toHaveTextContent('0');

  // Subtraction 9-2= (test Enter key)
  fireEvent.keyDown(window, { key: '9' });
  fireEvent.keyDown(window, { key: '-' });
  fireEvent.keyDown(window, { key: '2' });
  fireEvent.keyDown(window, { key: 'Enter' });
  expect(display).toHaveTextContent('7');
});

// PUBLIC_INTERFACE
test('multiple operations in sequence', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '1' }));
  fireEvent.click(screen.getByRole('button', { name: '0' }));
  fireEvent.click(screen.getByRole('button', { name: '÷' }));
  fireEvent.click(screen.getByRole('button', { name: '2' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '7' }));
  fireEvent.click(screen.getByRole('button', { name: '=' }));
  expect(screen.getByLabelText(/calculator display/i)).toHaveTextContent('12');
});

// PUBLIC_INTERFACE
test('display does not exceed 12 characters', () => {
  render(<App />);
  // Enter a very long number
  for (let i=0; i<14; ++i) {
    fireEvent.click(screen.getByRole('button', { name: '9' }));
  }
  // Only first 12 digits allowed
  expect(screen.getByLabelText(/calculator display/i).textContent.length).toBeLessThanOrEqual(12);
});
