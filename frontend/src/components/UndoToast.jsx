export function UndoToast({ label, onUndo }) {
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-stone-800 text-white text-sm px-4 py-3 rounded-xl shadow-lg">
        <span className="text-stone-300">"{label}" deleted</span>
        <button
          onClick={onUndo}
          className="font-semibold text-white underline decoration-stone-500 hover:decoration-white transition-colors"
        >
          Undo
        </button>
      </div>
    </div>
  )
}
