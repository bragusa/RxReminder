<?php 
  header('Content-Type: application/json; charset=utf-8');
  $dbhost = 'localhost';
  $dbuser = 'southsho_admin';
  $dbpass = 'SouthShoreWeb_Admin';
  $dbname = 'southsho_medications';  

  try {
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
  }
  catch(Exception $e){
    print json_encode([ 'status' => 'failed']);
    die('Exception Could not connect:');
  }
 
  if(! $conn ) {
    print json_encode([ 'status' => 'failed']);
    die('Could not connect: ' . mysqli_error());
  }

?>?><?php require 'authentication.php';?><?php