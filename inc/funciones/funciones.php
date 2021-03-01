<?php
//Obtiene la pagina actual que se ejecuta
  function obtenerPaginaActual() {
    $archivo =  basename($_SERVER['PHP_SELF']);
    $pagina =  str_replace(".php", "", $archivo);
    return $pagina;
  }
  /* Consultas */
  /* Obtener todos los proyectos */
  function obtenerProyectos(){
    include 'conexion.php';
    try {
      return $conn->query('SELECT id, nombre FROM proyectos');
    } catch (Exception $e) {
      echo "Error! : " . $e->getMessage();
      return false;
    }
  }
//Obtener el nombre del proyecto
function obtenerNombreProyecto($id = NULL){
  include 'conexion.php';
    try {
    return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
  } catch (Exception $e) {
    echo "Error! : " . $e->getMessage();
    return false;
  }
}
//Obtener las tareas del proyecto
function obtenerTareasDelProyecto($id = NULL){
  include 'conexion.php';
    try {
    return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
  } catch (Exception $e) {
    echo "Error! : " . $e->getMessage();
    return false;
  }
}

?>