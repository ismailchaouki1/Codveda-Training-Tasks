import { useState } from 'react';
import './Calculator.css';
function Calculator() {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    setInput(input + value);
  };

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };

  const clear = () => {
    setInput('');
  };

  return (
    <div className="calculator">
      <input type="text" value={input} readOnly className="display" />

      <div className="buttons">
        {['7', '8', '9', '/'].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>
            {btn}
          </button>
        ))}

        {['4', '5', '6', '*'].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>
            {btn}
          </button>
        ))}

        {['1', '2', '3', '-'].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>
            {btn}
          </button>
        ))}

        {['0', '.', '+', '='].map((btn) => (
          <button
            key={btn}
            className={btn === '=' ? 'equal' : ''}
            onClick={() => (btn === '=' ? calculate() : handleClick(btn))}
          >
            {btn}
          </button>
        ))}

        <button className="clear" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default Calculator;
