<?php
$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion === 'crear') {
  //Código para crear los administradores
  //Hashear passwords
  $opciones = array(
    'cost' => 12
  );
  $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
  //Importar la conexion
  include '../funciones/conexion.php';
  try {
    //Realizar la consulta en la base de datos
    $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
    $stmt->bind_param('ss', $usuario, $hash_password);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
      $respuesta = array(
        'respuesta' => 'correcto',
        'id_insertado' => $stmt->insert_id,
        'tipo' => $accion
      );
    } else {
      $respuesta = array (
        'respuesta' => 'error'
      );
    }
    $stmt->close();
    $conn->close();
  } catch (Exception $e) {
    //En caso de que haya un error, tomar la excepcion
    $respuesta = array(
      'error' => $e->getMessage()
    );
  }

  echo json_encode($respuesta);
}

if ($accion === 'login') {
  //Escribir código para loguear a los administradores
  include '../funciones/conexion.php';

  try {
    //Seleccionar el administrador de la base de datos
    $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    //Loguear al usuario
    $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
    $stmt->fetch();
    if ($nombre_usuario) {
      //El usuario existe, verificar el password
      if (password_verify($password, $pass_usuario)) {
        //Iniciar la sesion
        session_start();
        $_SESSION['nombre'] = $usuario;
        $_SESSION['id'] = $id_usuario;
        $_SESSION['login'] = true;
        //Login correcto
        $respuesta = array(
            'respuesta' => 'correcto',
            'nombre' => $nombre_usuario,
            'tipo' => $accion
          );
      }else{
        //Login incorrecto, enviar error
        $respuesta = array(
          'resultado' => 'Password incorrecto'
        );
      }
    } else {
      $respuesta = array (
        'error' => 'Usuario no existe'
      );
    }


    $stmt->close();
    $conn->close();
  } catch (Exception $e) {
    //En caso de que haya un error, tomar la excepcion
    $respuesta = array(
      'pass' => $e->getMessage()
    );
  }
  echo json_encode($respuesta);
}

?>