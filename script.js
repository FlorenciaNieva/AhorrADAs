const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const randomId = () => self.crypto.randomUUID();

// INTERCAMBIO DE VISTA
const mostrarVista = (vistaAMostrar) => {
    $$('.vista').forEach((vista) => vista.classList.add('is-hidden'));
    $(`#${vistaAMostrar}`).classList.remove('is-hidden');
};

$('#boton-balance').addEventListener('click', () => mostrarVista('seccion-balance'));

$('#boton-categorias').addEventListener('click', () => mostrarVista('seccion-categorias'));

$('#boton-reportes').addEventListener('click', () => mostrarVista('seccion-reportes'));

$('#boton-nueva-operacion').addEventListener('click', () => mostrarVista('seccion-nueva-operacion'));

// MENU HAMBURGUESA DEL NAVBAR
const toggleMenuHamburguesa = () => {
    $('.navbar-burger').classList.toggle('is-active');
    $('.navbar-menu').classList.toggle('is-active');
    $('.navbar-menu').classList.toggle('has-background-primary');
    $('#botones-nav').classList.toggle('is-flex-direction-column');
    $('#botones-nav').classList.toggle('is-align-content-flex-start');
}

$('.navbar-burger').addEventListener('click', () => toggleMenuHamburguesa());

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        $('.navbar-burger').classList.remove('is-active');
        $('.navbar-menu').classList.remove('is-active');
        $('.navbar-menu').classList.remove('has-background-primary');
        $('#botones-nav').classList.remove('is-flex-direction-column');
        $('#botones-nav').classList.remove('is-align-content-flex-start');
    }
});

// OCULTAR O MOSTRAR FILTROS
const toggleFiltros = () => {
    const toggle = $('#toggle-filtros')
    const filtros = $('#container-filtros')

    if (toggle.innerText === 'Ocultar filtros') {
        toggle.innerText = 'Mostrar filtros'
        filtros.classList.add('is-hidden')
    } else {
        toggle.innerText = 'Ocultar filtros'
        filtros.classList.remove('is-hidden')
    }
}

$('#toggle-filtros').addEventListener('click', () => toggleFiltros());

// LOCAL STORAGE -------------------------------

const traerDatos = () => {
    return JSON.parse(localStorage.getItem("datos")); //retorna lo que encuentre bajo esa key y lo convierte en objeto
};

const subirDatos = (datos) => {
    localStorage.setItem("datos", JSON.stringify({ ...traerDatos(), ...datos }));
};

const traerOperaciones = () => {
    return traerDatos()?.operaciones;
}

let operaciones = traerOperaciones() || [];

const traerCategorias = () => {
    return traerDatos()?.categorias; // trae lo que encuentre en el localStorage
};

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
        if (select.classList.contains("todos-filtros")) {
            select.innerHTML += `<option>Todas</option>`;
        }
        for (let { nombre, id } of categories) {
            select.innerHTML += `<option value="${id}">${nombre}</option>`;
        }
    });
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
    let categoriasActualizadas = traerCategorias().map((categoria) => categoria.id === id ? { ...nuevaCategoria } : categoria);
    subirDatos({categorias: categoriasActualizadas})
    actualizarVistas(traerDatos());
    mostrarVista('seccion-categorias')
};

//BOTON PARA CANCELAR EDITAR CATEGORIAS
$("#cancelar-categoria-boton").addEventListener(`click`, () => {
    mostrarVista('seccion-categorias')
})

// ACTUALIZA LA LISTA CON LAS CATEGORIAS
const actualizarVistas = (datos) => {
    listaCategorias(datos.categorias);
    llenarSelect(datos.categorias);
    // completarOperaciones(datos.operaciones);
}

// SE AGREGA LA NUEVA CATEGORIA
const agregarCategoria = () => {
    let nuevaCategoria = {
        id: randomId(),
        nombre: $("#categoria-input").value,
    };
    let categoriasActualizadas = [...categorias, nuevaCategoria];
    subirDatos({categorias: categoriasActualizadas})
    actualizarVistas(traerDatos());
    $("#categoria-input").value = "";
}

$("#agregar-categoria-boton").addEventListener("click", () => agregarCategoria());

// SE ELIMINA LA CATEGORIA
const removeCategory = (id) => {
    let categoriasActualizadas = traerCategorias().filter((categoria) => categoria.id !== id);
    subirDatos({categorias: categoriasActualizadas})
    actualizarVistas(traerDatos());
    // eliminar todas las operaciones relacionadas con la categoria eliminada
    let operacionesActualizadas = operaciones.filter((operacion) => operacion.categoria != id);
    operaciones = operacionesActualizadas;
    subirDatos({ operaciones: operacionesActualizadas });
    completarOperaciones(operacionesActualizadas);
}

//SECCIÓN OPERACIONES --------------------------

// REESTABLECER LOS INPUTS DE OPERACIÓN
const reestablecerOperacion = () => {
    $('#descripcion-operacion').value = '';
    $('#monto-input').value = 0;
    $('#tipo-operacion').selectedIndex = 0;
    $('#nueva-operacion-categorias-select').selectedIndex = 0;
    $('#fecha-input-operacion').valueAsDate = new Date();
}

// AGREGAR NUEVA OPERACIÓN
const agregraOperacion = () => {
    let nuevaOperacion = {
        id: randomId(),
        descripcion: $('#descripcion-operacion').value,
        monto: Number($('#monto-input').value),
        tipo: $('#tipo-operacion').value,
        categoria: $("#nueva-operacion-categorias-select").value,
        fecha: $('#fecha-input-operacion').value,
    }
    operaciones.push(nuevaOperacion)
    subirDatos ({ operaciones });
    completarOperaciones( operaciones );
    mostrarVista('seccion-balance');
    actualizarBalance(traerOperaciones());
    reestablecerOperacion();
}

$('#agregar-operacion-boton').addEventListener('click', () => agregraOperacion());

// BOTÓN DE CANCELAR NUEVA OPERACIÓN
$('#cancelar-agregar-operacion-boton').addEventListener('click', () => {
    mostrarVista('seccion-balance');
    reestablecerOperacion();
})

// COMPLETA LAS OPERACIONES EN EL APARTADO CON-OPERACIONES
const completarOperaciones = (operaciones) => {
    $('#operaciones').innerHTML = "";
    for (let operacion of operaciones) {
        const categoria = obtenerCategoria(operacion.categoria, traerCategorias()).nombre;
        const fecha = new Date(operacion.fecha + 'T00:00:00-03:00');
        $('#operaciones').innerHTML += `
            <div class="column is-3-tablet is-6-mobile">
                <h4 class="has-text-weight-semibold">${operacion.descripcion}</h4>
            </div>
            <div class="column is-3-tablet is-6-mobile has-text-right-mobile"> 
                <span class="tag is-primary is-light">${categoria}</span>
            </div>
            <div class="column is-2-tablet is-hidden-mobile">
                <h4 class="is-6 has-text-grey has-text-right-tablet">${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}</h4>
            </div>
            <div class="column is-2-tablet is-6-mobile is-size-4-mobile">
                <h4 class="has-text-weight-bold has-text-right-tablet ${operacion.tipo === 'GANANCIA' ? 'has-text-success' : 'has-text-danger'}" id="monto-operacion">${operacion.tipo === 'GANANCIA' ? '+' : '-'}$${operacion.monto}</h4>
            </div>
            <div class="column is-2-tablet is-6-mobile has-text-right">
                <p class="is-fullwidth">
                    <a href="#" onclick="cargarDatosOperacion('${operacion.id}')" class="edit-link is-size-7 mr-3" id="${operacion.id}">Editar</a>
                    <a href="#" onclick="eliminarOperacion('${operacion.id}')" class="delete-link is-size-7" id="${operacion.id}">Eliminar</a>
                </p>
            </div>
        `;
    } 
    vistaOperaciones();
}

// INTERCAMBIA LA VISTA CON O SIN OPERACIONES DEPENDIENDO SI HAY O NO OPERACIONES GUARDADAS
const vistaOperaciones = () => {
    if (operaciones?.length > 0) {
        $('#con-operacion').classList.remove('is-hidden');
        $('#sin-operacion').classList.add('is-hidden');
        return;
    } else {
        $('#con-operacion').classList.add('is-hidden');
        $('#sin-operacion').classList.remove('is-hidden');
    }
}

// DEVUELVE LA OPERACIÓN QUE TENGA EL MISMO ID 
const obtenerOperacion = (idOperacion, operaciones) => {
    return operaciones.find((operacion) => operacion.id === idOperacion);
};

// SE ENCARGA DE EDITAR LA OPERACIÓN QUE COINCIDA CON EL ID DADO
const editarOperacionElegida = (idOperacion, operacionNueva, operaciones) => {
    return operaciones.map((operacion) => operacion.id === idOperacion ? { id: operacion.id, ...operacionNueva } : operacion)
};

// BUSCA LOS NUEVOS VALORES DADOS AL EDITAR LA OPERACIÓN Y LOS ACTUALIZA
const editarOperacion = (id) => {
    const descripcion = $('#editar-descripcion-operacion').value;
    const monto = Number($('#editar-monto-input').value);
    const categoria = $('#editar-categorias-select').value;
    const tipo = $('#editar-tipo-operacion').value;
    const fecha = $('#editar-fecha-operacion').value;

    const operacionesActualizadas = editarOperacionElegida(
        id,
        {
        descripcion,
        monto,
        categoria,
        tipo,
        fecha,
        },
        operaciones,
    )
    operaciones = operacionesActualizadas;
    completarOperaciones(operacionesActualizadas);
    subirDatos({ operaciones: operacionesActualizadas });
    actualizarBalance(traerOperaciones());
};

// PASA LOS VALORES DE LA OPERACIÓN A LOS CAMPOS DE LA SECCIÓN EDITAR OPERACIÓN
const cargarDatosOperacion = (id) => {
    mostrarVista('vista-editar-operaciones');
    const operacion = obtenerOperacion(id, traerOperaciones());
    $('#editar-descripcion-operacion').value = operacion.descripcion;
    $('#editar-monto-input').value = operacion.monto;
    $('#editar-tipo-operacion').value = operacion.tipo;
    $('#editar-categorias-select').value = operacion.categoria;
    $('#editar-fecha-operacion').value = operacion.fecha;
    $("#boton-editar-operacion").onclick = () => {
        editarOperacion(id);
        mostrarVista('seccion-balance');
    };
};

// BOTÓN DE CANCELAR EDITAR OPERACIÓN
$('#boton-cancelar-editar-operacion').addEventListener('click', () => {
    mostrarVista('seccion-balance');
});  

//ELIMINAR OPERACIONES
const eliminarOperacion = (idOperacion) => {
    const operacionesActualizadas = operaciones.filter((operacion) => operacion.id !== idOperacion);
    operaciones = operacionesActualizadas;
    subirDatos({ operaciones: operacionesActualizadas });
    completarOperaciones(operacionesActualizadas);
    actualizarBalance(traerOperaciones());
}

// SECCION DE FILTROS
// -------------------------- SELECT ORDENAR POR TIPO --------------------------
const filtrarPorTipo = (tipo, operaciones) => {
    return operaciones.filter((operacion) => operacion.tipo === tipo);
}
// -------------------------- SELECT ORDENAR POR CATEGORIA --------------------------
const filtrarPorCategoria = (idCategoria, operaciones) => {
    return operaciones.filter((operacion) => operacion.categoria === idCategoria);
}
// -------------------------- SELECT ORDENAR DESDE --------------------------
const filtrarPorFechaMayorOIgualA = (fecha, operaciones) => {
    return operaciones.filter((operacion) => {
        const fechaOperacion = new Date(operacion.fecha)
        return fechaOperacion.getTime() >= fecha.getTime()
    })
}
// -------------------------- SELECT ORDENAR POR --------------------------
//FECHA
const ordernarPorFecha = (operaciones, orden) => {
    return [...operaciones].sort((a, b) => {
        const fechaA = new Date(a.fecha)
        const fechaB = new Date(b.fecha)
        return orden === 'ASC'? fechaA.getTime() - fechaB.getTime() : fechaB.getTime() - fechaA.getTime();
    })
}
//MONTO
const ordernarPorMonto = (operaciones, orden) => {
    return [...operaciones].sort((a, b) => {
        return orden === 'ASC' ? a.monto - b.monto : b.monto - a.monto;
    })
}
//DESCRIPCION
const ordernarPorDescripcion = (operaciones, orden) => {
    return [...operaciones].sort((a, b) => {
        const descripcionA = a.descripcion.toLowerCase();
        const descripcionB = b.descripcion.toLowerCase();

        if (orden === 'ASC') {
            return descripcionA.localeCompare(descripcionB);
        } else if (orden === 'DESC') {
            return descripcionB.localeCompare(descripcionA);
        }
        return 0;
    });
};

$("#filtro-categorias-select").addEventListener(`change`, () => filtrarOperaciones());
$("#selector-tipo").addEventListener(`change`, () => filtrarOperaciones());
$("#input-fecha").addEventListener(`change`, () => filtrarOperaciones());
$("#selector-ordenar").addEventListener(`change`, () => filtrarOperaciones());

const filtrarOperaciones = () => {
    const tipo = $('#selector-tipo').value;
    const categoria = $('#filtro-categorias-select').value;
    const fecha = new Date($('#input-fecha').value.replace(/-/g, '/'));
    const orden = $('#selector-ordenar').value;

    let operacionesFiltradas = [...operaciones];

    if (tipo !== 'TODOS') {
        operacionesFiltradas = filtrarPorTipo(tipo, operacionesFiltradas);
        console.log(operacionesFiltradas, `1`);
    }

    if (categoria !== 'Todas') {
        operacionesFiltradas = filtrarPorCategoria(categoria, operacionesFiltradas);
        console.log(operacionesFiltradas, `2`);
    }

    operacionesFiltradas = filtrarPorFechaMayorOIgualA(fecha, operacionesFiltradas)

    switch (orden) {
        case 'MAS-RECIENTES':
            operacionesFiltradas = ordernarPorFecha(operacionesFiltradas, 'DESC')
            break
        case 'MENOS-RECIENTES':
            operacionesFiltradas = ordernarPorFecha(operacionesFiltradas, 'ASC')
            break
        case 'MAYOR-MONTO':
            operacionesFiltradas = ordernarPorMonto(operacionesFiltradas, 'DESC')
            break
        case 'MENOR-MONTO':
            operacionesFiltradas = ordernarPorMonto(operacionesFiltradas, 'ASC')
            break
        case 'A/Z':
            operacionesFiltradas = ordernarPorDescripcion(operacionesFiltradas, 'ASC')
            break
        case 'Z/A':
            operacionesFiltradas = ordernarPorDescripcion(operacionesFiltradas, 'DESC')
            break
        default:
    }

    completarOperaciones(operacionesFiltradas);
}

// SECCIÓN BALANCE ------------------------------

// CALCULA EL TOTAL DE LAS GANANCIAS, LOS GASTOS Y EL BALANCE
const obtenerBalance = (operaciones) => {
    const balanceInicial = { ganancias: 0, gastos: 0, balance: 0, };
    const resultado = operaciones.reduce((balance, operacion) => {
        if (operacion.tipo === 'GANANCIA') {
            balance.ganancias += Number(operacion.monto);
        } else if (operacion.tipo === 'GASTO') {
            balance.gastos += Number(operacion.monto);
        }
        balance.balance = balance.ganancias - balance.gastos;
        return balance;
    }, balanceInicial);
    return resultado;
}

// ACTUALIZA LOS VALORES DE LA SECCIÓN BALANCE 
const actualizarBalance = (operaciones) => {
    const { ganancias, gastos, balance } = obtenerBalance(operaciones);
    $('#ganancias').textContent = `+$${Math.abs(ganancias)}`;
    $('#gastos').textContent = `-$${Math.abs(gastos)}`;
    $('#balance').classList.remove('has-text-danger', 'has-text-success');
    let operador = '';
    if (balance > 0) {
        $('#balance').classList.add('has-text-success');
        operador = '+';
    } else if (balance < 0) {
        $('#balance').classList.add('has-text-danger');
        operador = '-';
    }
    $('#balance').textContent = `${operador}$${Math.abs(balance)}`;
}

// ACTUALIZACIÓN DE FECHA
const fechaActualizada = () => {
    const inputsFecha = $$('input[type="date"]');
    inputsFecha.forEach((input) => {
        input.valueAsDate = new Date();
    });
}

// INICIALIZACIÓN
const inicializarPagina = () => {
    fechaActualizada();
    llenarSelect(categorias);
    listaCategorias(categorias);
    completarOperaciones(operaciones);
    actualizarBalance(traerOperaciones());
}

if (!traerCategorias() || traerCategorias().length === 0) {
    subirDatos({ categorias });
}

window.addEventListener('load', inicializarPagina);