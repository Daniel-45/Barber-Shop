let pagina = 1;

document.addEventListener('DOMContentLoaded', function () {
    iniciar();
});

function iniciar() {
    mostrarServicios();

     // Resaltar div en función del tab que se hace click
     mostrarSeccion();

     // Oculta o muestra la sección en función del tab que se hace click
     cambiarSeccion();
 
     // Paginación
     paginaSiguiente();
 
     paginaAnterior();
 
     // Comprueba la pagina actual para ocultar o mostrar los botones
     botonesPaginador();
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;
        
        // Generar HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            // Generar nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar precio del servicio
            const precioServicio = document.createElement('p');
            precioServicio.textContent = `${precio}€`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor del servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio pàra la cita
            servicioDiv.onclick = seleccionarServicio;

            // Insertar nombre y precio al div del servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Insertar en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;

    // Forzar que el elemento al hacer click sea el div
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
    
    console.log(elemento);
}

function mostrarSeccion() {

    // Eliminar la clase mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }


    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs button.actual');

    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        });
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}