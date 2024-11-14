document.addEventListener('DOMContentLoaded', function () {
  const regionElement = document.getElementById('region');
  const regionSelect = new Choices(regionElement, {allowHTML: true});
  const errorTimers = {};
  const maxSize = 5048 * 1024 * 1024;
  const allowedTypes = [
    'video/mp4',       // MP4
    'video/webm',      // WebM
    'video/ogg',       // Ogg/Theora
    'video/quicktime', // QuickTime Movie (MOV)
    'video/x-msvideo', // AVI
    'video/x-ms-wmv',  // Windows Media Video (WMV)
    'video/x-flv',     // Flash Video (FLV)
    'video/3gpp',      // 3GP
    'video/x-matroska', // Matroska (MKV)
    'video/x-ms-asf',  // Advanced Systems Format (ASF)
    'video/x-mpeg',    // MPEG Video
    'video/x-mpeg2',   // MPEG-2 Video
  ];
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,4}$/;

  let selectedVideoFile = null;
  let lastUploadedFile = null;
  let checkoutWidget = null;
  let formSubmitting = false;

  function showError(element, show) {
    if (show) {
      element.style.display = 'block';
      if (errorTimers[element.id]) clearTimeout(errorTimers[element.id]);
      errorTimers[element.id] = setTimeout(() => {
        element.style.display = 'none';
        delete errorTimers[element.id];
      }, 4000);
    } else {
      element.style.display = 'none';
      if (errorTimers[element.id]) {
        clearTimeout(errorTimers[element.id]);
        delete errorTimers[element.id];
      }
    }
  }

  function showErrorPromo(messageElement, duration = 4000) {
    messageElement.classList.add('active');
    setTimeout(() => {
      messageElement.classList.remove('active');
    }, duration);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    const errorVideo = document.getElementById('errorVideo');
    const errorInvalidFileType = document.getElementById('errorInvalidFileType');
    const errorVideoRequired = document.getElementById('errorVideoRequired');
    const participationLoad = document.querySelector('.participation__load');
    const videoLoaded = document.getElementById('videoLoaded');

    showError(errorInvalidFileType, false);
    showError(errorVideoRequired, false);
    showError(errorVideo, false);
    participationLoad.classList.remove('error-load', 'error-load-file');
    participationLoad.classList.add('loading');

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      showError(errorInvalidFileType, true);
      participationLoad.classList.remove('loading');
      participationLoad.classList.add('error-load-file');
      selectedVideoFile = null;
      lastUploadedFile = null;
      videoLoaded.style.display = 'none';
    } else if (file.size > maxSize) {
      showError(errorVideo, true);
      participationLoad.classList.remove('loading');
      participationLoad.classList.add('error-load');
      selectedVideoFile = null;
      lastUploadedFile = null;
      videoLoaded.style.display = 'none';
    } else {
      showError(errorInvalidFileType, false);
      showError(errorVideoRequired, false);
      showError(errorVideo, false);

      if (lastUploadedFile && file.name === lastUploadedFile.name && file.size === lastUploadedFile.size) {
        showError(errorInvalidFileType, true);
        selectedVideoFile = null;
        lastUploadedFile = null;
        videoLoaded.style.display = 'none';
      } else {
        selectedVideoFile = file;
        lastUploadedFile = file;
        videoLoaded.style.display = 'flex';
      }
    }

    event.target.value = '';

    setTimeout(() => {
      participationLoad.classList.remove('error-load', 'error-load-file');
    }, 4000);
  }

  async function openPaymentModal(confirmation_token) {
    const modalElement = document.getElementById('payment-modal');

    if (checkoutWidget) {
      checkoutWidget.destroy();
      checkoutWidget = null;
    }

    try {
      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token,
        error_callback: (error) => {
          console.error('Ошибка виджета YooKassa:', error);
        }
      });

      checkout.on('complete', () => {
        console.log('Оплата завершена успешно');
        closePaymentModal(() => {
          setTimeout(submitForm, 400);
        });
      });

      await checkout.render('payment-modal');
      console.log('Виджет оплаты успешно отображен');

      modalElement.classList.add('active');
      document.documentElement.classList.add('active');

      checkoutWidget = checkout;
    } catch (error) {
      console.error('Ошибка при отображении виджета оплаты:', error);
    }
  }

  function closePaymentModal(callback) {
    const modalElement = document.getElementById('payment-modal');
    modalElement.classList.remove('active');
    document.documentElement.classList.remove('active');

    if (checkoutWidget) {
      setTimeout(() => {
        checkoutWidget.destroy();
        checkoutWidget = null;
        if (callback) callback();
      }, 400);
    } else if (callback) {
      callback();
    }
  }

  async function validateFormAndProceedToPayment() {
    const fields = {
      phone: document.getElementById('phone').value.trim(),
      messenger: document.getElementById('messenger').value.trim(),
      region: document.getElementById('region').value.trim(),
      fullName: document.getElementById('fullName').value.trim(),
      age: document.getElementById('age').value.trim(),
      address: document.getElementById('address').value.trim(),
      teacherFullName: document.getElementById('teacherFullName').value.trim(),
      teacherSchoolName: document.getElementById('teacherSchoolName').value.trim(),
      agreement: document.getElementById('agreement').checked,
    };

    const errors = {
      errorContact: !(fields.phone && fields.messenger),
      errorEmailInvalid: fields.messenger && !emailPattern.test(fields.messenger),
      errorPersonal: !(fields.fullName && fields.age && fields.address),
      errorAgeMin: fields.age && fields.age < 10,
      errorAgeMax: fields.age && fields.age > 70,
      errorTeacher: (fields.teacherFullName || fields.teacherSchoolName) && (!fields.teacherFullName || !fields.teacherSchoolName),
      errorRegion: !fields.region,
      errorVideoRequired: !selectedVideoFile,
    };

    Object.keys(errors).forEach(error => showError(document.getElementById(error), errors[error]));

    const agreementLabel = document.getElementById('agreementLabel');
    if (!fields.agreement) {
      agreementLabel.classList.add('error');
      setTimeout(() => agreementLabel.classList.remove('error'), 4000);
    }

    if (Object.values(errors).some(Boolean) || !fields.agreement) return;

    try {
      const promoInfo = localStorage.getItem('promoInfo');
      let promoData = {};
      if (promoInfo) {
        promoData = JSON.parse(promoInfo);
      }

      const formData = {
        ...fields,
        promo: promoData,
      };

      const response = await fetch('php/payment/payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при выполнении запроса');
      }

      const data = await response.json();
      console.log('Ответ сервера:', data);

      await openPaymentModal(data.confirmation_token);
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  }

  function submitForm() {
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn.disabled) {
      return;
    }

    const fields = {
      phone: document.getElementById('phone').value.trim(),
      messenger: document.getElementById('messenger').value.trim(),
      region: document.getElementById('region').value.trim(),
      fullName: document.getElementById('fullName').value.trim(),
      age: document.getElementById('age').value.trim(),
      address: document.getElementById('address').value.trim(),
      teacherFullName: document.getElementById('teacherFullName').value.trim(),
      teacherSchoolName: document.getElementById('teacherSchoolName').value.trim(),
      agreement: document.getElementById('agreement').checked,
    };

    const formData = new FormData();
    formData.append('contact[phone]', fields.phone);
    formData.append('contact[messenger]', fields.messenger);
    formData.append('contact[region]', fields.region);
    formData.append('personal[fullName]', fields.fullName);
    formData.append('personal[age]', fields.age);
    formData.append('personal[address]', fields.address);

    if (fields.teacherFullName || fields.teacherSchoolName) {
      formData.append('teacher[fullName]', fields.teacherFullName);
      formData.append('teacher[schoolName]', fields.teacherSchoolName);
    }

    const promoInfo = localStorage.getItem('promoInfo');
    if (promoInfo) {
      const promoData = JSON.parse(promoInfo);
      formData.append('promo_code', promoData.code);
    }

    if (selectedVideoFile) {
      formData.append('video', selectedVideoFile);
    }

    window.alert('Пожалуйста, не закрывайте страницу, пока данные отправляются. ' +
      'В противном случае ваша заявка не будет отправлена вместе с видео.');

    if (formSubmitting) {
      return;
    }

    formSubmitting = true;

    submitBtn.disabled = true;
    submitBtn.querySelector('.circular-loader').style.display = 'block';
    submitBtn.querySelector('span:first-of-type').style.display = 'none';
    submitBtn.querySelector('span:last-of-type').style.display = 'block';

    fetch('php/functions/process_form.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        showSuccessModal();
        resetForm();
      })
      .catch(error => {
        console.error('Error sending form data:', error);
        showError(document.getElementById('errorFormSubmit'), true);
      })
      .finally(() => {
        formSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('.circular-loader').style.display = 'none';
        submitBtn.querySelector('span:first-of-type').style.display = 'block';
        submitBtn.querySelector('span:last-of-type').style.display = 'none';
      });
  }

  function resetForm() {
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"]').forEach(input => input.value = '');
    regionSelect.setChoiceByValue('');

    const videoLoaded = document.getElementById('videoLoaded');
    if (videoLoaded) {
      videoLoaded.style.display = 'none';
    }

    const participationFileLoad = document.querySelector('.participation__file-load');
    if (participationFileLoad) {
      participationFileLoad.classList.remove('error-load-file');
    }

    const participationLoad = document.querySelector('.participation__load');
    if (participationLoad) {
      participationLoad.classList.remove('loading', 'error-load');
    }

    const agreementCheckbox = document.getElementById('agreement');
    if (agreementCheckbox) {
      agreementCheckbox.checked = false;
      const agreementLabel = document.getElementById('agreementLabel');
      if (agreementLabel) {
        agreementLabel.classList.remove('error');
      }
    }

    selectedVideoFile = null;
    lastUploadedFile = null;

    const promoActivated = document.getElementById('promoActivated');
    if (promoActivated) {
      promoActivated.classList.remove('active');
    }

    localStorage.removeItem('promoInfo');
  }

  function showSuccessModal() {
    const successModal = document.getElementById('payment-modal-success');
    successModal.classList.add('active');
    document.documentElement.classList.add('active');

    const closeSuccessModal = () => {
      successModal.classList.remove('active');
      document.documentElement.classList.remove('active');
    };

    document.getElementById('payment-modal-success-close').addEventListener('click', closeSuccessModal);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !formSubmitting) {
        closeSuccessModal();
      }
    });
    document.addEventListener('click', (event) => {
      if (!successModal.contains(event.target) && event.target !== successModal && !formSubmitting) {
        closeSuccessModal();
      }
    });
  }

  function handlePromoCode() {
    const promoCodeInput = document.getElementById('promo_code');
    const promoActivatedMessage = document.getElementById('promoActivated');
    const promoError = document.getElementById('promoError');
    const promoNotFoundMessage = document.getElementById('errorPromoNotFound');
    const maxActivationsReachedMessage = document.getElementById('errorMaxActivationsReached');
    const promoCheckButton = document.getElementById('promoCheckBtn');

    promoCodeInput.addEventListener('input', function () {
      promoCodeInput.value = promoCodeInput.value.toUpperCase();
    });

    promoCheckButton.addEventListener('click', async function () {
      const promoCode = promoCodeInput.value.trim();

      if (!promoCode) {
        showErrorPromo(promoError);
        return;
      }

      const requestData = JSON.stringify({promo_code: promoCode});

      try {
        const response = await fetch('php/payment/check_promo_code.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestData,
        });

        if (response.status === 404) {
          showErrorPromo(promoNotFoundMessage);
          promoActivatedMessage.classList.remove('active');
          maxActivationsReachedMessage.classList.remove('active');
          promoError.classList.remove('active');
          localStorage.removeItem('promoInfo');
          return;
        } else if (response.status === 409) {
          showErrorPromo(maxActivationsReachedMessage);
          promoActivatedMessage.classList.remove('active');
          promoNotFoundMessage.classList.remove('active');
          promoError.classList.remove('active');
          localStorage.removeItem('promoInfo');
          return;
        }

        if (!response.ok) {
          throw new Error('Ошибка при выполнении запроса');
        }

        const data = await response.json();

        if (data.status === 'success') {
          localStorage.setItem('promoInfo', JSON.stringify(data.promo));
          promoActivatedMessage.classList.add('active');
          promoError.classList.remove('active');
          promoNotFoundMessage.classList.remove('active');
          maxActivationsReachedMessage.classList.remove('active');
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    });
  }

  regionElement.addEventListener('change', event => showError(document.getElementById('errorRegion'), !event.target.value));
  document.getElementById('video').addEventListener('change', handleFileChange, {passive: true});
  document.getElementById('participationForm').addEventListener('submit', event => {
    event.preventDefault();
    validateFormAndProceedToPayment();
  });

  localStorage.removeItem('promoInfo');
  handlePromoCode();

  const paymentModal = document.getElementById('payment-modal');
  const paymentModalClose = document.getElementById('payment-modal-close');

  paymentModalClose.addEventListener('click', () => {
    closePaymentModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && paymentModal.classList.contains('active')) {
      closePaymentModal();
    }
  });

  document.addEventListener('click', (event) => {
    if (!paymentModal.contains(event.target) && event.target !== paymentModal && paymentModal.classList.contains('active')) {
      closePaymentModal();
    }
  });
});