<?php 
  session_start();

  $expires = time() + 600; //only 10 minutes

  function failure($reason){
    print json_encode([ 'status' => 'failed', 'reason' => $reason]);
    die('');
  }

  function success($result){
    print json_encode([ 'status' => 'success', 'result' => $result]);
    die('');
  }

  // function setAuthCookie($expires, $write_cookie) {
  //   error_log($write_cookie);
  //   $_SESSION['username'] = $username;

  //   $sessionid = $SESSION_ID;
  
  //   // error_log(basename($_SERVER['PHP_SELF']) . '    Username=' . $_SESSION['username'] . '    sessionid=' . session_id(), 0);
  
  
  //   if(!strpos($_SERVER['HTTP_REFERER'], 'southshoreweb')){
  //     $cookieValue = $username;
  //   }
  
  //   $cookieHash = hash_hmac('sha256', $cookieValue, 'SecretCookieKey_RxReminder');
  
  //   //$cookieValue = "$cookieValue.$cookieHash";
  //   $cookieValue = rawurlencode("$cookieValue.$cookieHash.$expires");
    
  //   //$expires = time() + 600; //only 10 minutes
    
  //   header("Set-Cookie: auth_token=$cookieValue; Expires=" . gmdate('D, d-M-Y H:i:s T', $expires) . "; Path=/; Secure; HttpOnly; SameSite=None");

  //   if($write_cookie){

  //       // Create an array with the desired name-value pair
  //       $response = [
  //         'status' => 'success',
  //         'result' => 'authenticated',
  //         'expires' => $expires * 1000
  //       ];
  //       // Send the response as JSON
  //       print json_encode($response);
  //   }

  // }

  // setAuthCookie($expires, false);
?>