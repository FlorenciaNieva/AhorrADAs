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