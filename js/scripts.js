eventListeners();
//Lista de proyectos
let listaProyectos = document.querySelector('ul#proyectos');
function eventListeners() {
  //Boton para crear proyecto
  document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
  //Boton para una nueva tarea
  document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
}
function nuevoProyecto(e) {
  e.preventDefault();
  console.log('Presionaste nuevo proyecto');
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
                <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">
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
  if (nombreTarea === '') {
    Swal.fire({
      title: 'Error',
      text: 'Una tarea no puede estar vacía.',
      icon: 'error'
    })
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
        } else {
          //Hubo un error
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error!',
            icon: 'error'
          })
        }
      }
    }
    //Enviar la consulta
    xhr.send(datos);
  }
}