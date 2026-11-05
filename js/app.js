// Arreglo global de tareas
let tareas = [];
let filtroActual = 'todas';

// Referencias a elementos del DOM
const modal = document.getElementById('modal-tarea');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const formTarea = document.getElementById('formulario-tarea');
const alertError = document.getElementById('alert-error');
const listaTareas = document.getElementById('lista-tareas');
const inputBuscador = document.getElementById('input-buscador');
const botonesFiltro = document.querySelectorAll('.btn-filtro');


//  FUNCIÓN DE VALIDACIÓN 

function validFormFieldInput(data) {
  // Comprobar los datos por consola
  console.log("name: " + data.name);
  console.log("description: " + data.description);
  console.log("dueDate: " + data.dueDate);
  console.log("status: " + data.status);

  // Nombre no vacío
  if (!data.name || data.name.trim() === '') {
    return false;
  }

  // Descripción no vacía
  if (!data.description || data.description.trim() === '') {
    return false;
  }

  //  Fecha de entrega presente
  if (!data.dueDate || data.dueDate.trim() === '') {
    return false;
  }

  // Estado seleccionado
  if (!data.status || data.status.trim() === '') {
    return false;
  }

  return true;
}


// CONTROL DEL MODAL Y EVENTOS DE FORMULARIO


btnAbrirModal.addEventListener('click', function() {
  modal.classList.remove('oculto');
  alertError.classList.add('d-none'); // Ocultar alerta previa al abrir
});

function cerrarModal() {
  modal.classList.add('oculto');
  formTarea.reset();
  alertError.classList.add('d-none');
}

btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

// ENVIAR Y VALIDAR FORMULARIO
formTarea.addEventListener('submit', function(evento) {
  evento.preventDefault();

  // Capturar valores mediante selectors
  const nameInput = document.querySelector('#newTaskNameInput').value;
  const descriptionInput = document.querySelector('#newTaskDescriptionInput').value;
  const dueDateInput = document.querySelector('#newTaskDueDateInput').value;
  const statusInput = document.querySelector('#newTaskStatusInput').value;

  // Empaquetar objeto de datos para la función de validación
  const formData = {
    name: nameInput,
    description: descriptionInput,
    dueDate: dueDateInput,
    status: statusInput
  };

  // Ejecutar validación
  const esValido = validFormFieldInput(formData);

  if (!esValido) {
    // Formulario inválido o incompleto -> Mostrar alerta
    alertError.classList.remove('d-none');
    return;
  }

  //  Formulario válido -> Ocultar alerta y procesar tarea
  alertError.classList.add('d-none');

  // Formatear fecha para la lista
  const fechaObj = new Date(dueDateInput);
  const fechaFormateada = fechaObj.toLocaleString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Crear objeto tarea
  const nuevaTarea = {
    id: Date.now(),
    titulo: nameInput,
    descripcion: descriptionInput,
    prioridad: statusInput,
    fechaTexto: fechaFormateada,
    completada: false
  };

  tareas.push(nuevaTarea);
  cerrarModal();
  renderizarTareas();
});


// FILTROS Y BÚSQUEDA

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

// -------------------------------------------------------------
// RENDERIZAR TAREAS EN PANTALLA
// -------------------------------------------------------------
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