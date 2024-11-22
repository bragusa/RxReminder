<?php

  $username = $_GET['username'];
  $password = $_GET['password'];

  $invalid = 'Invalid username or password.';
  if(!isset($username) || !isset($password)){
    failure($invalid);
  }
  
  $sql = 'SELECT * FROM users where username = \'' . $username . '\' and password = \'' . $password . '\'';

  $auth_result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($auth_result)<1){
    failure($invalid);
  }

?>