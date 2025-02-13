document.querySelector('.price__form').addEventListener('submit', function (event) {
  const phone = document.getElementById('phone').value.trim();
  const fullName = document.getElementById('fullName').value.trim();
  const errorFields = document.getElementById('errorFields');
  const submitButton = document.querySelector('.price__btn');

  if (!phone || !fullName) {
    errorFields.classList.add('active');
    submitButton.classList.add('disabled');
    submitButton.setAttribute('tabindex', '-1');
    event.preventDefault();

    setTimeout(() => {
      errorFields.classList.remove('active');
      submitButton.classList.remove('disabled');
      submitButton.removeAttribute('tabindex');
    }, 3000);
  } else {
    errorFields.classList.remove('active');
  }
});