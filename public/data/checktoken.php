<?php require 'utility.php';?><?php 
  header('Content-Type: application/json; charset=utf-8');
  if (isset($_COOKIE['auth_token'])) {
    // Retrieve the cookie value
    $cookieValue = $_COOKIE['auth_token'];

    error_log($cookieValue);

    //$expires = 
    // Split the cookie value to get the original value, hash, and expiration
    list($originalValue, $cookieHash, $expires) = explode('.', $cookieValue);

    error_log('expires='.$expires);

    // Check if the current time is past the expiration time
    if (time() > $expires) {
      failure('auth_token_expired');
    } else {
      success('auth_token_active');
    }
  }
?>