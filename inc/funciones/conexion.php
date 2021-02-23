<?php
  $conn = new mysqli('localhost', 'root', 'root', 'uptask', 8889);
  

  if ($conn->connect_error) {
    echo $conn->connect_error;
  }





  $conn->set_charset('utf-8');
?>