// 1. Seleccionamos el formulario y la alerta
const formTarea = document.querySelector('#formulario-tarea');
const alertError = document.querySelector('#alert-error');

// 2. Función de validación
function validFormFieldInput(data) {
  if (!data.name || data.name.trim() === '') return false;
  if (!data.description || data.description.trim() === '') return false;
  if (!data.dueDate || data.dueDate.trim() === '') return false;
  if (!data.status || data.status.trim() === '') return false;
  if (Number.isNaN(new Date(data.dueDate).getTime())) return false;
  if (!['urgente', 'proxima', 'en-tiempo'].includes(data.status)) return false;

  return true;
}

// 3. Escuchamos el envío del formulario
formTarea.addEventListener('submit', function(evento) {
  evento.preventDefault();

  // Capturar valores de los inputs
  const nameInput = document.querySelector('#newTaskNameInput').value;
  const descriptionInput = document.querySelector('#newTaskDescriptionInput').value;
  const dueDateInput = document.querySelector('#newTaskDueDateInput').value;
  const statusInput = document.querySelector('#newTaskStatusInput').value;

  const formData = {
    name: nameInput,
    description: descriptionInput,
    dueDate: dueDateInput,
    status: statusInput
  };

  console.log('Datos enviados para crear tarea:', formData);

  // Validar
  if (!validFormFieldInput(formData)) {
    alertError.classList.remove('d-none');
    return;
  }

  // Ocultar alerta de error
  alertError.classList.add('d-none');

  // Avisarle a app.js que guarde la tarea, dibuje la tarjeta y cierre el modal
  agregarTareaVisual(nameInput, descriptionInput, dueDateInput, statusInput);

  // Limpiar el formulario
  formTarea.reset();
});

// Un único EventListener delega el clic de todos los botones "Mark As Done".
const tasksList = document.querySelector('#tasksList');
tasksList.addEventListener('click', (event) => {
  if (!event.target.classList.contains('done-button')) return;

  const parentTask = event.target.closest('[data-task-id]');
  if (!parentTask) return;

  const taskId = Number(parentTask.dataset.taskId);
  const task = taskManager.getTaskById(taskId);
  if (!task) return;

  task.status = 'DONE';
  task.completada = true;
  tareas = taskManager.tasks.slice();
  guardarTareas();
  taskManager.render();
});