import { integration } from './media-config.js';

export function validateContact(value) {
  const contact = String(value || '').trim();
  if (!contact) return 'Укажите телефон или e-mail';
  if (contact.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) ? '' : 'Проверьте e-mail: например, name@company.ru';
  const digits = contact.replace(/\D/g, '');
  return /^[+\d\s().-]+$/.test(contact) && digits.length >= 10 && digits.length <= 15 ? '' : 'Укажите телефон с кодом города или страны либо e-mail';
}

export function validateAttachment(file, maxBytes = integration.maxFileBytes) {
  if (!file || !file.name) return '';
  if (file.size > maxBytes) return 'Файл больше 10 МБ. Уменьшите размер или отправьте документ по e-mail';
  if (!/\.(pdf|docx?|xlsx?|txt|jpe?g|png)$/i.test(file.name)) return 'Выберите PDF, DOC(X), XLS(X), TXT, JPG или PNG';
  if (file.size === 0) return 'Файл пуст. Выберите другой документ';
  return '';
}

export function validateInquiry(values) {
  const errors = {};
  if (!String(values.name || '').trim()) errors.name = 'Укажите ваше имя';
  const contactError = validateContact(values.contact);
  if (contactError) errors.contact = contactError;
  if (!values.consent) errors.consent = 'Подтвердите согласие на обработку персональных данных';
  const attachmentError = validateAttachment(values.attachment);
  if (attachmentError) errors.attachment = attachmentError;
  return errors;
}

export function initializeForm() {
  const form = document.querySelector('#request-form');
  const status = document.querySelector('#form-status');
  const fileInput = form.elements.attachment;
  const fileLabel = document.querySelector('#file-label');
  const removeFile = document.querySelector('.file-remove');
  const submitButton = form.querySelector('[type="submit"]');
  const errorIds = { name:'name-error', contact:'contact-error', consent:'consent-error', attachment:'file-error' };
  let pending = false;

  const showError = (name, message = '') => {
    document.getElementById(errorIds[name]).textContent = message;
    if (message) form.elements[name].setAttribute('aria-invalid', 'true');
    else form.elements[name].removeAttribute('aria-invalid');
  };

  const updateFile = () => {
    const file = fileInput.files[0];
    fileLabel.textContent = file ? file.name : 'Прикрепить ТЗ или документ';
    removeFile.hidden = !file;
    showError('attachment', validateAttachment(file));
  };
  fileInput.addEventListener('change', updateFile);
  removeFile.addEventListener('click', () => { fileInput.value = ''; updateFile(); fileInput.focus(); });

  for (const name of ['name', 'contact', 'consent']) {
    form.elements[name].addEventListener(name === 'consent' ? 'change' : 'input', () => {
      if (form.elements[name].getAttribute('aria-invalid')) showError(name);
      if (!pending) status.textContent = '';
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    const errors = validateInquiry({
      name:form.elements.name.value, contact:form.elements.contact.value,
      consent:form.elements.consent.checked, attachment:fileInput.files[0],
    });
    for (const name of Object.keys(errorIds)) showError(name, errors[name]);
    if (Object.keys(errors).length) {
      status.textContent = 'Проверьте отмеченные поля. Запрос ещё не отправлен';
      status.dataset.state = 'error';
      form.elements[Object.keys(errors)[0]].focus();
      return;
    }

    if (!integration.requestEndpoint) {
      status.replaceChildren();
      status.append('Данные проверены. Отправка через сайт пока не подключена — запрос не отправлен. Свяжитесь с отделом продаж: ');
      const email = document.createElement('a');
      email.href = 'mailto:sales@volgakraski.ru';
      email.textContent = 'sales@volgakraski.ru';
      status.append(email, '. Документ можно приложить к письму');
      status.dataset.state = 'unconnected';
      status.focus({preventScroll:true});
      return;
    }

    pending = true;
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    status.textContent = 'Отправляем запрос…';
    status.dataset.state = 'pending';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const data = new FormData(form);
      data.set('name', form.elements.name.value.trim());
      data.set('contact', form.elements.contact.value.trim());
      data.set('consent', 'true');
      if (!fileInput.files.length) data.delete('attachment');
      if (integration.csrfToken) data.set('csrfToken', integration.csrfToken);
      const response = await fetch(integration.requestEndpoint, { method:'POST', body:data, credentials:'same-origin', signal:controller.signal });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Request was not accepted');
      status.textContent = 'Спасибо! Ваш запрос отправлен. Мы свяжемся с вами для уточнения деталей';
      status.dataset.state = 'success';
      form.reset();
      const contextMessage=document.querySelector('#inquiry-context');
      if(contextMessage)contextMessage.hidden=true;
      updateFile();
    } catch {
      status.textContent = 'Не удалось отправить запрос. Данные сохранены в форме. Попробуйте ещё раз или обратитесь в отдел продаж по телефону или e-mail';
      status.dataset.state = 'error';
    } finally {
      clearTimeout(timeout);
      pending = false;
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      status.focus({preventScroll:true});
    }
  });
  submitButton.disabled = false;
}
