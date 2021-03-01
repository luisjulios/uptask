eventListeners();
function eventListeners() {
  document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}
function validarRegistro(e) {
  e.preventDefault();
  let usuario = document.querySelector('#usuario').value,
      password = document.querySelector('#password').value,
      tipo = document.querySelector('#tipo').value;
      if (usuario === '' || password === '') {
        //La validacion falló
              Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Usuario/password son obligatorios.',
            });
      } else {
        //Ambos campos son correctos

        //Datos que se envian al servidor
        let datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //Llamar a AJAX
        let xhr = new XMLHttpRequest();

        //Abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        //Retorno de datos
        xhr.onload = function() {
          if(this.status === 200) {
            let respuesta = JSON.parse(xhr.responseText);
            //Si la respuesta es correcta
            if (respuesta.respuesta === 'correcto') {
              //Si es un nuevo usuario
              if (respuesta.tipo === 'crear') {
                Swal.fire({
                  title: 'Usuario creado',
                  text: 'El usuario se creó correctamente',
                  icon: 'success'
                });
              } else if (respuesta.tipo === 'login'){
                Swal.fire({
                  title: 'Login correcto',
                  text: 'Presiona OK para abrir el dashboard',
                  icon: 'success'
                })
                .then(resultado =>{
                  if (resultado.value) {
                    window.location.href = 'index.php';
                  }
                });
              }
            }else {
              //Hubo un error
              Swal.fire({
                title: 'Error',
                text: 'Hubo un error',
                icon: 'error'
              });
            }
          }
        }

        //Enviar la petición
        xhr.send(datos);
      }
}
