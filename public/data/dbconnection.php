<?php require 'utility.php';?><?php
  header('Content-Type: application/json; charset=utf-8');
  
  ?><?php require '_connectioninfo.php';?><?php

  try {
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
  }
  catch(Exception $e){
    failure('Could not connect: ' . mysqli_error($conn));
  }
 
  if(!$conn ) {
    failure('Could not connect');
  }

?><?php require 'authentication.php';?>
