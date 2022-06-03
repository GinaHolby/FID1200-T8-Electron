const track = document.querySelector('.carusel__track')
const slides = Array.from(track.children)

const nextButton = document.querySelector('.carusel__button-next')
const prevButton = document.querySelector('.carusel__button-previous')
const dotsNav = document.querySelector('.carusel__nav')
const dots = Array.from(dotsNav.children)

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

const changeDot = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide')
    targetDot.classList.add('current-slide')
}

// when i click left, move slides to the left


// TODO hehehe

prevButton.addEventListener('click', e =>{
    const currentSlide = track.querySelector('.current-slide')
    const prevSlide = currentSlide.previousElementSibling
    
    const currentDot = dotsNav.querySelector('.current-slide')
    const targetDot = currentDot.previousElementSibling

    moveToSlide(track, currentSlide, prevSlide)
    changeDot(currentDot,targetDot)

})

// when  click right, move slides to the righnt

nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide')
    const nextSlide = currentSlide.nextElementSibling
    const currentDot = dotsNav.querySelector('.current-slide')
    const targetDot = currentDot.nextElementSibling

    moveToSlide (track, currentSlide, nextSlide)
    changeDot(currentDot, targetDot)
})

// when I click the nav indicators, move to that slide 

dotsNav.addEventListener('click', e =>{
    const targetDot = e.target.closest('button')

    if(!targetDot) return

    const currentSlide = track.querySelector('.current-slide')
    const currentDot = dotsNav.querySelector('.current-slide')
    const taregtIndex = dots.findIndex(dot => dot === targetDot)
    const targetSlide = slides[taregtIndex]

    moveToSlide (track, currentSlide, targetSlide)
    changeDot(currentDot,targetDot)

    

})