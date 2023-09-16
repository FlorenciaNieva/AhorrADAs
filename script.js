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
        filtros.classList.add('is-hidden')
        } else {
        toggle.innerText = 'Ocultar filtros'
        filtros.classList.remove('is-hidden')
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

const llenarSelect = (categories) => {
    $$(".categorias-select").forEach((select) => {
        select.innerHTML = "";
    for (let { nombre, id } of categories) {
        select.innerHTML += `<option value="${id}">${nombre}</option>`;
    }
    });
};

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

//DEVUELVE LA CATEGORIA CON EL MISMO ID 
const obtenerCategoria = (idCategoria, categorias) => {
    return categorias.find((categoria) => categoria.id === idCategoria);
};

//ABRE EL MODAL PARA EDITAR LA CATEGORIA, APARECE EL INPUT CON EL VALUE DE LA MISMA
const showEditCategory = (id) => {
    mostrarVista('vista-editar-categoria')
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
    mostrarVista('seccion-categorias')
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

//AGREGAR NUEVA OPERACIÓN 

const traerOperaciones = () => {
    return traerDatos()?.operaciones;
}

const operaciones = traerOperaciones() || [];

$('#agregar-operacion-boton').addEventListener('click', () => {
    let nuevaOperacion = {
        id: randomId(),
        descripcion: $('#descripcion-operacion').value,
        monto: $('#monto-input').value,
        tipo: $('#tipo-operacion').value,
        categoria: $("#nueva-operacion-categorias-select").value,
        fecha: $('#fecha-input-operacion').value,
    }
    subirDatos ( {operaciones: [...operaciones, nuevaOperacion]} );
    completarOperaciones([...operaciones, nuevaOperacion]);
    mostrarVista('seccion-balance');
});

$('#cancelar-agregar-operacion-boton').addEventListener('click', () => {
    mostrarVista('seccion-balance');
    $('#descripcion-operacion').value = '';
    $('#monto-input').value = '0';
    $('#tipo-operacion').selectedIndex = 0;
    $('#nueva-operacion-categorias-select').selectedIndex = 0;
    $('#fecha-input-operacion').value = '';
})

const completarOperaciones = (operaciones) => {
    $('#operaciones').innerHTML = "";
    for (let operacion of operaciones) {
        const categoria = obtenerCategoria(operacion.categoria, traerCategorias()).nombre;
        const fecha = new Date(operacion.fecha);
        $('#operaciones').innerHTML += `
            <div class="column is-3-tablet is-6-mobile">
                <h4 class="has-text-weight-semibold">${operacion.descripcion}</h4>
            </div>
            <div class="column is-3-tablet is-6-mobile has-text-right-mobile"> 
                <span class="tag is-primary is-light">${categoria}</span>
            </div>
            <div class="column is-2-tablet is-hidden-mobile">
                <h4 class="is-6 has-text-grey has-text-right-tablet">${fecha.getDate() + 1}/${fecha.getMonth() + 1}/${fecha.getFullYear()}</h4>
            </div>
            <div class="column is-2-tablet is-6-mobile is-size-4-mobile">
                <h4 class="has-text-weight-bold has-text-right-tablet ${operacion.tipo === 'GANANCIA' ? 'has-text-success' : 'has-text-danger'}" id="monto-operacion">${operacion.tipo === 'GANANCIA' ? '+' : '-'}$${operacion.monto}</h4>
            </div>
            <div class="column is-2-tablet is-6-mobile has-text-right">
                <p class="is-fullwidth">
                    <a href="#" class="edit-link is-size-7 mr-3">Editar</a>
                    <a href="#" class="delete-link is-size-7">Eliminar</b>
                </p>
            </div>
        `;
    } 
}

// VISTA OPERACIONES CON O SIN OPERACIONES
const vistaOperaciones = () => {
    if (traerDatos()?.operaciones.length > 0) {
        $('#con-operacion').classList.remove('is-hidden');
        $('#sin-operacion').classList.add('is-hidden');
        return;
    } else {
        $('#con-operacion').classList.add('is-hidden');
        $('#sin-operacion').classList.remove('is-hidden');
    }
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
    let filtroCategoria = $("#filtro-categorias-select").value;

    operacionesFiltradas = filtrarPorTipo(operaciones, filtroTipo);
    operacionesFiltradas = filtrarPorCategoria(operaciones, filtroCategoria)

    // Suponiendo que tenemos una funcion que pinte todas las operaciones
    // De este forma solo pinta las operaciones que pasaron los filtros
    mostrarOperaciones(operacionesFiltradas);
}

// ACTUALIZACIÓN DE FECHA
const fechaActualizada = () => {
    const inputsFecha = $$('input[type="date"]');
    inputsFecha.forEach((input) => {
        input.valueAsDate = new Date();
    });
}
fechaActualizada();

// INICIALIZACIÓN
const inicializarPagina = () => {
    if (!traerCategorias() || traerCategorias().length === 0) {
        return subirDatos({ categorias });
    }
    llenarSelect(categorias);
    listaCategorias(categorias);
    completarOperaciones(operaciones);
    vistaOperaciones();
}

window.addEventListener('load', inicializarPagina);