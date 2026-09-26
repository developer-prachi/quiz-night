// state: 'idle' | 'correct' | 'wrong' | 'muted'
function getClassName(state) {
  if (state === 'correct') return 'option-btn option-btn--correct';
  if (state === 'wrong') return 'option-btn option-btn--wrong';
  if (state === 'muted') return 'option-btn option-btn--muted';
  return 'option-btn';
}

export default function OptionButton({ marker, label, state, onClick, disabled }) {
  return (
    <button type="button" className={getClassName(state)} onClick={onClick} disabled={disabled}>
      <span className="option-btn__marker" aria-hidden="true">{marker}</span>
      <span>{label}</span>
    </button>
  );
}
