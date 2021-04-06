let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

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

    // Muestra el resumen de la cita o un mensaje de error si no pasa la validación
    mostrarResumen();

    // Almacena el nombre del cliente en el objeto cita
    nombreCita();

    // Almacena la fecha de la cita en el objeto cita
    fechaCita();

    // Deshabilitar días anteriores al día actual
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto cita
    horaCita();
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

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const objetoServicio = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(objetoServicio);

        agregarServicio(objetoServicio);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(objeto) {
    const { servicios } = cita;
    cita.servicios = [...servicios, objeto];
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

        // El cliente ha completado todos los pasos
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // limpiar HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validar objeto
    if (Object.values(cita).includes('')) {
        const noValida = document.createElement('P');
        noValida.textContent = 'Faltan datos de servicios, fecha, hora o nombre';

        noValida.classList.add('invalida-cita');

        // Añadir el resumen al div
        resumenDiv.appendChild(noValida);

        return;
    }

    // Show summary
    const citaHeading = document.createElement('H3');
    citaHeading.textContent = 'Resumen de la cita';

    const nombreCita = document.createElement('P')
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P')
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P')
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const serviciosHeading = document.createElement('H3');
    serviciosHeading.textContent = 'Servicios solicitados';
    serviciosCita.appendChild(serviciosHeading);

    let cantidad = 0;

    // Iterate on the array of services
    servicios.forEach(servicio => {
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const servicioTexto = document.createElement('P');
        servicioTexto.textContent = servicio.nombre;

        const servicioPrecio = document.createElement('P');
        servicioPrecio.textContent = servicio.precio;
        servicioPrecio.classList.add('precio');

        const totalServicios = servicio.precio.split('€');
        cantidad += parseInt(totalServicios[0]);

        // Añadir nombre y precio al div
        contenedorServicio.appendChild(servicioTexto);
        contenedorServicio.appendChild(servicioPrecio);

        serviciosCita.appendChild(contenedorServicio);
    });

    resumenDiv.appendChild(citaHeading);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const total = document.createElement('P');
    total.classList.add('total');
    total.innerHTML = `<span>Total a pagar:</span> ${cantidad}€`;

    resumenDiv.appendChild(total);
}

function nombreCita() {
    const inputNombre = document.querySelector('#nombre');

    inputNombre.addEventListener('input', e => {
        const nombre = e.target.value.trim();

        // Validar que el nombre del cliente no esté vacío
        if (nombre === '' || nombre.length < 3) {
            mostrarAlerta('Nombre no válido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');

            if (alerta) {
                alerta.remove();
            }

            cita.nombre = nombre;
        }
    });
}

function fechaCita() {
    const inputFecha = document.querySelector('#fecha');

    inputFecha.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0, 6].includes(dia)) {
            e.preventDefault();
            inputFecha.value = '';
            mostrarAlerta('Sábado o domingo no son días válidos para la cita', 'error');
        } else {
            cita.fecha = inputFecha.value;
        }
    });
}

function horaCita() {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 9 || hora[0] >= 18) {
            mostrarAlerta('Hora no válida para la cita. Las horas de cita son de 9:00 a 18:00', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta previa, no crear otra
    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta')

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar en HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaActual = new Date();
    const anio = fechaActual.getUTCFullYear();
    const mes = fechaActual.getMonth() + 1;
    const dia = fechaActual.getDate();

    // Formato AAAA-MM-DD
    const deshabilitaFecha = `${anio}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;

    inputFecha.min = deshabilitaFecha;
}
