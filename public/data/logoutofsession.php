<?php
require 'utility.php';  // Include utility functions

// Check if the auth cookie exists and clear it
if (isset($_COOKIE['auth_cookie'])) {
    setcookie('auth_cookie', '', time() - 3600, '/');  // Expire the auth_cookie
    unset($_COOKIE['auth_cookie']);  // Unset it from $_COOKIE array for the current request
}

// Clear the PHP session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');  // Expire the session cookie
}

// Start the session and destroy it
session_start();  // Start the session
session_unset();  // Unset session variables
session_destroy();  // Destroy the session

// Optional: Output success message (for debugging)
success('Logged out');

// Redirect the user to the login page or homepage after logout
header('Location: /login.php');  
exit();  // Always call exit after header() to stop further execution
?>
