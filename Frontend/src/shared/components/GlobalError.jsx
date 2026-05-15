import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../state/errorSlice';

const GlobalError = () => {
  const message = useSelector((state) => state.error.message);
  const dispatch = useDispatch();

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm shadow-lg"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => dispatch(clearError())}
        className="text-red-300/80 hover:text-white transition-colors"
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
};

export default GlobalError;
