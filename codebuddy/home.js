document.addEventListener("DOMContentLoaded", function() {
    const accordionBtns = document.querySelectorAll(".accordion_btn"); 
    const contents = document.querySelectorAll(".content"); 

    const openPopupBtn = document.getElementById('openPopup');
    const closePopupBtn = document.getElementById('closePopup');
    const loginPopup = document.getElementById('loginPopup');



                               //ACCORDIAN  
    accordionBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            // Fecha todos os conteúdos abertos
            contents.forEach(content => {
                content.classList.remove("active");
                content.style.display = "none";
                content.querySelector(".close_btn").style.display = "none";
            });
    
            // Abre o conteúdo correspondente ao botão clicado
            const content = this.nextElementSibling;
            content.classList.add("active");
            content.style.display = "block";
            content.querySelector(".close_btn").style.display = "block";
        });
    });
    
    const closeBtns = document.querySelectorAll(".close_btn");
    closeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const content = this.parentNode;
            content.style.display = "none";
            content.classList.remove("active");
            this.style.display = "none";
        });
    });
                               
    // LOGIN POPUP 
    openPopupBtn.addEventListener('click', function() {
        loginPopup.style.display = 'block';
    });

    // Close popup when the close button is clicked
    closePopupBtn.addEventListener('click', function() {
        loginPopup.style.display = 'none';
    });

    // Close popup when clicking outside 
    window.addEventListener('click', function(event) {
        if (event.target == loginPopup) {
            loginPopup.style.display = 'none';
        }
    });
}); 


