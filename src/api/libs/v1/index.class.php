<?php

class index
{
  static public function error()
  {
    $obj = new stdClass();
    $obj->error = '405 not allowed';
    $obj->statusText = 'The request method ' . $_SERVER['REQUEST_METHOD'] . ' is not allowed';
    http_response_code(405);
    return $obj;
  }

  static public function noPermission()
  {
    $obj = new stdClass();
    $obj->error = '405 not allowed';
    $obj->statusText = 'Your request to use this API has been revoked, please contact the administrator';
    http_response_code(405);
    return $obj;
  }
}
