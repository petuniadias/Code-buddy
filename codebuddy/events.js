const slideShowConf = {
    "visible": 2,
    "offset": 60 // =60px best with 40 ;-)
}

let savedPosition = 0;

function showSlide(element, position) {

    if (element.classList.contains('visible')) {
        return;
    }

    const slides = element.parentNode.querySelectorAll('.slide');
    for (const slide of slides) {
        slide.classList.remove('visible');
    }

    if (position < savedPosition) {
        position += (slideShowConf['visible'] - 1);
    }

    // add class visible to slides in viewport
    for (let i = 1; i <= slideShowConf['visible']; i++) {
        slides[position-i].classList.add('visible');
    }

    const margin = (() => {
        if (position > slideShowConf['visible']) {
            const currentWidth = parseInt(element.parentNode.style.width, 10);
            return (((currentWidth / slides.length) * (position - slideShowConf['visible'])) - slideShowConf['offset']) * -1;
        }
        return slideShowConf['offset'];
    })();

    element.parentNode.style.marginLeft = `${margin}px`;
    element.parentNode.style.transition = "all 1s ease-in-out";

    savedPosition = position;
}

function slideShowManager(resize = false) {

    if (slideShowConf['visible'] === 0) {
        console.error('At least 1 slides are required!');
        return;
    }

    savedPosition = 0;

    const viewportWidth = window.innerWidth;
    const slideshow = document.getElementById("slideshow-container");

    const rows = slideshow.querySelectorAll('.row');
    for (const row of rows) {
        const slides = row.querySelectorAll('.slide');
        if (slides.length < slideShowConf['visible']) {
            console.error(`At least ${slideShowConf['visible']} slides are required!`);
            break;
        }

        // total width of row with n visible slides without scroll
        const innerRowWidth = (((document.body.clientWidth - slideShowConf['offset'] * 2) / slideShowConf['visible']) * slides.length);
        row.style.width = `${innerRowWidth}px`;
        row.style.marginLeft = `${slideShowConf['offset']}px`;

        let count = 1;
        for (const slide of slides) {
            if (!resize) {
                slide.addEventListener('click', (event) => {
                    const position = parseInt(event.currentTarget.dataset.id, 10);
                    showSlide(event.currentTarget, position);
                });
            }

            if (count <= slideShowConf['visible']) {
                slide.classList.add('visible');
            } else {
                slide.classList.remove('visible');
            }
            count++;
        }
    }
}

window.addEventListener("resize", (event) => {
    slideShowManager(true);
});

slideShowManager();