document.addEventListener('DOMContentLoaded', function () {
  const regionElement = document.getElementById('region');
  const regionSelect = new Choices(regionElement, {allowHTML: true});
  const errorTimers = {};
  const maxSize = 100 * 1024 * 1024;
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,4}$/;

  let selectedVideoFile = null;
  let lastUploadedFile = null;

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

  function validateForm() {
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
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.querySelector('.circular-loader').style.display = 'block';
    submitBtn.querySelector('span:first-of-type').style.display = 'none';
    submitBtn.querySelector('span:last-of-type').style.display = 'block';

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

    if (selectedVideoFile) formData.append('video', selectedVideoFile);

    fetch('php/functions/process_form.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        resetForm();
      })
      .catch(error => {
        console.error('Error sending form data:', error);
        showError(document.getElementById('errorFormSubmit'), true);
      })
      .finally(() => {
        submitBtn.querySelector('.circular-loader').style.display = 'none';
        submitBtn.querySelector('span:first-of-type').style.display = 'block';
        submitBtn.querySelector('span:last-of-type').style.display = 'none';
      });
  }

  function resetForm() {
    document.getElementById('participationForm').reset();
    regionSelect.clearStore();
    document.querySelectorAll('.error').forEach(element => element.style.display = 'none');
    document.getElementById('agreement').checked = true;
    document.getElementById('agreementLabel').classList.remove('error');
    selectedVideoFile = null;
    lastUploadedFile = null;
  }

  regionElement.addEventListener('change', event => showError(document.getElementById('errorRegion'), !event.target.value));
  document.getElementById('video').addEventListener('change', handleFileChange);
  document.getElementById('participationForm').addEventListener('submit', event => {
    event.preventDefault();
    validateForm();
  });
});