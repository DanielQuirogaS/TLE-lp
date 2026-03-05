document.addEventListener('DOMContentLoaded', function () {
    // Console log de verificación
    console.log("TLE Landing Page - Scripts cargados");

    // Inicialización del Carrusel de Servicios con Swiper.js
    const swiper = new Swiper('.servicesSwiper', {
        slidesPerView: 1, // Por defecto en móvil
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },
        on: {
            init: function () {
                updateDynamicStyling(this);
            },
            slideChangeTransitionStart: function () {
                updateDynamicStyling(this);
            }
        }
    });

    // Función para manejar el estilo del slide central (Activo)
    function updateDynamicStyling(swiperInstance) {
        // Remover clases color amarillo de todos los headers
        const allHeaders = document.querySelectorAll('.servicesSwiper .dynamic-bg');
        allHeaders.forEach(header => {
            header.classList.remove('bg-tle-primary');
            header.classList.add('bg-tle-white');
        });

        // Aplicar clase amarillo solo al header activo
        const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
        if (activeSlide) {
            const activeHeader = activeSlide.querySelector('.dynamic-bg');
            if (activeHeader) {
                activeHeader.classList.remove('bg-tle-white');
                activeHeader.classList.add('bg-tle-primary');
            }
        }
    }

    // Lógica de Validación del Formulario de Contacto
    const contactForm = document.getElementById('contactForm');
    const btnSubmit = document.getElementById('btnSubmit');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Check HTML5 validity
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            // Valid form
            contactForm.classList.add('was-validated');

            // Disable button to prevent multiple submissions
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> ENVIANDO...';

            // Simulación de envío (como no hay backend en esta prueba)
            setTimeout(() => {
                formMessage.classList.remove('d-none', 'alert-danger');
                formMessage.classList.add('alert-success');
                formMessage.textContent = '¡Gracias! Tu mensaje ha sido enviado exitosamente. Nos comunicaremos contigo pronto.';

                // Reset form state
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                btnSubmit.innerHTML = 'ENVIADO &#10003;';

                // Habilitar de nuevo tras unos segundos por si gustan enviar otro y resetear mensaje
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = 'ENVIAR';
                    formMessage.classList.add('d-none');
                }, 6000);

            }, 2000);
        });
    }
});
