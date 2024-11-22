<?php
die(''); //This is no longer used.  Use transaction.php instead.
//make sure we have all the data that we require
if(!isset($_GET['username']) || !isset($_GET['medication']) || !isset($_GET['date']) || !isset($_GET['marked'])){
   print json_encode([ 'status' => 'failed']);
   die('Could not get data. Must supply username, medication, date, and marked.');
}
?><?php require 'mydbconnection.php';?><?


function set_date($conn, $username, $medication, $date, $marked){
   $username = mysqli_real_escape_string($conn, $username);
   $medication = mysqli_real_escape_string($conn, $medication);
   $date = mysqli_real_escape_string($conn, $date);
   $marked = mysqli_real_escape_string($conn, $marked);
   //$sql = 'select * from dates where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'';
   $sql = 'delete from dates where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'';
   try{
      $result = mysqli_query($conn, $sql);
      //$rowcount = mysqli_num_rows($result);
   }
   catch(Exception $e){
      print json_encode([ 'status' => 'failed']);
      die('Exception Could not get data or count for date update.');
   }
   try{
      // if($rowcount == 0){
         $sql = 'insert into dates (username, medication, date, marked) values (\'' . $username . '\', \'' . $medication . '\', \'' . $date . '\', \'' . $marked . '\')';
      // }
      // else {
      //    $sql = 'update dates set marked = ' . $marked .
      //    ' where username = \'' . $username . '\' and medication = \'' . $medication . '\' and date = \'' . $date . '\'' ;
      // }
      print json_encode($sql);
      $result = mysqli_query($conn, $sql);


      $result = mysqli_query($conn, $sql);
   }
   catch(Exception $e){
      die('Exception Could not insert/update for date update. ' . $sql);
   }
}


set_date($conn, $_GET['username'], $_GET['medication'], $_GET['date'], $_GET['marked']);

mysqli_close($conn);

print json_encode([ 'status' => 'success' ]);

?>