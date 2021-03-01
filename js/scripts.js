eventListeners();
//Lista de proyectos
let listaProyectos = document.querySelector('ul#proyectos');
function eventListeners() {
  //Document Ready
  document.addEventListener('DOMContentLoaded', function(){
    actualizarProgreso();
  })
  //Boton para crear proyecto
  document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
  //Boton para una nueva tarea
  if(document.querySelector('.nueva-tarea') !==null) {
  document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
}
  //Botones para las acciones de las tareas
  document.querySelector('.listado-pendientes').addEventListener('click', accionesTarea);
}
function nuevoProyecto(e) {
  e.preventDefault();
  //Crea un <input> para el nombre del nuevo proyecto
  let nuevoProyecto =  document.createElement('li');
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);
  //Seleccionar el ID con el nuevoProyecto
  let inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
  //Al presionar enter crear el proyecto
  inputNuevoProyecto.addEventListener('keypress', function(e){
    let tecla = e.which || e.keycode;
    if (tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}
function guardarProyectoDB(nombreProyecto){

  //Crear llamado a AJAX
  let xhr = new XMLHttpRequest();
  //Enviar datos por FormData
  let datos = new FormData();
  datos.append('proyecto', nombreProyecto);
  datos.append('accion', 'crear');
  //Abrir la conexion
  xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
  //En la carga
  xhr.onload = function() {
    if(this.status === 200){
      let respuesta = JSON.parse(xhr.responseText),
          proyecto = respuesta.nombre_proyecto,
          id_proyecto = respuesta.id_insertado,
          tipo = respuesta.tipo,
          resultado = respuesta.respuesta;
          //Comprobar la inserción
          if (resultado === 'correcto') {
            //Fue exitoso
            if (tipo === 'crear') {
              //Se creó un nuevo proyecto
                //Inyectar el HTML
                let nuevoProyecto = document.createElement('li');
                nuevoProyecto.innerHTML = `
                <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                  ${nombreProyecto}
                </a>
                `;
                //Agregar al html
                listaProyectos.appendChild(nuevoProyecto)
                //Enviar alerta
                Swal.fire({
                  title: 'Proyecto creado',
                  text: 'El proyecto ' + proyecto + ' se creó correctamente.',
                  icon: 'success'
                })
                .then(resultado =>{
                //Redireccionar a la nueva URL
                  if (resultado.value) {
                    window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                  }
                });
            } else {
              //Se actualizó o se eliminó
            }
          } else {
            //Hubo un error
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Hubo un error!'
            });
          }
    }
  }
  //Enviar el request
  xhr.send(datos);
}
//Agregar una nueva tarea al proyecto actual
function agregarTarea(e){
  e.preventDefault();
  let nombreTarea = document.querySelector('.nombre-tarea').value;
  //Validar que el campo tenga algo escrito
  if (nombreTarea === ''|| nombreTarea === " ") {
    Swal.fire({
      title: 'Error',
      text: 'Una tarea no puede estar vacía.',
      icon: 'error'
    });
  } else {
    //La tarea tiene algo
    //Crear llamado AJAX
    let xhr = new XMLHttpRequest();
    //Crear FormData
    let datos = new FormData();
    datos.append('tarea', nombreTarea);
    datos.append('accion', 'crear');
    datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tarea.php', true);
    //Ejecutarlo y respuesta
    xhr.onload = function() {
      if(this.status === 200) {
        //Todo correcto
        let respuesta = JSON.parse(xhr.responseText);
        //Asignar valores
        let resultado = respuesta.respuesta,
            tarea = respuesta.tarea,
            id_insertado = respuesta.id_insertado,
            tipo = respuesta.tipo
        if (resultado === 'correcto') {
          //Se agregó correctamente
          if (tipo === 'crear') {
            //Lanza la alerta
            Swal.fire({
              title: 'Tarea creada!',
              text: 'La tarea: ' + nombreTarea + ' se creó correctamente.',
              icon: 'success'
            });
            //Seleccionar el parrafo con la lista vacia
            let parrafoListaVacia = document.querySelectorAll('.lista-vacia');
            if (parrafoListaVacia.length > 0) {
              document.querySelector('.lista-vacia').remove();
            }
            //Construir el template
            let nuevaTarea = document.createElement('li');
            //Agregamos el ID
            nuevaTarea.id = 'tarea: '+id_insertado;
            //Agregamos la clase tarea
            nuevaTarea.classList.add('tarea');
            //Construir el HTML
            nuevaTarea.innerHTML = `
            <p>${nombreTarea}</p>
            <div class="acciones">
            <i class="far fa-check-circle"></i>
            <i class="fas fa-trash"></i>
            </div>
            `;
            //Agregarlo al DOM
            let listado = document.querySelector('.listado-pendientes ul');
            listado.appendChild(nuevaTarea);
            //Limpiar el formulario
            document.querySelector('.agregar-tarea').reset();
            //Actualizar el progreso
            actualizarProgreso();
          }
        } else {
          //Hubo un error
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error!',
            icon: 'error'
          });
        }
      }
    }
    //Enviar la consulta
    xhr.send(datos);
  }
}
//Cambia el estado de las tareas o las elimina
function accionesTarea(e) {
  e.preventDefault();
  if (e.target.classList.contains('fa-check-circle')) {
    if (e.target.classList.contains('completo')) {
      e.target.classList.remove('completo');
      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add('completo');
      cambiarEstadoTarea(e.target, 1);
    }
  }
  if (e.target.classList.contains('fa-trash')) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No será posible deshacer esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value){
      let tareaEliminar = e.target.parentElement.parentElement;
      //Borrar de la BD
      eliminarTareaBD(tareaEliminar);
      //Borrar del HTML
      tareaEliminar.remove();
        Swal.fire(
          'Eliminado!',
          'Tarea eliminada.',
          'success'
        )
      }
      })
  }
}
//Completa o descompleta la tarea
function cambiarEstadoTarea(tarea, estado){
  let idTarea = tarea.parentElement.parentElement.id.split(':');
  //Crear llamado AJAX
  let xhr = new XMLHttpRequest();
  //Informacion
  let datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'actualizar');
  datos.append('estado', estado);
  //Abrir la conexion
  xhr.open('POST', 'inc/modelos/modelo-tarea.php', true);
  //Onload
  xhr.onload = function() {
    if(this.status === 200) {
      //console.log(JSON.parse(xhr.responseText));
        //Actualizar el progreso
        actualizarProgreso();
    }
  }
  //Enviar la peticion
  xhr.send(datos);
}
//Eliminar tarea de la BD
function eliminarTareaBD(tarea) {
  let idTarea = tarea.id.split(':');
    //Crear llamado AJAX
    let xhr = new XMLHttpRequest();
    //Informacion
    let datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tarea.php', true);
    //Onload
    xhr.onload = function() {
      if(this.status === 200) {
        //console.log(JSON.parse(xhr.responseText));
        //Comprobar que haya tareas restantes
        let listaTareasRestantes = document.querySelectorAll('li.tarea');
        if (listaTareasRestantes.length === 0) {
          document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
        }
        //Actualizar el progreso
        actualizarProgreso();
      }
    }  
    //Enviar la peticion
    xhr.send(datos);
}
//Actualiza avance de proyecto
function actualizarProgreso(){
  //Obtener todas las tareas
  const tareas = document.querySelectorAll('li.tarea');
  //Obtener tareas completadas
  const tareasCompletadas = document.querySelectorAll('i.completo');
  //Determinar el avance
  const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
  //Asignar el avance a la barra
  const porcentaje = document.querySelector('#porcentaje');
  porcentaje.style.width = avance+'%';
  if(avance === 100){
    Swal.fire(
      'Proyecto terminado!',
      'No quedan tareas pendientes.',
      'success'
    )
  }
}