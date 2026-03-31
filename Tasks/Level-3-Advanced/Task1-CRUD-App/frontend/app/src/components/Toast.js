import { useEffect, useState } from 'react';
import '../Toast.css';

const ICONS = { success: '✓', error: '⚠', warning: '!' };

export default function Toast({ msg, type = 'success', onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const hide = setTimeout(() => setLeaving(true), 2600);
    const remove = setTimeout(() => onDone?.(), 3000);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [onDone]);

  return (
    <div className={`toast toast-${type} ${leaving ? 'out' : ''}`}>
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-msg">{msg}</span>
    </div>
  );
}
