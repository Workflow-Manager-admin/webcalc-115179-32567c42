import React, { useState, useRef, useEffect } from 'react';
import './App.css';

/**
 * Minimalistic Calculator App in React.
 * - Light theme, responsive UI.
 * - Keyboard and mouse support.
 * - Operations: +, -, ×, ÷, clear (C), reset (AC), equals (=).
 * - Uses custom color palette for accent and primary elements.
 */

// PUBLIC_INTERFACE
function App() {
  // States for display and logic
  const [display, setDisplay] = useState('0');
  const [accumulator, setAccumulator] = useState(null);
  const [pendingOp, setPendingOp] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const displayRef = useRef(null);

  // Color Palette (from props/theme)
  const COLORS = {
    primary: "#1976D2",
    secondary: "#424242",
    accent: "#FFEB3B",
    white: "#fff",
    lightbg: "#f5f7fa"
  };

  // Calculator buttons definition (label, value, type, custom color)
  const buttons = [
    { label: 'AC', value: 'AC', type: 'reset', color: COLORS.secondary },
    { label: 'C', value: 'C', type: 'clear', color: COLORS.secondary },
    { label: '÷', value: '/', type: 'operator', color: COLORS.primary },
    { label: '×', value: '*', type: 'operator', color: COLORS.primary },
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    { label: '-', value: '-', type: 'operator', color: COLORS.primary },
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    { label: '+', value: '+', type: 'operator', color: COLORS.primary },
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    { label: '=', value: '=', type: 'equal', color: COLORS.accent },
    { label: '0', value: '0', type: 'digit', classes: 'zero-btn' },
    { label: '.', value: '.', type: 'dot' }
  ];

  // PUBLIC_INTERFACE
  function handleButtonClick(val) {
    if (val.match(/^[0-9]$/)) handleDigit(val);
    else if (val === '.') handleDot();
    else if (['+', '-', '*', '/'].includes(val)) handleOperator(val);
    else if (val === '=') handleEqual();
    else if (val === 'AC') handleAllClear();
    else if (val === 'C') handleClear();
  }

  // PUBLIC_INTERFACE
  function handleDigit(digit) {
    if (display.length >= 12) return;
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(prev => (prev === '0' ? digit : prev + digit));
    }
  }

  // PUBLIC_INTERFACE
  function handleDot() {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  }

  // PUBLIC_INTERFACE
  function handleOperator(op) {
    if (pendingOp && !waitingForOperand) {
      const result = calculate(accumulator, pendingOp, parseFloat(display));
      setAccumulator(result);
      setDisplay(String(trimFloat(result)));
    } else {
      setAccumulator(parseFloat(display));
    }
    setPendingOp(op);
    setWaitingForOperand(true);
  }

  // PUBLIC_INTERFACE
  function handleEqual() {
    if (pendingOp && accumulator != null && !waitingForOperand) {
      const result = calculate(accumulator, pendingOp, parseFloat(display));
      setDisplay(String(trimFloat(result)));
      setAccumulator(null);
      setPendingOp(null);
      setWaitingForOperand(true);
    }
  }

  // PUBLIC_INTERFACE
  function handleAllClear() {
    setDisplay('0');
    setAccumulator(null);
    setPendingOp(null);
    setWaitingForOperand(false);
  }

  // PUBLIC_INTERFACE
  function handleClear() {
    setDisplay('0');
  }

  // Evaluate using the operation
  function calculate(a, op, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) return 'Err';
        return a / b;
      default: return b;
    }
  }

  // Limit float length for display
  function trimFloat(val) {
    if (typeof val !== 'number') return val;
    if (Number.isInteger(val)) return val;
    return parseFloat(val.toFixed(7)).toString();
  }

  // Keyboard support
  useEffect(() => {
    // PUBLIC_INTERFACE
    function handleKey(e) {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleDot();
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEqual();
        e.preventDefault();
      } else if (e.key.toLowerCase() === 'a') {
        // AC shortcut: 'A'
        handleAllClear();
      } else if (e.key.toLowerCase() === 'c' || e.key === 'Backspace') {
        handleClear();
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [display, pendingOp, accumulator, waitingForOperand]);

  // Focus display (for accessibility)
  useEffect(() => {
    if (displayRef.current) displayRef.current.focus();
  }, []);

  return (
    <div className="calc-app" style={{ background: COLORS.lightbg, minHeight: "100vh" }}>
      <main className="calc-container">
        <div
          className="calc-display"
          tabIndex={0}
          ref={displayRef}
          aria-label="Calculator display"
        >
          {display}
        </div>
        <div className="calc-buttons">
          {buttons.map((btn, idx) => (
            <button
              key={btn.label + idx}
              className={`calc-btn ${btn.classes || ''} ${btn.type === 'operator' ? 'op' : ''}`}
              style={{
                background: btn.color ? btn.color : COLORS.white,
                color: [COLORS.primary, COLORS.secondary].includes(btn.color) ? COLORS.white : COLORS.primary,
                border:
                  btn.type === "equal"
                    ? `2px solid ${COLORS.accent}`
                    : '1.5px solid #ececec',
                fontWeight: btn.type === "equal" ? 700 : 500,
                boxShadow: btn.type === "equal" ? `0 2px 6px ${COLORS.accent}55` : 'none',
                gridColumn: btn.classes === "zero-btn" ? "span 2" : undefined
              }}
              onClick={() => handleButtonClick(btn.value)}
              aria-label={btn.label}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <footer className="calc-footer">
          <span>Minimal React Calculator - Light Theme</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
