export function copyUrlToClipboard(event) {
  event.preventDefault();
  const url = window.location.origin + window.location.pathname;
  const tooltipButton = event.target;
  const tooltipId = tooltipButton.getAttribute('data-tooltip');
  const copyTooltip = document.querySelector(`.tooltip__copy[data-tooltip="${tooltipId}"]`);

  navigator.clipboard.writeText(url).then(function () {
    if (copyTooltip) {
      copyTooltip.classList.add('active');
      setTimeout(function () {
        copyTooltip.classList.remove('active');
      }, 2000);
    }
  }).catch(function (error) {
    console.error('Ошибка копирования URL: ', error);
  });
}

export function bindShareLinks() {
  const shareLinks = document.querySelectorAll('.tooltip');
  shareLinks.forEach((shareLink) => {
    shareLink.addEventListener('click', copyUrlToClipboard);
  });
}