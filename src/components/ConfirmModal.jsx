import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${styles.backdrop}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={`rounded-xl p-6 w-full max-w-sm mx-4 ${styles.modal}`}>
        <h2 className={`text-base font-semibold mb-2 ${styles.title}`}>
          {title}
        </h2>
        {message && (
          <p className={`text-sm mb-5 ${styles.message}`}>{message}</p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-md px-4 py-2 text-sm font-medium cursor-pointer ${styles.cancelBtn}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm font-medium cursor-pointer ${styles.confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
