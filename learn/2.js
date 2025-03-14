const showRipple = (event) => {
    const btn = event.currentTarget;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (btn.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (btn.offsetTop + radius)}px`;
    circle.classList.add('ripple');

    btn.appendChild(circle);
    setTimeout(() => {
      btn.removeChild(circle);
    }, 1000); /* 记得移除元素 */
  };

  [...document.querySelectorAll('.ripple')].forEach((btn) => {
    btn.addEventListener('click', showRipple);
  });