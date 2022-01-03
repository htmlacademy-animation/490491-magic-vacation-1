export default () => {
  const bodyEl = document.querySelector(`body`);
  window.onload = function () {
    bodyEl.classList.add(`page-load`);
  };
};
