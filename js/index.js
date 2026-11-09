const taskManager = new TaskManager();
console.log(taskManager.tasks);

document.addEventListener('DOMContentLoaded', () => {
  const listaTareas = document.getElementById('lista-tareas');

  if (listaTareas) {
    listaTareas.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-completar')) {
        const boton = event.target;
        const tarjeta = boton.closest('.task-card');
        const titulo = tarjeta.querySelector('.task-title');

        const estaCompletada = tarjeta.classList.toggle('bg-light');

        if (estaCompletada) {
          titulo.classList.add('text-decoration-line-through', 'text-muted');
          boton.textContent = 'Desmarcar / Pendiente';
          boton.classList.replace('btn-outline-success', 'btn-secondary');
        } else {
          titulo.classList.remove('text-decoration-line-through', 'text-muted');
          boton.textContent = 'Marcar como completada';
          boton.classList.replace('btn-secondary', 'btn-outline-success');
        }
      }
    });
  }
});