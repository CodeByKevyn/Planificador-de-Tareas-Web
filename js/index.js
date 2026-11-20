// 1. Creamos la instancia de TaskManager
const taskManager = new TaskManager();
console.log(taskManager.tasks);

// 2. Seleccionamos el formulario y la alerta
const formTarea = document.querySelector('#formulario-tarea');
const alertError = document.querySelector('#alert-error');

// 3. Función de validación
function validFormFieldInput(data) {
  console.log("name: " + data.name);
  console.log("description: " + data.description);
  console.log("dueDate: " + data.dueDate);
  console.log("status: " + data.status);

  if (!data.name || data.name.trim() === '') return false;
  if (!data.description || data.description.trim() === '') return false;
  if (!data.dueDate || data.dueDate.trim() === '') return false;
  if (!data.status || data.status.trim() === '') return false;

  return true;
}

// 4. Escuchamos el envío del formulario
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

  // Validar
  if (!validFormFieldInput(formData)) {
    alertError.classList.remove('d-none');
    return;
  }

  // Ocultar alerta de error
  alertError.classList.add('d-none');

  // Guardar en TaskManager (Tarea 5)
  taskManager.addTask(nameInput, descriptionInput, dueDateInput, statusInput);
  console.log(taskManager.tasks);

  // Avisarle a app.js que dibuje la tarjeta en pantalla y cierre el modal
  agregarTareaVisual(nameInput, descriptionInput, dueDateInput, statusInput);

  // Limpiar el formulario
  formTarea.reset();
});