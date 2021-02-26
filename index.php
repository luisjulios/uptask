<?php 
include 'inc/funciones/sesiones.php';
include 'inc/funciones/funciones.php';
include 'inc/templates/header.php';
include 'inc/templates/barra.php';
//Obtener el ID de la URL
if (isset($_GET['id_proyecto'])) {
    $id_proyecto = $_GET['id_proyecto'];
}
?>


<div class="contenedor">
<?php include 'inc/templates/sidebar.php';?>

    <main class="contenido-principal">
    <?php
            $proyecto = obtenerNombreProyecto($id_proyecto);
            if($proyecto):
    ?>
        <h1>Proyecto actual:
            <?php foreach ($proyecto as $nombre): ?>
                <span><?php echo $nombre['nombre']; ?></span>
        <?php endforeach; ?>
        </h1>

        <form action="#" class="agregar-tarea">
            <div class="campo">
                <label for="tarea">Tarea:</label>
                <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
            </div>
            <div class="campo enviar">
                <input type="hidden" value="<?php echo $id_proyecto; ?>" id="id_proyecto">
                <input type="submit" class="boton nueva-tarea" value="Agregar">
            </div>
        </form>
        <?php
        else:
            //Si no hay proyectos seleccionados
            echo "<h2>Seleciona un proyecto</h2>";
        endif;
        ?>

        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>

                <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                <p>Cambiar el Logotipo</p>
                    <div class="acciones">
                        <i class="far fa-check-circle"></i>
                        <i class="fas fa-trash"></i>
                    </div>
                </li>  
            </ul>
        </div>
    </main>
</div><!--.contenedor-->
<?php include 'inc/templates/footer.php'?>