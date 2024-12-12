<?php require 'dbconnection.php';?><?php require 'authentication.php';?><?php

$medication = $_GET['medication'];
$date = $_GET['date'];
$marked = $_GET['marked'];

//make sure we have all the data that we require
if(!isset($username) || !isset($medication) || !isset($date) || !isset($marked)){
  print json_encode([ 'status' => 'failed']);
  die('Could not get data. Must supply username, password, medication, date, and marked.');
}

function set_date($conn, $username, $medication, $date, $marked){
  $failed = 'could not update date marker.';

  $username = mysqli_real_escape_string($conn, $username);
  $medication = mysqli_real_escape_string($conn, $medication);
  $date = mysqli_real_escape_string($conn, $date);
  $marked = mysqli_real_escape_string($conn, $marked);

  //delete old row if it exists
  $sql = 'delete from dates where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'';
  try{
    $result = mysqli_query($conn, $sql);
  }
  catch(Exception $e){
    failure($failed);
  }
  //add row
  if($marked!=0){
    $sql = 'insert into dates (username, medication, date, marked) values (\'' . $username . '\', \'' . $medication . '\', \'' . $date . '\', \'' . $marked . '\')';
    $result = mysqli_query($conn, $sql);
  }
  
  $sql = 'select * from dates where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'';

  $retval = mysqli_query($conn, $sql);

  $sql = "SELECT * FROM dates WHERE username = '" . $username . 
    "' AND medication = '" . $medication .
    "' AND date BETWEEN DATE_FORMAT(DATE_SUB('" . $date . "', INTERVAL 1 MONTH), '%Y-%m-01') AND LAST_DAY(DATE_ADD('" . $date . "', INTERVAL 1 MONTH)) order by date";
  
  $retval = mysqli_query($conn, $sql);

  $response = array();

  while ($row = mysqli_fetch_array($retval, MYSQLI_ASSOC)) {
    $response[] = $row;
  }

  return $response;

}


$response = set_date($conn, $username, $medication, $date, $marked);
    
print json_encode($response);

mysqli_close($conn);

?>