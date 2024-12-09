<?php 
session_set_cookie_params([
    'lifetime' => 0,            // Session cookie
    'path' => '/',
    'domain' => 'yourdomain.com',
    'secure' => true,           // Required for SameSite=None
    'httponly' => true,         // Optional, adds extra security
    'samesite' => 'None'        // Options: None, Lax, or Strict
]);

session_start();

?><? phpinfo(); ?>