<?php require 'utility.php';?><?php
header("Set-Cookie: auth_token=; Expires=" . gmdate('D, d-M-Y H:i:s T', time() - 3600) . "; Path=/; Secure; HttpOnly; SameSite=None");

session_unset(); // Remove all session variables
session_destroy(); // Destroy the session

if (ini_get("session.use_cookies")) {
  $params = session_get_cookie_params();
  setcookie(session_name(), '', time() - 42000, 
      $params["path"], 
      $params["domain"], 
      $params["secure"], 
      $params["httponly"]
  );
}

success('Logged out'); 
exit();
?>