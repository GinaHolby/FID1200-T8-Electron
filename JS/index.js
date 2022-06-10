const track = document.querySelector('.carusel__track')
const slides = Array.from(track.children)

const nextButton = document.querySelector('.carusel__button-next')
const prevButton = document.querySelector('.carusel__button-previous')


const slideWidth = slides[0].getBoundingClientRect().width


// arrange the slides next to one another
slides.forEach((slide, index)=>{
    slide.style.left = slideWidth * index + 'px'
})


const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')'
    currentSlide.classList.remove('current-slide')
    targetSlide.classList.add('current-slide')
   

}

// when i click left, move slides to the left

prevButton.addEventListener('click', e =>{
    const currentSlide = track.querySelector('.current-slide')
    const prevSlide = currentSlide.previousElementSibling
    
    moveToSlide(track, currentSlide, prevSlide)  

})

// when  click right, move slides to the righnt

nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide')
    const nextSlide = currentSlide.nextElementSibling
  

    moveToSlide (track, currentSlide, nextSlide)
    
})

// when I click the nav indicators, move to that slide 





















       