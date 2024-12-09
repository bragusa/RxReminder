<?php
  if (isset($_COOKIE['auth_token'])) {
    // Get the auth token value (cookieValue.cookieHash)
    $cookie = $_COOKIE['auth_token'];
    list($cookieValue, $cookieHash) = explode('.', $cookie);

    // Verify the hash to ensure it's not tampered with
    $validHash = hash_hmac('sha256', $cookieValue, 'SecretCookieKey_RxReminder');

    if ($cookieHash === $validHash) {
       // The token is valid, now authenticate the user
        // In this case, the $cookieValue could be the username (or any unique value)
      $username = $cookieValue;
      if($username===''){
        $username = $_SESSION['username'];
      }

        // Optionally, you could query the database to verify the username and retrieve the user's details
        // Example: Fetch the user from the database
        // $sql = "SELECT * FROM users WHERE username = '$username'";
        // $result = mysqli_query($conn, $sql);
        // Handle the result...
        
    }
  }
?>