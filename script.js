(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  const dialog = document.getElementById('image-dialog');
  let opener;
  document.querySelectorAll('.zoom-image').forEach(button => {
    button.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') {
        window.open(button.dataset.image, '_blank', 'noopener');
        return;
      }
      opener = button;
      const image = document.getElementById('dialog-image');
      image.src = button.dataset.image;
      image.alt = button.querySelector('img').alt;
      document.getElementById('dialog-title').textContent = button.dataset.title;
      document.getElementById('dialog-download').href = button.dataset.image;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (opener) opener.focus();
  });
})();
