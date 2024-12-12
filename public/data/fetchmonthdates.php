<?php require 'dbconnection.php';?><?php require 'authentication.php';?><?php

$seed_date = $_GET['seed_date'];
$medication = $_GET['medication'];

//make sure we have all the data that we require
if(!isset($username) || !isset($seed_date) || !isset($medication)){
  print json_encode([ 'status' => 'failed', 'reason' => 'Could not get data. Must supply seed date and medication.']);
  die('');
}

function fetch($conn, $username, $medication, $seed_date){

  $sql = "SELECT * FROM dates WHERE username = '" . $username . 
  "' AND medication = '" . $medication .
  "' AND date BETWEEN DATE_FORMAT(DATE_SUB('" . $seed_date . "', INTERVAL 1 MONTH), '%Y-%m-01') AND LAST_DAY(DATE_ADD('" . $seed_date . "', INTERVAL 1 MONTH)) order by date";

  error_log('fetchmonthdates');
  error_log($sql);

  try{
    $retval = mysqli_query($conn, $sql);
  }
  catch(Exception $e){

    die('');
  }

  if(! $retval ) {
    die('Could not get data: ' . mysqli_error($conn));
  }

  $response = array();

  while ($row = mysqli_fetch_array($retval, MYSQLI_ASSOC)) {
    $response[] = $row;
  }

  return $response;
}


$response =  fetch($conn, $username, $medication, $seed_date);
    
print json_encode($response);

mysqli_close($conn);

?>