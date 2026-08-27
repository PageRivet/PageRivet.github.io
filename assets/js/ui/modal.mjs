export function createModalController(modal, closeSelector, onOpen, onClose) {
  if (!modal) return null;
  const panel = modal.querySelector('[role="dialog"]');
  let previousFocus = null;

  function open() {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(function () {
      if (panel) panel.focus();
    });
    if (onOpen) onOpen();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (previousFocus && previousFocus.focus) previousFocus.focus();
    if (onClose) onClose();
  }

  modal.querySelectorAll(closeSelector).forEach(function (element) {
    element.addEventListener("click", close);
  });

  modal.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });

  return { open: open, close: close };
}
