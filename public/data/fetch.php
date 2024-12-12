<?php require 'dbconnection.php';?><?php require 'authentication.php';?><?php

$table_name = $_GET['tablename'];
$order_by = $_GET['orderby'];
$columns = $_GET['columns'];

//make sure we have all the data that we require
if(!isset($table_name) || !isset($username)){
  print json_encode([ 'status' => 'failed', 'reason' => 'Could not get data. Must supply tablename.']);
  die('');
}

function fetch($conn, $table_name, $username, $order_by){

  if($table_name==='users'){
    $sql = 'SELECT name, username FROM ' . $table_name . ' WHERE username = \'' . $username . '\'';
  }
  else {
    $sql = 'SELECT * FROM ' . $table_name . ' WHERE username = \'' . $username . '\'';
  }

  if(!empty($order_by)){
    $sql .= ' ORDER BY ' . $order_by;
  }

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

  while ($row = mysqli_fetch_array($retval, MYSQLI_ASSOC)) { //<-----------change this
    $response[] = $row;
  }

  return $response;
}


$response =  fetch($conn, $table_name, $username, $order_by);
    
print json_encode($response);

mysqli_close($conn);

?>