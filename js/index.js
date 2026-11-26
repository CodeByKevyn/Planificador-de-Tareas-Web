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

  // Crear una tarea nueva o guardar los cambios de la tarea seleccionada
  if (tareaEditandoId !== null) {
    guardarEdicionTarea(nameInput, descriptionInput, dueDateInput, statusInput);
  } else {
    agregarTareaVisual(nameInput, descriptionInput, dueDateInput, statusInput);
  }

  // Limpiar el formulario
  formTarea.reset();
});