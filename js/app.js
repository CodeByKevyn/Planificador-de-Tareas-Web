// Lista de tareas persistida en el navegador.
const CLAVE_TAREAS = 'semaforito-tareas';
let tareas = cargarTareas();
let filtroActual = 'todas';

// Referencias visuales del DOM
const modal = document.getElementById('modal-tarea');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const listaTareas = document.getElementById('lista-tareas');
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
  const siguienteId = tareas.reduce(function(maximo, tarea) {
    return Math.max(maximo, tarea.id);
  }, Date.now() - 1) + 1;

  const nuevaTarea = {
    id: siguienteId,
    titulo: name,
    descripcion: description,
    prioridad: status,
    fechaTexto: fechaFormateada,
    completada: false
  };

  tareas.push(nuevaTarea);
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
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].id === idTarea) {
      tareas[i].completada = !tareas[i].completada;
      guardarTareas();
      break;
    }
  }
  renderizarTareas();
}

function eliminarTarea(idTarea) {
  tareas = tareas.filter(function(t) { return t.id !== idTarea; });
  guardarTareas();
  renderizarTareas();
}

// ==========================================
// 4. RENDERIZAR TARJETAS Y ESTADÍSTICAS
// ==========================================
function renderizarTareas() {
  const busqueda = inputBuscador.value.toLowerCase();

  const tareasFiltradas = tareas.filter(function(tarea) {
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
      const claseCompletada = tarea.completada ? 'completada' : '';
      const claseTachado = tarea.completada ? 'tachado' : '';
      const textoEstado = escaparHTML(tarea.prioridad.replace('-', ' '));
      const titulo = escaparHTML(tarea.titulo);
      const descripcion = escaparHTML(tarea.descripcion);
      const fechaTexto = escaparHTML(tarea.fechaTexto);

      contenidoHTML += `
        <div class="tarea-item ${claseCompletada}">
          <div class="tarea-checkbox">
            <button type="button" class="btn-completar ${tarea.completada ? 'activo' : ''}"
              aria-label="${tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}"
              title="${tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}"
              onclick="alternarCompletada(${tarea.id})">${tarea.completada ? '✓' : ''}</button>
          </div>
          <div class="tarea-info">
            <div class="tarea-titulo-fila">
              <span class="tarea-titulo ${claseTachado}">${titulo}</span>
              <span class="badge ${tarea.prioridad}">${textoEstado}</span>
            </div>
            <span class="tarea-categoria">${descripcion}</span>
          </div>
          <div class="tarea-fecha-box">
            <span class="fecha-texto">${fechaTexto}</span>
            <span class="vencimiento ${tarea.prioridad}">${tarea.completada ? 'Completada' : 'Pendiente'}</span>
          </div>
          <button type="button" class="btn-opciones" aria-label="Eliminar tarea" title="Eliminar tarea"
            onclick="eliminarTarea(${tarea.id})">🗑️</button>
        </div>
      `;
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