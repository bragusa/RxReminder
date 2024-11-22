<?php require 'dbconnection.php';?><?php

$medication = $_GET['name'];
$date = $_GET['sort'];

//make sure we have all the data that we require
if(!isset($name) || !isset($sort)){
  print json_encode([ 'status' => 'failed']);
  die('Could not get data. Must supply name and sort.');
}

function set_date($conn, $username, $name, $sort){
  $failed = 'could not update medication.';

  $username = mysqli_real_escape_string($conn, $username);
  $name = mysqli_real_escape_string($conn, $name);
  $sort = (int)mysqli_real_escape_string($conn, $sort);

  //delete old rows
//  $sql = 'delete from medications where username = \'' . $username . '\'';
  try{
    $result = mysqli_query($conn, $sql);
  }
  catch(Exception $e){
    failure($failed);
  }
  
  $sql = 'insert into medications (username, name, sort) values (\'' . $username . '\', \'' . $name . '\', ' . $sort . ')';
  
  $result = mysqli_query($conn, $sql);

  $response = array();

  while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) { //<-----------change this
    $response[] = $row;
  }

  return $response;

}




$response =  set_date($conn, $username, $medication, $date, $marked);
    
print json_encode($response);


mysqli_close($conn);

?>