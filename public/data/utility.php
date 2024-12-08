<?php 
// List of allowed domains
// $allowedOrigins = ['http://localhost:3000', 'http://southshoreweb.com'];

// // Get the 'Origin' header from the request
// $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// // Check if the request's origin is in the allowed list
// if (in_array($origin, $allowedOrigins)) {
//     header("Access-Control-Allow-Origin: $origin");  // Allow the matching origin
// }

// header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allowed methods
// header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allowed headers
// header('Access-Control-Allow-Credentials: true'); // Allow credentials (cookies)

// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
//     // Respond with 200 OK for OPTIONS requests
//     http_response_code(200);
//     exit();
// }


    function failure($reason){
      print json_encode([ 'status' => 'failed', 'reason' => $reason]);
      die('');
    }

    function success($result){
      print json_encode([ 'status' => 'success', 'result' => $result]);
      die('');
    }
?>