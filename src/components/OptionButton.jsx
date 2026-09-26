// state: 'idle' | 'correct' | 'wrong' | 'muted'
function getClassName(state) {
  if (state === 'correct') return 'btn btn-success';
  if (state === 'wrong') return 'btn btn-danger';
  if (state === 'muted') return 'btn btn-outline-secondary opacity-50';
  return 'btn btn-outline-secondary';
}

export default function OptionButton({ label, state, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`${getClassName(state)} text-start`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
