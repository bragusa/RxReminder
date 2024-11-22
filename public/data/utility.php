<?php 
    function failure($reason){
      print json_encode([ 'status' => 'failed', 'reason' => $reason]);
      die('');
    }

    function success($result){
      print json_encode([ 'status' => 'success', 'result' => $result]);
      die('');
    }
?>