export function modalJury() {
  const html = document.documentElement;
  const body = document.body;
  const juryButtons = document.querySelectorAll('[data-btn-jury]');
  const modals = document.querySelectorAll('.modal-jury');
  const modalCloseButtons = document.querySelectorAll('.modal-jury__close');
  let lastFocusedElement;

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      body.classList.add('active');
      html.classList.add('active');
      lastFocusedElement = document.activeElement;
      modal.setAttribute('tabindex', '-1');
      modal.focus();

      const focusableElements = modal.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]'
      );

      const socials = modal.querySelector('.modal-jury__socials');
      const closeButton = modal.querySelector('.modal-jury__close');

      const orderedFocusableElements = [
        ...socials.querySelectorAll('a'),
        ...Array.from(focusableElements).filter(el => el !== closeButton),
        closeButton
      ];

      let firstElement = orderedFocusableElements[0];
      let lastElement = orderedFocusableElements[orderedFocusableElements.length - 1];

      modal.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    }
  }

  function closeModal() {
    modals.forEach(modal => {
      modal.classList.remove('active');
      modal.removeAttribute('tabindex');
    });
    body.classList.remove('active');
    html.classList.remove('active');
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  juryButtons.forEach(button => {
    button.addEventListener('click', function () {
      const juryId = this.getAttribute('data-btn-jury');
      const modal = document.querySelector(`[data-modal-jury="${juryId}"]`);
      openModal(modal);
    });
  });

  modalCloseButtons.forEach(button => {
    button.addEventListener('click', function () {
      closeModal();
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}