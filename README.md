# 🚦 Planificador de Tareas Web — Semáforo & Calendario

![Estado del Proyecto](https://img.shields.io/badge/Estado-En_Desarrollo-yellow?style=for-the-badge)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)
![Tecnologías](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-blue?style=for-the-badge)

Una aplicación web moderna e intuitiva para la gestión y planificación de tareas diarias. Su diferencial clave es la integración de un **sistema visual tipo semáforo** (🔴 Rojo, 🟡 Amarillo, 🟢 Verde) y una **vista de calendario**, permitiendo a los usuarios priorizar sus actividades de forma rápida y evitar la sobrecarga de trabajo.

---

## 🔗 Enlaces del Proyecto

| Recurso | Enlace de Acceso |
| :--- | :--- |
| 🎨 **Diseño en Figma** | [Ver Wireframe & UI en Figma](https://www.figma.com/design/hSpQJnKEF9LNRNS3zaSRVl/Planificador-de-Tareas-Web?node-id=0-1&t=OHQs8L8TYVl5BJAt-1) |
| 📋 **Gestión en Trello** | [Ver Tablero de Sprints en Trello](https://trello.com/invite/b/6abd3a4efa53609caa771404/ATTIbb22409e99429d7c7bcc8b0f06ead3e1FF0CE23C/mi-tablero-de-trello) |
| 🌐 **Sitio Web (Demo)** |

---

## 💡 Lógica del Sistema Semáforo

La aplicación evalúa automáticamente las fechas de vencimiento y el estado de cada tarea para clasificarlas según su urgencia:

* 🔴 **Rojo (Crítico / Urgente):** Tareas vencidas o que deben entregarse en menos de **24 horas**.
* 🟡 **Amarillo (En Proceso):** Tareas planificadas para los próximos **2 a 5 días**.
* 🟢 **Verde (Próximas / Completadas):** Tareas con más de **5 días de plazo** o marcadas como finalizadas.

---

## ✨ Características Principales

- 📝 **Gestión CRUD Completa:** Crea, lee, edita, marca como completada y elimina tareas de forma sencilla.
- 🚥 **Widget Semáforo en Tiempo Real:** Indicador dinámico en el encabezado que cuenta cuántas tareas activas hay por cada nivel de urgencia.
- 🎯 **Filtros Rápido de Tareas:** Filtra la vista principal para concentrarte únicamente en las tareas Rojas, Amarillas o Verdes.
- 📅 **Vista de Calendario Integrado:** Visualiza el mes actual con identificadores de color en cada día según tus tareas pendientes.
- 💾 **Persistencia de Datos:** Uso de `LocalStorage` del navegador para conservar tus tareas al cerrar o recargar la página.
- 📱 **Diseño Responsive:** Adaptado para una navegación fluida en computadoras, tablets y celulares.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructuración semántica de la página.
- **CSS3:** Estilos modernos (Flexbox, CSS Grid, Variables CSS, Efectos *Glow/Neon*).
- **JavaScript (ES6+):** Lógica del semáforo, manipulación del DOM, filtros y eventos.
- **LocalStorage API:** Almacenamiento local del usuario.

---

