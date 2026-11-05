// Array para guardar la lista de tareas en memoria
let tareas = [];
let filtroActual = 'todas';

// Captura de elementos del DOM
const modal = document.getElementById('modal-tarea');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const formTarea = document.getElementById('formulario-tarea');
const listaTareas = document.getElementById('lista-tareas');
const inputBuscador = document.getElementById('input-buscador');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// ABRIR Y CERRAR MODAL
btnAbrirModal.addEventListener('click', function() {
  modal.classList.remove('oculto');
});

btnCerrarModal.addEventListener('click', function() {
  modal.classList.add('oculto');
});

btnCancelar.addEventListener('click', function() {
  modal.classList.add('oculto');
});

// AGREGAR NUEVA TAREA DESDE EL FORMULARIO
formTarea.addEventListener('submit', function(evento) {
  evento.preventDefault();

  const titulo = document.getElementById('titulo-tarea').value;
  const categoria = document.getElementById('categoria-tarea').value;
  const prioridad = document.getElementById('prioridad-tarea').value;
  const fechaHora = document.getElementById('fecha-tarea').value;

  // Formatear la fecha ingresada para que se vea bonita
  let fechaFormateada = 'Sin fecha';
  if (fechaHora) {
    const fechaObj = new Date(fechaHora);
    fechaFormateada = fechaObj.toLocaleString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Objeto de la tarea
  const nuevaTarea = {
    id: Date.now(),
    titulo: titulo,
    categoria: categoria,
    prioridad: prioridad,
    fechaTexto: fechaFormateada,
    completada: false
  };

  // Guardar en la lista y resetear interfaz
  tareas.push(nuevaTarea);
  formTarea.reset();
  modal.classList.add('oculto');

  // Actualizar pantalla y contadores
  renderizarTareas();
});

// FUNCIONAMIENTO DE LOS FILTROS (Todas / Urgentes / Próximas)
botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function() {
    // Quitar la clase activo de todos los botones y ponérsela al clickeado
    botonesFiltro.forEach(function(b) { b.classList.remove('activo'); });
    boton.classList.add('activo');

    // Cambiar filtro actual y redibujar
    filtroActual = boton.getAttribute('data-filtro');
    renderizarTareas();
  });
});

// BÚSQUEDA EN TIEMPO REAL
inputBuscador.addEventListener('input', function() {
  renderizarTareas();
});

// MARCAR/DESMARCAR TAREA COMO COMPLETADA
function alternarCompletada(idTarea) {
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].id === idTarea) {
      tareas[i].completada = !tareas[i].completada;
      break;
    }
  }
  renderizarTareas();
}

// ELIMINAR TAREA
function eliminarTarea(idTarea) {
  tareas = tareas.filter(function(t) {
    return t.id !== idTarea;
  });
  renderizarTareas();
}

// RENDERIZAR TAREAS EN PANTALLA Y ACTUALIZAR ESTADÍSTICAS
function renderizarTareas() {
  const busqueda = inputBuscador.value.toLowerCase();

  // Filtrar según el botón presionado y el texto del buscador
  const tareasFiltradas = tareas.filter(function(tarea) {
    let coincideFiltro = true;
    if (filtroActual === 'urgente') {
      coincideFiltro = (tarea.prioridad === 'urgente');
    } else if (filtroActual === 'proxima') {
      coincideFiltro = (tarea.prioridad === 'proxima');
    }

    let coincideBusqueda = tarea.titulo.toLowerCase().includes(busqueda) || 
                             tarea.categoria.toLowerCase().includes(busqueda);

    return coincideFiltro && coincideBusqueda;
  });

  // Mostrar mensaje de vacío o construir el HTML de la lista
  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<p class="mensaje-vacio">No hay tareas para mostrar.</p>';
  } else {
    let contenidoHTML = '';
    tareasFiltradas.forEach(function(tarea) {
      const claseCompletada = tarea.completada ? 'completada' : '';
      const claseTachado = tarea.completada ? 'tachado' : '';
      const textoPrioridad = tarea.prioridad.replace('-', ' ');

      contenidoHTML += `
        <div class="tarea-item ${claseCompletada}">
          <div class="tarea-checkbox">
            <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="alternarCompletada(${tarea.id})">
          </div>
          <div class="tarea-info">
            <div class="tarea-titulo-fila">
              <span class="tarea-titulo ${claseTachado}">${tarea.titulo}</span>
              <span class="badge ${tarea.prioridad}">${textoPrioridad}</span>
            </div>
            <span class="tarea-categoria">${tarea.categoria}</span>
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

  // Actualizar contadores superiores y barra de progreso
  actualizarEstadisticas();
}

// 8. ACTUALIZAR ESTADÍSTICAS DEL PROGRESO GENERAL
function actualizarEstadisticas() {
  const total = tareas.length;
  let completadas = 0;

  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].completada) {
      completadas++;
    }
  }

  const pendientes = total - completadas;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  // Inyectar en el DOM
  document.getElementById('stat-completadas').textContent = completadas;
  document.getElementById('stat-pendientes').textContent = pendientes;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('conteo-pendientes').textContent = `${pendientes} tareas`;
  document.getElementById('texto-porcentaje').textContent = `${porcentaje}%`;
  document.getElementById('texto-barra-conteo').textContent = `${completadas} de ${total}`;
  document.getElementById('barra-relleno').style.width = `${porcentaje}%`;
}