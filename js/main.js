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

    // Inicialización del Carrusel de Reconocimientos con Swiper.js
    const reconocimientosSwiper = new Swiper('.reconocimientosSwiper', {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 30,
        rewind: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.reconocimientos-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.reconocimientos-next',
            prevEl: '.reconocimientos-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 50,
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
    const formLoadTime = Date.now();

    if (contactForm) {
        function simulateSuccess() {
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje Enviado!',
                text: 'Gracias por comunicarte con nosotros. Un agente te contactará a la brevedad.',
                confirmButtonColor: '#000000',
                confirmButtonText: 'Aceptar'
            });
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'ENVIAR';
        }

        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Check HTML5 validity
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            // Anti-Spam: Verificar campo honeypot
            const honeypot = document.getElementById('bot_field');
            if (honeypot && honeypot.value !== '') {
                // Es probable que sea un bot, simulamos éxito sin enviar petición
                return simulateSuccess();
            }

            // Anti-Spam: Verificar tiempo de llenado (menor a 3 segundos es sospechoso)
            const timeToFill = Date.now() - formLoadTime;
            if (timeToFill < 3000) {
                return simulateSuccess();
            }

            // Anti-Spam: Límite de envíos con LocalStorage (1 envío cada 10 minutos)
            const lastSubmit = localStorage.getItem('tle_lastFormSubmit');
            if (lastSubmit) {
                const timePassed = Date.now() - parseInt(lastSubmit);
                if (timePassed < 10 * 60 * 1000) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Espera un momento',
                        text: 'Ya hemos recibido un mensaje tuyo recientemente. Por favor intenta de nuevo más tarde.',
                        confirmButtonColor: '#000000',
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }
            }

            // Valid form
            contactForm.classList.add('was-validated');

            // Disable button to prevent multiple submissions
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> ENVIANDO...';

            const urlParams = new URLSearchParams(window.location.search);

            const payload = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                mensaje: document.getElementById('mensaje').value,
                utm_source: urlParams.get('utm_source') || '',
                utm_medium: urlParams.get('utm_medium') || '',
                utm_campaign: urlParams.get('utm_campaign') || '',
                utm_term: urlParams.get('utm_term') || '',
                utm_content: urlParams.get('utm_content') || '',
                utm_id: urlParams.get('utm_id') || '',
                origen: window.location.href
            };

            try {
                const response = await fetch('https://n8n.ongoing.mx/webhook/f242ff51-4431-42cd-b41e-d7eb18fa6924', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Guardar timestamp de envío exitoso
                    localStorage.setItem('tle_lastFormSubmit', Date.now().toString());
                    simulateSuccess();
                } else {
                    throw new Error('Respuesta del servidor no exitosa');
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.',
                    confirmButtonColor: '#000000',
                    confirmButtonText: 'Aceptar'
                });
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'ENVIAR';
            }
        });
    }
});
