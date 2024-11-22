<?php require 'mydbconnection.php';?><?php

$transation = $_GET['transaction'];

if(!isset($transation)){
  print json_encode([ 'status' => 'failed']);
  die('Could not get data. Must supply transaction.');
}

?><?php require 'dbfunctions.php';?><?php

$table = $_GET['table'];
$username = $_GET['username'];
$password = $_GET['password'];
$medication = $_GET['medication'];
$date = $_GET['date'];
$marked = $_GET['marked'];

?><?php require 'authentication.php';?><?php
switch ($transation) {
  case 'markdate':
    //make sure we have all the data that we require
    if(!isset($username) || !isset($medication) || !isset($date) || !isset($marked)){
      print json_encode([ 'status' => 'failed']);
      die('Could not get data. Must supply username, medication, date, and marked.');
    }
    set_date($conn, $username, $medication, $date, $marked);
    break;
   case 'fetch':
    $table = $_GET['table'];
    $username = $_GET['username'];
    $password = $_GET['password'];
    if(!isset($username) || !isset($table)  || !isset($password)){
      print json_encode([ 'status' => 'failed']);
      die('Could not get data. Must supply username and table.');
    }
    
    $response =  fetch($conn, $_GET['table'], $_GET['username']);
    
    print json_encode($response);
    break;
}

mysql_close($conn);

?>