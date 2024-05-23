function nextContent(currentTarget) {
    const slide = currentTarget.closest(".slide");
    const contents = slide.querySelectorAll('.content');
    if (contents.length == 1) {
        return;
    }

    let active = 0;
    for (let i = 0; i < contents.length; i++) {
        if (contents[i].classList.contains('desacative')) {
            contents[i].classList.remove('desacative');
        }

        if (contents[i].classList.contains('active')) {
            active = i;
            contents[i].classList.remove('active');
            contents[i].classList.add('desacative');
        }
    }

    active++;
    if (active == contents.length) {
        active = 0;
    }

    setTimeout(() => {
        contents[active].classList.add('active');
    }, 500);
}

function projectManager() {

    const projects = document.getElementById("project-show");

    const arrows = projects.querySelectorAll('.loop-arrow');
    for (const arrow of arrows) {
        arrow.addEventListener('click', (event) => {
            nextContent(event.currentTarget);
        });
        arrow.parentElement.children[0].classList.add('active');
    }
}

projectManager();