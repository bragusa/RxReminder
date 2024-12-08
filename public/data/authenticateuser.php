<?php require 'utility.php';?><?php require 'authentication.php';?><?php

// Allow credentials (cookies, authorization headers)
//header('Access-Control-Allow-Credentials: true');

  // header('Content-Type: application/json; charset=utf-8');
  // header('Access-Control-Allow-Origin: *');

  $invalid = 'Invalid username or password.';

  $sql = 'SELECT * FROM users where username = \'' . $username . '\'';



  if(!isset($username)){
    $username = $_POST['username'];
    $password = $_POST['password'];
    if(!isset($username) || !isset($password)){
      failure($invalid);
    }
    $sql = 'SELECT * FROM users where username = \'' . $username . '\' and password = \'' . $password . '\'';
  }

  $dbhost = 'localhost';
  $dbuser = 'southsho_admin';
  $dbpass = 'SouthShoreWeb_Admin';
  $dbname = 'southsho_medications';  

  try {
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
  }
  catch(Exception $e){
    failure('Could not connect: ' . mysqli_error($conn));
  }
 
  if(!$conn ) {
    failure('Could not connect');
  }

  $auth_result = mysqli_query($conn, $sql);

  
  if(mysqli_num_rows($auth_result)<1){
    failure($invalid);
  }



  $cookieValue = $username;

  $cookieHash = hash_hmac('sha256', $cookieValue, 'SecretCookieKey_RxReminder');

  $cookieValue = "$cookieValue.$cookieHash";
  
  $expires = time() + 600; //only 10 minutes
  
  header("Set-Cookie: auth_token=$cookieValue; Expires=" . gmdate('D, d-M-Y H:i:s T', $expires) . "; Path=/; Secure; HttpOnly; SameSite=None");
  success('authenticated');
?>