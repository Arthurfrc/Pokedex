const botaoChangeTheme = document.getElementById('button-change-theme')

const body = document.querySelector('body')
const imageButtonChangeTheme = document.querySelector('.image-button')

botaoChangeTheme.addEventListener('click', () => {
  const darkMode = body.classList.contains('dark-mode')

  body.classList.toggle('dark-mode')
  if (darkMode) {
    body.classList.remove('dark-mode')
    imageButtonChangeTheme.setAttribute('src', './images/sun.png')
  } else {
    body.classList.add('dark-mode')
    imageButtonChangeTheme.setAttribute('src', './images/moon.png')
  }
})
