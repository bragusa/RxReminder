<?php require 'utility.php';?><?php
  header('Content-Type: application/json; charset=utf-8');
  
  $dbhost = 'xxx';
  $dbuser = 'xxx';
  $dbpass = 'xxx';
  $dbname = 'xxx';  

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
