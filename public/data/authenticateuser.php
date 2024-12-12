<?php require 'utility.php';?><?php require 'authentication.php';?><?php

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

  
  //$sessionHash = hash_hmac('sha256', $username, 'SecretCookieKey_RxReminder');

  // session_id('bragusa');
    
  $_SESSION['username'] = $username;

  $sessionid = $SESSION_ID;

  // error_log(basename($_SERVER['PHP_SELF']) . '    Username=' . $_SESSION['username'] . '    sessionid=' . session_id(), 0);


  if(!strpos($_SERVER['HTTP_REFERER'], 'southshoreweb')){
    $cookieValue = $username;
  }

  $cookieHash = hash_hmac('sha256', $cookieValue, 'SecretCookieKey_RxReminder');

  //$cookieValue = "$cookieValue.$cookieHash";
  $cookieValue = rawurlencode("$cookieValue.$cookieHash.$expires");
  
  //$expires = time() + 600; //only 10 minutes
  
  header("Set-Cookie: auth_token=$cookieValue; Expires=" . gmdate('D, d-M-Y H:i:s T', $expires) . "; Path=/; Secure; HttpOnly; SameSite=None");


  error_log("Expires timestamp: $expires");
  error_log("Formatted date: " . gmdate('D, d-M-Y H:i:s T', $expires));

    // Create an array with the desired name-value pair
    $response = [
      'status' => 'success',
      'result' => 'authenticated',
      'expires' => $expires * 1000
  ];

  // Send the response as JSON
  print json_encode($response);

//  success('authenticated ' . $username);
//  print json_encode([ 'status' => 'success', 'result' => $result]);
?>