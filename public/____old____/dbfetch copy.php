<?php
header('Content-Type: application/json; charset=utf-8');
$dbhost = 'localhost';//'southshoreweb.com:3036';
$dbuser = 'southsho_admin';
$dbpass = 'SouthShoreWeb_Admin';
$dbname = 'southsho_medications';

try {
   $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
}
catch(Exception $e){
   echo('Exception Could not connect:');
}

if(! $conn ) {
   die('Could not connect: ' . mysqli_error());
}

function fetch_table($conn, $table_name, $username){
   $sql = 'SELECT * FROM ' . $table_name;

   if(!empty($username)){
      $sql .= ' WHERE username = \'' . $username . '\'';
   }
   
   try{
      $retval = mysqli_query($conn, $sql);
   }
   catch(Exception $e){
      echo('Exception Could not get data:');
   }

   if(! $retval ) {
      die('Could not get data: ' . mysqli_error());
   }

   $response = array();

   while ($row = mysqli_fetch_array($retval, MYSQLI_ASSOC)) { //<-----------change this
      $response[] = $row;
   }

   return $response;
}


$response =  fetch_table($conn, $_GET['table'], $_GET['username']);

print json_encode($response);

mysql_close($conn);
?>