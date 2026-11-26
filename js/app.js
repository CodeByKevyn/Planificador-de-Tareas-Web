// Lista de tareas persistida en el navegador.
const CLAVE_TAREAS = 'semaforito-tareas';
let tareas = cargarTareas();
let filtroActual = 'todas';
const taskManager = new TaskManager(
  tareas.length > 0 ? Math.max.apply(null, tareas.map(function(tarea) { return tarea.id; })) : 0
);
taskManager.tasks = tareas.map(function(tarea) {
  return {
    id: tarea.id,
    titulo: tarea.titulo,
    descripcion: tarea.descripcion,
    prioridad: tarea.prioridad,
    fechaTexto: tarea.fechaTexto,
    completada: tarea.completada,
    status: tarea.completada ? 'DONE' : 'PORHACER'
  };
});

// Referencias visuales del DOM
const modal = document.getElementById('modal-tarea');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const listaTareas = document.getElementById('tasksList');
const inputBuscador = document.getElementById('input-buscador');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

function cargarTareas() {
  try {
    const tareasGuardadas = localStorage.getItem(CLAVE_TAREAS);
    if (!tareasGuardadas) return [];

    const datos = JSON.parse(tareasGuardadas);
    if (!Array.isArray(datos)) throw new Error('El formato guardado no es una lista.');

    return datos.filter(function(tarea) {
      return tarea &&
        Number.isSafeInteger(tarea.id) &&
        typeof tarea.titulo === 'string' &&
        typeof tarea.descripcion === 'string' &&
        ['urgente', 'proxima', 'en-tiempo'].includes(tarea.prioridad) &&
        typeof tarea.fechaTexto === 'string' &&
        typeof tarea.completada === 'boolean';
    });
  } catch (error) {
    console.error('No se pudieron cargar las tareas guardadas.', error);
    window.alert('No se pudieron cargar tus tareas guardadas. Puedes continuar y crear tareas nuevas.');
    return [];
  }
}

function guardarTareas() {
  try {
    localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
  } catch (error) {
    console.error('No se pudieron guardar las tareas.', error);
    window.alert('No se pudieron guardar tus tareas en este navegador.');
  }
}

function escaparHTML(valor) {
  return valor.replace(/[&<>"']/g, function(caracter) {
    const entidades = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entidades[caracter];
  });
}

// ==========================================
// 1. CONTROL DEL MODAL
// ==========================================
btnAbrirModal.addEventListener('click', function() {
  modal.classList.remove('oculto');
  document.getElementById('alert-error').classList.add('d-none');
});

function cerrarModal() {
  modal.classList.add('oculto');
  document.getElementById('formulario-tarea').reset();
  document.getElementById('alert-error').classList.add('d-none');
}

btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

// ==========================================
// 2. RECIBIR TAREA DESDE INDEX.JS, GUARDARLA Y DIBUJARLA
// ==========================================
function agregarTareaVisual(name, description, dueDate, status) {
  const fechaObj = new Date(dueDate);
  if (Number.isNaN(fechaObj.getTime())) {
    throw new Error('La fecha de entrega no es válida.');
  }
  const fechaFormateada = fechaObj.toLocaleString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  taskManager.addTask(name, description, fechaFormateada, status);
  const nuevaTarea = taskManager.tasks[taskManager.tasks.length - 1];
  tareas = taskManager.tasks.slice();
  console.log('Tarea creada:', nuevaTarea);
  guardarTareas();
  cerrarModal();
  renderizarTareas();
}

// ==========================================
// 3. FILTROS, BÚSQUEDA Y ACCIONES
// ==========================================
botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function() {
    botonesFiltro.forEach(function(b) { b.classList.remove('activo'); });
    boton.classList.add('activo');
    filtroActual = boton.getAttribute('data-filtro');
    renderizarTareas();
  });
});

inputBuscador.addEventListener('input', function() {
  renderizarTareas();
});

function alternarCompletada(idTarea) {
  const tarea = taskManager.getTaskById(idTarea);
  if (tarea) {
    tarea.completada = !tarea.completada;
    tarea.status = tarea.completada ? 'DONE' : 'PORHACER';
    tareas = taskManager.tasks.slice();
    guardarTareas();
  }
  taskManager.render();
}

function eliminarTarea(idTarea) {
  taskManager.tasks = taskManager.tasks.filter(function(t) { return t.id !== idTarea; });
  tareas = taskManager.tasks.slice();
  guardarTareas();
  renderizarTareas();
}

// ==========================================
// 4. RENDERIZAR TARJETAS Y ESTADÍSTICAS
// ==========================================
function renderizarTareas() {
  const busqueda = inputBuscador.value.toLowerCase();

  tareas = taskManager.tasks.slice();
  const tareasFiltradas = taskManager.tasks.filter(function(tarea) {
    let coincideFiltro = true;
    if (filtroActual === 'urgente') coincideFiltro = (tarea.prioridad === 'urgente');
    if (filtroActual === 'proxima') coincideFiltro = (tarea.prioridad === 'proxima');

    let coincideBusqueda = tarea.titulo.toLowerCase().includes(busqueda) || 
                             tarea.descripcion.toLowerCase().includes(busqueda);

    return coincideFiltro && coincideBusqueda;
  });

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = tareas.length === 0
      ? '<p class="mensaje-vacio">Aún no tienes tareas. Añade una para comenzar.</p>'
      : '<p class="mensaje-vacio">No hay tareas para mostrar.</p>';
  } else {
    let contenidoHTML = '';
    tareasFiltradas.forEach(function(tarea) {
      contenidoHTML += taskManager.createTaskHtml(
        tarea.id,
        tarea.titulo,
        tarea.descripcion,
        tarea.fechaTexto,
        tarea.status,
        tarea.completada,
        tarea.prioridad
      );
    });
    listaTareas.innerHTML = contenidoHTML;
  }

  actualizarEstadisticas();
}

function actualizarEstadisticas() {
  const total = tareas.length;
  let completadas = 0;

  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].completada) completadas++;
  }

  const pendientes = total - completadas;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  document.getElementById('stat-completadas').textContent = completadas;
  document.getElementById('stat-pendientes').textContent = pendientes;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('conteo-pendientes').textContent = `${pendientes} tareas`;
  document.getElementById('texto-porcentaje').textContent = `${porcentaje}%`;
  document.getElementById('texto-barra-conteo').textContent = `${completadas} de ${total}`;
  document.getElementById('barra-relleno').style.width = `${porcentaje}%`;
}

document.getElementById('fecha-hoy').textContent = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
}).toLocaleUpperCase('es-ES');

renderizarTareas();