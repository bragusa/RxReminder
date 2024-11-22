<?php require 'mydbconnection.php';?><?php

$username = $_GET['username'];
$password = $_GET['password'];
$medication = $_GET['medication'];
$date = $_GET['date'];
$marked = $_GET['marked'];

//make sure we have all the data that we require
if(!isset($username) || !isset($password) || !isset($medication) || !isset($date) || !isset($marked)){
  print json_encode([ 'status' => 'failed']);
  die('Could not get data. Must supply username, password, medication, date, and marked.');
}

fatch


?><?php require 'dbfunctions.php';?><?php

set_date($conn, $username, $medication, $date, $marked);

mysql_close($conn);

?>