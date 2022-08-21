const startBtn = document.querySelector('.start__app-btn');
const body = document.querySelector('body');
const container = document.querySelector('.landing__page-container');


startBtn.addEventListener('click', function(){
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  overlay.addEventListener('animationend', function(){
    window.location.href = './app/app.html';
  })

  body.insertBefore(overlay, container);
})

