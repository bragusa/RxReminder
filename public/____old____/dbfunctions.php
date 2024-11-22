<?php

  function fetch($conn, $table_name, $username){
    $sql = 'SELECT * FROM ' . $table_name;

    if(!empty($username)){
      $sql .= ' WHERE username = \'' . $username . '\'';
    }
    
    try{
      $retval = mysqli_query($conn, $sql);
    }
    catch(Exception $e){
      die('Could not get data:');
    }

    if(! $retval ) {
      die('Could not get data: ' . mysqli_error());
    }

    $response = array();

    while ($row = mysqli_fetch_array($retval, MYSQLI_ASSOC)) { //<-----------change this
      $response[] = $row;
    }

    return $response;
  }

  function set_date($conn, $username, $medication, $date, $marked){
    $username = mysqli_real_escape_string($conn, $username);
    $medication = mysqli_real_escape_string($conn, $medication);
    $date = mysqli_real_escape_string($conn, $date);
    $marked = mysqli_real_escape_string($conn, $marked);
    //$sql = 'select * from dates where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'';
    $sql = 'delete from dates where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'';
    try{
      $result = mysqli_query($conn, $sql);
      //$rowcount = mysqli_num_rows($result);
    }
    catch(Exception $e){
      print json_encode([ 'status' => 'failed']);
      die('Exception Could not get data or count for date update.');
    }

    $sql = 'insert into dates (username, medication, date, marked) values (\'' . $username . '\', \'' . $medication . '\', \'' . $date . '\', \'' . $marked . '\')';
    print json_encode($sql);
    $result = mysqli_query($conn, $sql);

    if(!$result){
      print json_encode([ 'status' => 'failed']);
      die('Could not get data or count for date update.');
    }
  }


?>