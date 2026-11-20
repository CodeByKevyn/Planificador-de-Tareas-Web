// Arreglo visual para pintar tarjetas, filtrar y calcular estadísticas
let tareas = [];
let filtroActual = 'todas';

// Referencias visuales del DOM
const modal = document.getElementById('modal-tarea');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const listaTareas = document.getElementById('lista-tareas');
const inputBuscador = document.getElementById('input-buscador');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

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
// 2. RECIBIR TAREA DESDE INDEX.JS Y DIBUJARLA
// ==========================================
function agregarTareaVisual(name, description, dueDate, status) {
  const fechaObj = new Date(dueDate);
  const fechaFormateada = fechaObj.toLocaleString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const nuevaTarea = {
    id: Date.now(),
    titulo: name,
    descripcion: description,
    prioridad: status,
    fechaTexto: fechaFormateada,
    completada: false
  };

  tareas.push(nuevaTarea);
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
      break;
    }
  }
  renderizarTareas();
}

function eliminarTarea(idTarea) {
  tareas = tareas.filter(function(t) { return t.id !== idTarea; });
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
    listaTareas.innerHTML = '<p class="mensaje-vacio">No hay tareas para mostrar.</p>';
  } else {
    let contenidoHTML = '';
    tareasFiltradas.forEach(function(tarea) {
      const claseCompletada = tarea.completada ? 'completada' : '';
      const claseTachado = tarea.completada ? 'tachado' : '';
      const textoEstado = tarea.prioridad.replace('-', ' ');

      contenidoHTML += `
        <div class="tarea-item ${claseCompletada}">
          <div class="tarea-checkbox">
            <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="alternarCompletada(${tarea.id})">
          </div>
          <div class="tarea-info">
            <div class="tarea-titulo-fila">
              <span class="tarea-titulo ${claseTachado}">${tarea.titulo}</span>
              <span class="badge ${tarea.prioridad}">${textoEstado}</span>
            </div>
            <span class="tarea-categoria">${tarea.descripcion}</span>
          </div>
          <div class="tarea-fecha-box">
            <span class="fecha-texto">${tarea.fechaTexto}</span>
            <span class="vencimiento ${tarea.prioridad}">${tarea.completada ? 'Completada' : 'Pendiente'}</span>
          </div>
          <button class="btn-opciones" onclick="eliminarTarea(${tarea.id})">🗑️</button>
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