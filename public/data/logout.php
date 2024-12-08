<?php require 'utility.php';?><?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Set-Cookie: auth_token=; Expires=" . gmdate('D, d-M-Y H:i:s T', time() - 3600) . "; Path=/; Secure; HttpOnly; SameSite=None");

session_start(); // Start the session
session_unset(); // Remove all session variables
session_destroy(); // Destroy the session
success('Logged out'); 
exit();
?>