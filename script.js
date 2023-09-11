const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

//INTERCAMBIO DE PANELES

const mostrarVista = (vistaAMostrar) => {
    $$('.vista').forEach((vista) => vista.classList.add('is-hidden'));
    $(`#${vistaAMostrar}`).classList.remove('is-hidden');
};

$('#boton-balance').addEventListener('click', () => mostrarVista('seccion-balance'));

$('#boton-categorias').addEventListener('click', () => mostrarVista('seccion-categorias'));

$('#boton-reportes').addEventListener('click', () => mostrarVista('seccion-reportes'));

$('#boton-nueva-operacion').addEventListener('click', () => mostrarVista('seccion-nueva-operacion'));

// MENU HAMBURGUESA DEL NAVBAR

$('.navbar-burger').addEventListener('click', () => {
    $('.navbar-burger').classList.toggle('is-active');
    $('.navbar-menu').classList.toggle('is-active');
    $('.navbar-menu').classList.toggle('has-background-primary');
    $('#botones-nav').classList.toggle('is-flex-direction-column');
    $('#botones-nav').classList.toggle('is-align-content-flex-start');
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        $('.navbar-burger').classList.remove('is-active');
        $('.navbar-menu').classList.remove('is-active');
        $('.navbar-menu').classList.remove('has-background-primary');
        $('#botones-nav').classList.remove('is-flex-direction-column');
        $('#botones-nav').classList.remove('is-align-content-flex-start');
    }
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

const subirDatos = (datos) => {
    localStorage.setItem("datos", JSON.stringify({ ...traerDatos(), ...datos }));
};

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
        select.innerHTML = "";
    for (let { nombre, id } of categories) {
        select.innerHTML += `<option value="${id}">${nombre}</option>`;
    }
    });
};

//NO SE DEBEN DEJAR FUNCIONES SUELTAS, REALIZAR FUNCION INICIALIZAR
llenarSelect(categorias);

const datos = traerDatos() || {
    categorias: [],
    operaciones: [],
};

//COMPLETA LA LISTA DE CATEGORIAS
const listaCategorias = (categorias) => {
    $("#categorias").innerHTML = "";
    for (let { nombre, id } of categorias) {
        $("#categorias").innerHTML += `<div class="mb-3">
        <div class="columns is-vcentered is-mobile">
            <div class="column">
                <span class="tag is-primary is-light">${nombre}</span>
            </div>
            <div class="column is-narrow has-text">
                <button onclick="showEditCategory('${id}')" id="${id}" class="button edit-btn is-small is-ghost">Editar</button>
                <button onclick="removeCategory('${id}')" id="${id}" class="button edit-btn is-small is-ghost">Eliminar</button>
            </div>
        </div>
    </div>`
    }
}

listaCategorias(categorias);

//DEVUELVE LA CATEGORIA CON EL MISMO ID 
const obtenerCategoria = (idCategoria, categorias) => {
    return categorias.find((categoria) => categoria.id === idCategoria);
};

//ABRE EL MODAL PARA EDITAR LA CATEGORIA, APARECE EL INPUT CON EL VALUE DE LA MISMA
const showEditCategory = (id) => {
    $("#vista-editar-categoria").classList.remove("is-hidden");
    $("#seccion-categorias").classList.toggle("is-hidden");
    let categoriaAEditar = obtenerCategoria(id, traerCategorias());
    $("#editar-categoria-input").value = categoriaAEditar.nombre;
    $("#editar-categoria-boton").addEventListener("click", () =>
    editCategory(categoriaAEditar.id)
    );
};

//CREA LA NUEVA CATEGORIA EDITADA CON EL MISMO ID
const editCategory = (id) => {
    let nuevaCategoria = {
        id: id,
        nombre: $("#editar-categoria-input").value,
    };
    let categoriasActualizadas = traerCategorias().map((categoria) =>
        categoria.id === id ? { ...nuevaCategoria } : categoria
    );
    actualizarCategorias(categoriasActualizadas);
};

// ACTUALIZA LA LISTA CON LAS CATEGORIAS
const actualizarCategorias = (categoriasActualizadas) => {
    listaCategorias(categoriasActualizadas);
    llenarSelect(categoriasActualizadas);
    subirDatos({ categorias: categoriasActualizadas });
}

// SE AGREGA LA NUEVA CATEGORIA
$("#agregar-categoria-boton").addEventListener("click", () => {
    let nuevaCategoria = {
                id: randomId(),
                nombre: $("#categoria-input").value,
            };
            let categoriasActualizadas = [...categorias, nuevaCategoria]; 
            actualizarCategorias(categoriasActualizadas);
});

// SE ELIMINA LA CATEGORIA
    const removeCategory = (id) => {
        let categoriasActualizadas = traerCategorias().filter((categoria) => categoria.id !== id);
        actualizarCategorias(categoriasActualizadas);
    }

// SECCION DE FILTROS ---------------------------

// Debemos crear una funcion por cada filtro
const filtrarPorTipo = (listaOperaciones, tipoOperacion) => {
    return listaOperaciones.filter((operacion) => operacion.tipo === tipoOperacion);
}

const filtrarPorCategoria = (operaciones, categoria) => {
    return operaciones.filter((operacion) => operacion.categoria === categoria);
}

$("#selector-tipo").addEventListener("change", () => aplicarFiltros);

const aplicarFiltros = () => {
    // Aca debemos llamar todas las funciones por tipo de filtro
    // Guardamos las operaciones que existan pero sin modificar el original
    let operacionesFiltradas = [...operaciones];
    let filtroTipo = $("#selector-tipo").value;
    let filtroCategoria = $("#categorias-select").value;

    operacionesFiltradas = filtrarPorTipo(operaciones, filtroTipo);
    operacionesFiltradas = filtrarPorCategoria(operaciones, filtroCategoria)

    // Suponiendo que tenemos una funcion que pinte todas las operaciones
    // De este forma solo pinta las operaciones que pasaron los filtros
    mostrarOperaciones(operacionesFiltradas);
}