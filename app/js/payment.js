let checkoutWidget = null;

const openPaymentModal = async (confirmation_token) => {
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
      closePaymentModal();
    });

    await checkout.render('payment-modal');
    console.log('Виджет оплаты успешно отображен');

    modalElement.classList.add('active');
    document.documentElement.classList.add('active');

    checkoutWidget = checkout;
  } catch (error) {
    console.error('Ошибка при отображении виджета оплаты:', error);
  }
};

const closePaymentModal = () => {
  const modalElement = document.getElementById('payment-modal');
  modalElement.classList.remove('active');
  document.documentElement.classList.remove('active');

  if (checkoutWidget) {
    setTimeout(() => {
      checkoutWidget.destroy();
      checkoutWidget = null;
    }, 400);
  }
};

document.getElementById('open-modal-button').addEventListener('click', async () => {
  try {
    const response = await fetch('php/payment/payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({amount: '1500.00', currency: 'RUB'}),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении данных о платеже');
    }

    const data = await response.json();
    console.log('Ответ сервера:', data);

    await openPaymentModal(data.confirmation_token);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePaymentModal();
  }
});

document.addEventListener('click', (event) => {
  const modalElement = document.getElementById('payment-modal');
  if (!modalElement.contains(event.target)) {
    closePaymentModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('payment-modal');
  const closeButton = modalElement.querySelector('.modal-payment__close');

  closeButton.addEventListener('click', () => {
    closePaymentModal();
  });
});