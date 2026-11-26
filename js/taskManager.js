class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }

  addTask(name, description, dueDate, status) {
    this.currentId++;

    this.tasks.push({
      id: this.currentId,
      titulo: name,
      descripcion: description,
      prioridad: status,
      fechaTexto: dueDate,
      dueDate: dueDate,
      completada: false,
      status: 'PORHACER'
    });
  }

  getTaskById(taskId) {
    let foundTask;
    for (let task of this.tasks) {
      if (task.id === taskId) {
        foundTask = task;
      }
    }
    return foundTask;
  }

  createTaskHtml(id, name, description, dueDate, status, completada, prioridad) {
    const claseCompletada = completada ? 'completada' : '';
    const claseTachado = completada ? 'tachado' : '';
    const textoEstado = escaparHTML(prioridad.replace('-', ' '));
    const titulo = escaparHTML(name);
    const descripcion = escaparHTML(description);
    const fechaTexto = escaparHTML(dueDate);

    return `
      <div class="tarea-item ${claseCompletada}" data-task-id="${id}">
        <div class="tarea-checkbox">
          <button type="button" class="btn-completar ${completada ? 'activo' : ''}"
            aria-label="${completada ? 'Marcar como pendiente' : 'Marcar como completada'}"
            title="${completada ? 'Marcar como pendiente' : 'Marcar como completada'}"
            onclick="alternarCompletada(${id})">${completada ? '✓' : ''}</button>
        </div>
        <div class="tarea-info">
          <div class="tarea-titulo-fila">
            <span class="tarea-titulo ${claseTachado}">${titulo}</span>
            <span class="badge ${prioridad}">${textoEstado}</span>
          </div>
          <span class="tarea-categoria">${descripcion}</span>
        </div>
        <div class="tarea-fecha-box">
          <span class="fecha-texto">${fechaTexto}</span>
          <span class="vencimiento ${prioridad}">${completada ? 'DONE' : 'Pendiente'}</span>
        </div>
        <button type="button" class="btn-editar" aria-label="Editar tarea"
          title="Editar tarea" onclick="abrirEditarTarea(${id})">Editar</button>
        <button type="button" class="btn-opciones" aria-label="Eliminar tarea" title="Eliminar tarea"
          onclick="eliminarTarea(${id})">🗑️</button>
      </div>
    `;
  }

  render() {
    if (typeof renderizarTareas === 'function') {
      renderizarTareas();
    }
  }
}