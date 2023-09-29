const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const randomId = () => self.crypto.randomUUID();

// INTERCAMBIO DE VISTA
const mostrarVista = (vistaAMostrar) => {
    $$('.vista').forEach((vista) => vista.classList.add('is-hidden'));
    $(`#${vistaAMostrar}`).classList.remove('is-hidden');
};

// MENU HAMBURGUESA DEL NAVBAR
const toggleMenuHamburguesa = () => {
    $('.navbar-burger').classList.toggle('is-active');
    $('.navbar-menu').classList.toggle('is-active');
    $('.navbar-menu').classList.toggle('has-background-primary');
    $('#botones-nav').classList.toggle('is-flex-direction-column');
    $('#botones-nav').classList.toggle('is-align-content-flex-start');
}

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

// ACTUALIZACIÓN DE FECHA
const fechaActualizada = () => {
    const inputsFecha = $$('input[type="date"]');
    inputsFecha.forEach((input) => {
        input.valueAsDate = new Date();
    });
}

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
    let categoriasActualizadas = [...traerCategorias(), nuevaCategoria];
    subirDatos({categorias: categoriasActualizadas})
    actualizarVistas(traerDatos());
    $("#categoria-input").value = "";
}

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
    mostrarVista('seccion-balance');
    actualizarBalance(traerOperaciones());
    reestablecerOperacion();
    actualizarReportes();
    filtrarOperaciones();
}

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
    actualizarReportes();
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
    console.log(fecha);
    console.log(operaciones);
    return operaciones.filter((operacion) => {
        const fechaOperacion = new Date(operacion.fecha)
        return fechaOperacion.getTime() >= fecha.getTime()
    })
}
// -------------------------- SELECT ORDENAR POR --------------------------
//FECHA
const ordenarPorFecha = (operaciones, orden) => {
    return [...operaciones].sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return orden === 'ASC' ? fechaA.getTime() - fechaB.getTime() : fechaB.getTime() - fechaA.getTime();
    });
};
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

    $("#filtro-categorias-select").addEventListener('change', () => filtrarOperaciones());
    $("#selector-tipo").addEventListener('change', () => filtrarOperaciones());
    $("#input-fecha").addEventListener('change', () => filtrarOperaciones());
    $("#selector-ordenar").addEventListener('change', () => filtrarOperaciones());

const filtrarOperaciones = () => {
    const tipo = $('#selector-tipo').value;
    const categoria = $('#filtro-categorias-select').value;
    const fecha = new Date($('#input-fecha').value);
    const orden = $('#selector-ordenar').value;

    let operaciones = traerOperaciones();

    if (tipo !== 'TODOS') {
        operaciones = filtrarPorTipo(tipo, operaciones);
    }

    if (categoria !== 'Todas') {
        operaciones = filtrarPorCategoria(categoria, operaciones);
    }

    operaciones = filtrarPorFechaMayorOIgualA(fecha, operaciones)

    switch (orden) {
        case 'MAS-RECIENTES':
            operaciones = ordenarPorFecha(operaciones, 'DESC')
            break
        case 'MENOS-RECIENTES':
            operaciones = ordenarPorFecha(operaciones, 'ASC')
            break
        case 'MAYOR-MONTO':
            operaciones = ordernarPorMonto(operaciones, 'DESC')
            break
        case 'MENOR-MONTO':
            operaciones = ordernarPorMonto(operaciones, 'ASC')
            break
        case 'A/Z':
            operaciones = ordernarPorDescripcion(operaciones, 'ASC')
            break
        case 'Z/A':
            operaciones = ordernarPorDescripcion(operaciones, 'DESC')
            break
        default:
    }

    completarOperaciones(operaciones);
    actualizarBalance(operaciones)
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

// SECCIÓN REPORTES -----------------------------

// INTERCAMBIA LA VISTA DE REPORTES DEPENDIENDO SI HAY O NO OPERACIONES
const vistaReporte = () => {
    if (operaciones.length <= 0) {
        $('#sin-reportes').classList.remove('is-hidden')
        $('#con-reportes').classList.add('is-hidden')
        return
    }
    $('#con-reportes').classList.remove('is-hidden')
    $('#sin-reportes').classList.add('is-hidden')
}

// OBTIENE EL RESUMEN DE LAS CATEGORIAS
const obtenerResumenCategorias = (operaciones, categorias) => {
    let mayorGanancia = { categoria: '', monto: 0 };
    let mayorGasto = { categoria: '', monto: 0 };
    let mayorBalance = { categoria: '', monto: null };
    categorias.forEach((categoria) => {
        const operacionesDeCategoria = filtrarPorCategoria(categoria.id, operaciones);
        const { ganancias, gastos, balance } = obtenerBalance(operacionesDeCategoria);
        if (ganancias > mayorGanancia.monto) {
            mayorGanancia = { categoria: categoria.id, monto: ganancias };
        }
        if (gastos > mayorGasto.monto) {
            mayorGasto = { categoria: categoria.id, monto: gastos };
        }
        if (balance > mayorBalance.monto) {
            mayorBalance = { categoria: categoria.id, monto: balance };
        }
    });
    return { mayorGanancia, mayorGasto, mayorBalance };
}

// OBTIENE EL RESUMEN DE LOS MESES
const obtenerResumenMeses = (operaciones) => {
    let mayorGanancia = { fecha: '', monto: 0 };
    let mayorGasto = { fecha: '', monto: 0 };
    operaciones.forEach((operacion) => {
        const { tipo, fecha, monto } = operacion;
        if (tipo === 'GANANCIA' && monto > mayorGanancia.monto) {
            mayorGanancia = { fecha, monto };
        }
        if (tipo === 'GASTO' && monto > mayorGasto.monto) {
            mayorGasto = { fecha, monto };
        }
    });
    return { mayorGanancia, mayorGasto };
}

// OBTIENE TODOS LOS RESUMENES
const obtenerResumenes = (operaciones, categorias) => {
    const resumenCategorias = obtenerResumenCategorias(operaciones, categorias)
    const porMeses = obtenerResumenMeses(operaciones)
    return { categorias: resumenCategorias, meses: { ...porMeses } }
}

// GUARDA EL TOTAL POR CADA CATEGORIA EN UN ARRAY
const obtenerTotalesPorCategoria = (operaciones) => {
    const totalesPorCategoria = {};
    operaciones.forEach((operacion) => {
        const categoria = obtenerCategoria(operacion.categoria, traerCategorias()).nombre;
        const tipo = operacion.tipo.toLowerCase();
        const monto = operacion.monto;
        if (!totalesPorCategoria[categoria]) {
            totalesPorCategoria[categoria] = {
                ganancia: 0,
                gasto: 0,
                balance: 0,
            };
        }
        totalesPorCategoria[categoria][tipo] += monto;
        if (tipo === 'ganancia') {
            totalesPorCategoria[categoria].balance += monto;
        } else {
            totalesPorCategoria[categoria].balance -= monto;
        }
    });
    return totalesPorCategoria;
}

// GUARDA EL TOTAL POR MES EN UN ARRAY
const obtenerTotalesPorMes = (operaciones) => {
    const totalesPorMes = {};
    operaciones.forEach((operacion) => {
        const fechaCompleta = new Date(operacion.fecha + 'T00:00:00-03:00');
        const mes = `${fechaCompleta.getMonth() + 1}/${fechaCompleta.getFullYear()}`;
        const tipo = operacion.tipo.toLowerCase();
        const monto = operacion.monto;
        if (!totalesPorMes[mes]) {
            totalesPorMes[mes] = {
                ganancia: 0,
                gasto: 0,
                balance: 0,
            };
        }
        totalesPorMes[mes][tipo] += monto;
        if (tipo === 'ganancia') {
            totalesPorMes[mes].balance += monto;
        } else {
            totalesPorMes[mes].balance -= monto;
        }
    });
    return totalesPorMes;
}

// COMPLETA EL RESUMEN DE LA SECCIÓN REPORTE
const completarResumen = () => {
    const reporte = obtenerResumenes(traerOperaciones(), traerCategorias());
    // Categoría mayor ganancia
    $('#categoria-mayor-ganancia').innerText = obtenerCategoria( reporte.categorias.mayorGanancia.categoria, traerCategorias() ).nombre;
    $('#categoria-mayor-ganancia-monto').innerText = `+$${reporte.categorias.mayorGanancia.monto}`
    // Categoría mayor gasto
    $('#categoria-mayor-gasto').innerText = obtenerCategoria( reporte.categorias.mayorGasto.categoria, traerCategorias() ).nombre
    $('#categoria-mayor-gasto-monto').innerText = `-$${reporte.categorias.mayorGasto.monto}`
    // Categoría mayor balance
    $('#categoria-mayor-balance').innerText = obtenerCategoria( reporte.categorias.mayorBalance.categoria, traerCategorias() ).nombre
    $('#categoria-mayor-balance-monto').innerText = `$${reporte.categorias.mayorBalance.monto}`
    // Mes mayor ganancia
    $('#mes-mayor-ganancia').innerText = reporte.meses.mayorGanancia.fecha
    $('#mes-mayor-ganancia-monto').innerText = `+$${reporte.categorias.mayorGanancia.monto}`
    // Mes mayor gasto
    $('#mes-mayor-gasto').innerText = reporte.meses.mayorGasto.fecha
    $('#mes-mayor-gasto-monto').innerText = `-$${reporte.categorias.mayorGasto.monto}`
    vistaReporte();
}

// COMPLETA TOTALES POR CATEGORIAS DE LA SECCIÓN REPORTE
const completarTotalesPorCategoria = () => {
    $('#reporte-categorias').innerHTML = '';
    const reporte = obtenerTotalesPorCategoria(traerOperaciones());
    $('#reporte-categorias').innerHTML = `
        <div class="columns is-mobile">
            <div class="column">
                <h4 class="has-text-weight-semibold">Categoria</h4>
            </div>
            <div class="column">
                <h4 class="has-text-weight-semibold has-text-right">Ganancias</h4>
            </div>
            <div class="column">
                <h4 class="has-text-weight-semibold has-text-right">Gastos</h4>
            </div>
            <div class="column">
                <h4 class="has-text-weight-semibold has-text-right">Balance</h4>
            </div>
        </div>`
    for (let item in reporte) {
        const itemReporte = document.createElement('div');
        itemReporte.classList.add('columns', 'is-vcentered', 'is-mobile');
        itemReporte.innerHTML = `
            <div class="column">
                <h3 class="has-text-weight-semibold">${item}</h3>
            </div>
            <div class="column has-text-success has-text-right">
                +$${reporte[item].ganancia}
            </div>
            <div class="column has-text-danger has-text-right">
                -$${reporte[item].gasto}
            </div>
            <div class="column has-text-right">
                ${ reporte[item].balance < 0 ? '-' : '+' }$${Math.abs(reporte[item].balance)}
            </div>
        `;
        $('#reporte-categorias').append(itemReporte);
    }
};

// COMPLETA TOTALES POR MES DE LA SECCIÓN REPORTE
const completarTotalesPorMes = () => {
    const reporte = obtenerTotalesPorMes(traerOperaciones());
    $('#reporte-mes').innerHTML = '';
    $('#reporte-mes').innerHTML = `
        <div class="columns is-mobile">
            <div class="column">
                <h4 class="has-text-weight-semibold">Mes</h4>
            </div>
            <div class="column">
                <h4 class="has-text-weight-semibold has-text-right">Ganancias</h4>
            </div>
            <div class="column">
                <h4 class="has-text-weight-semibold has-text-right">Gastos</h4>
            </div>
            <div class="column">
                <h4 class="has-text-weight-semibold has-text-right">Balance</h4>
            </div>
        </div>`
    for (let item in reporte) {
        const itemReporte = document.createElement('div');
        itemReporte.classList.add('columns', 'is-vcentered', 'is-mobile');
        itemReporte.innerHTML = `
            <div class="column">
                <h3 class="has-text-weight-semibold">${item}</h3>
            </div>
            <div class="column has-text-success has-text-right">
                +$${reporte[item].ganancia}
            </div>
            <div class="column has-text-danger has-text-right">
                -$${reporte[item].gasto}
            </div>
            <div class="column has-text-right">
                ${ reporte[item].balance < 0 ? '-' : '+' }$${Math.abs(reporte[item].balance)}
            </div>
        `;
        $('#reporte-mes').append(itemReporte);
    }
};

const actualizarReportes = () => {
    completarResumen();
    completarTotalesPorMes();
    completarTotalesPorCategoria();
}  

// INICIALIZACIÓN -------------------------------

const inicializarVistas = () => {
    $('#boton-balance').addEventListener('click', () => mostrarVista('seccion-balance'));
    $('#boton-categorias').addEventListener('click', () => mostrarVista('seccion-categorias'));
    $('#boton-reportes').addEventListener('click', () => mostrarVista('seccion-reportes'));
    $('#boton-nueva-operacion').addEventListener('click', () => mostrarVista('seccion-nueva-operacion'));
    $('.navbar-burger').addEventListener('click', () => toggleMenuHamburguesa());
    $('#toggle-filtros').addEventListener('click', () => toggleFiltros());
}

const inicializarCategorias = () => {
    $("#cancelar-categoria-boton").addEventListener(`click`, () => mostrarVista('seccion-categorias'));
    $("#agregar-categoria-boton").addEventListener("click", () => agregarCategoria());
}

const inicializarOperaciones = () => {
    $('#agregar-operacion-boton').addEventListener('click', () => agregraOperacion());
    $('#cancelar-agregar-operacion-boton').addEventListener('click', () => {
        mostrarVista('seccion-balance');
        reestablecerOperacion();
    });
    $('#boton-cancelar-editar-operacion').addEventListener('click', () => mostrarVista('seccion-balance'));  
}

const inicializarPagina = () => {
    inicializarVistas();
    inicializarCategorias();
    inicializarOperaciones();
    fechaActualizada();
    llenarSelect(categorias);
    listaCategorias(categorias);
    actualizarBalance(traerOperaciones());
    actualizarReportes();
    filtrarOperaciones();
}

if (!traerCategorias() || traerCategorias().length === 0) {
    subirDatos({ categorias });
}

window.addEventListener('load', inicializarPagina);