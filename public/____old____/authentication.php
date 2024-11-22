<?php
  if(!isset($username) || !isset($password)){
    print json_encode([ 'status' => 'failed']);
    die('Could not get data. Must supply username and password.');
  }
  
  $sql = 'SELECT count(*) FROM users where username = \'' . $username . '\' and password = \'' . $password . '\'';

  $auth_result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($auth_result)<1){
    die('Could not authenticate user.');
  }

  print json_encode($response);
?>