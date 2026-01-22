export default function ContextMenu({ x, y, options, onClose }) {
  return (
    <div
      style={{ top: y, left: x }}
      className="fixed z-50 w-44 bg-white dark:bg-gray-800
                 border dark:border-gray-700 rounded shadow-lg"
      onMouseLeave={onClose}
    >
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => {
            opt.onClick();
            onClose();
          }}
          className="block w-full text-left px-4 py-2 text-sm
                     hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
