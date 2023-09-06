const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

$('#boton-balance').addEventListener('click', () => {
    $('#seccion-balance').classList.remove('is-hidden');
    $('#seccion-categorias').classList.add('is-hidden');
    $('#seccion-reportes').classList.add('is-hidden');
    $('#seccion-nueva-operacion').classList.add('is-hidden');
});

$('#boton-categorias').addEventListener('click', () => {
    $('#seccion-categorias').classList.remove('is-hidden');
    $('#seccion-balance').classList.add('is-hidden');
    $('#seccion-reportes').classList.add('is-hidden');
    $('#seccion-nueva-operacion').classList.add('is-hidden');
});

$('#boton-reportes').addEventListener('click', () => {
    $('#seccion-reportes').classList.remove('is-hidden');
    $('#sin-reportes').classList.remove('is-hidden');
    $('#seccion-categorias').classList.add('is-hidden');
    $('#seccion-balance').classList.add('is-hidden');
    $('#seccion-nueva-operacion').classList.add('is-hidden');
});

// boton para ocultar o mostrar los filtros 

$('#toggle-filtros').addEventListener('click', () => {
    const toggle = $('#toggle-filtros')
    const filtros = $('#container-filtros')

        if (toggle.innerText === 'Ocultar filtros') {
            toggle.innerText = 'Mostrar filtros'
            filtros.classList.toggle('is-hidden');
        } else {
            toggle.innerText = 'Ocultar filtros'
            filtros.classList.toggle('is-hidden');
        }
});

// INPUT SELECT

const traerDatos = () => {
    return JSON.parse(localStorage.getItem("datos")); //retorna lo que encuentre bajo esa key y lo convierte en objeto
};

// const subirDatos = (datos) => {
//     localStorage.setItem("datos", JSON.stringify({ ...traerDatos(), ...datos }));
// };

const traerCategorias = () => {
    return traerDatos()?.categorias; // trae lo que encuentre en el localStorage
};

const randomId = () => self.crypto.randomUUID();

let categorias = traerCategorias() || [ 
    { id: randomId(), nombre: "comida", }, 
    { id: randomId(), nombre: "servicios", },
    { id: randomId(), nombre: "salidas", },
    { id: randomId(), nombre: "transporte", },
    { id: randomId(), nombre: "educacion", },
    { id: randomId(), nombre: "trabajo", },
];

console.log(categorias);


const llenarSelect = (categories) => {
    $$(".categorias-select").forEach((select) => {
    for (let { nombre, id } of categories) {
        select.innerHTML += `<option value="${id}">${nombre}</option>`;
    }
    });
};

llenarSelect(categorias);



