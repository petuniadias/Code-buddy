//
// Slideshow de projectos
// Petúnia Dias
//

function nextCardContent(currentTarget) {
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

    // setTimeout(() => {
    //     contents[active].classList.add('active');
    // }, 0);
    contents[active].classList.add('active');
}

function buttonLoop() {

    const arrow = document.createElement("span");
    arrow.classList.add("loop-arrow");

    arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">' +
        '<path fill="white" d="M12.089 3.634A2 2 0 0 0 11 5.414L10.999 8H6a1 1 0 0 0-1 1v6l.007.117A1 1 0 0 0 6 16l4.999-.001l.001 2.587A2 2 0 0 0 14.414 20L21 13.414a2 2 0 0 0 0-2.828L14.414 4a2 2 0 0 0-2.18-.434zM3 8a1 1 0 0 1 .993.883L4 9v6a1 1 0 0 1-1.993.117L2 15V9a1 1 0 0 1 1-1"></path>' +
        '</svg>';

    arrow.addEventListener('click', (event) => {
        nextCardContent(event.currentTarget);
    });

    return arrow;
}


function createCard(cartao) {
    const link = document.createElement("a");
    link.setAttribute("href", cartao.link);
    link.classList.add("content");
    link.setAttribute("target", "_blank");

    const div = document.createElement("div");
    div.classList.add("project");
    const h1 = document.createElement("h1");
    const span = document.createElement("span");
    span.textContent = cartao.tipo;
    h1.appendChild(span);
    div.appendChild(h1);

    const p = document.createElement("p");
    let list = [];
    if (cartao.autor !== "") {
        list.push(cartao.autor);
    }
    list.push(cartao.projecto);
    p.textContent = list.join(' - ');
    div.appendChild(p);

    if (cartao.media.hasOwnProperty("img")) {
        const img = document.createElement("img");
        img.setAttribute("src", cartao.media.img);
        img.setAttribute("alt", cartao.media.alt);
        div.appendChild(img);
    } else if (cartao.media.hasOwnProperty("video")) {

        const iframe = document.createElement("iframe");
        iframe.classList.add("video-project");
        iframe.id = "ytplayer";
        iframe.type = "text/html";
        iframe.width = "720";
        iframe.height = "405";
        iframe.src = cartao.media.video;
        iframe.setAttribute("frameborder", "0")
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        iframe.setAttribute("allowfullscreen", "");

        div.appendChild(iframe);
    }

    link.appendChild(div);

    return link;
}

async function projectSlideShow(data) {
    const response = await fetch("/codebuddy/data/projectos.json");
    const projectos = await response.json();
    console.log(projectos);

    const base = document.getElementById("projectos");
    const projectsList = document.createElement("ul");
    projectsList.id = "project-show";

    for (const projecto of projectos) {
        console.log(projecto);

        const slide = document.createElement("li");
        slide.classList.add("slide");
        if (projecto.tema === "dark") {
            slide.classList.add("dark");
        }

        for (const cartao of projecto.cartoes) {
            const link = createCard(cartao);
            slide.appendChild(link);
        }

        const arrow = buttonLoop();
        slide.children[0].classList.add('active');
        slide.appendChild(arrow);

        projectsList.appendChild(slide);
    }

    base.appendChild(projectsList);
}

projectSlideShow();