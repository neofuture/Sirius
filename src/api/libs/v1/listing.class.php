<?php

class listing
{
  public static function index(): stdClass
  {
    return match ($_SERVER['REQUEST_METHOD']) {
      default => index::error(),
    };
  }

  public static function image(): stdClass
  {
    return match ($_SERVER['REQUEST_METHOD']) {
      'POST' => image::post(),
      'DELETE' => image::delete(),
      default => index::error(),
    };
  }
}
