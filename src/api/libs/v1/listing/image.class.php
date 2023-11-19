<?php

class image
{
  static public function post(): stdClass
  {
    global $request;

    $obj = new stdClass();
    $uuid = system::uuid();

    $image = str_replace('data:image/png;base64,', '', $request->file);
    $image = str_replace('data:image/gif;base64,', '', $image);
    $image = str_replace('data:image/jpeg;base64,', '', $image);
    $image = str_replace('data:image/webp;base64,', '', $image);
    $image = str_replace(' ', '+', $image);
    $image = base64_decode($image);
    mkdir('../uploads/' . $uuid);
    file_put_contents('../uploads/' . $uuid .'/'. $request->name, $image);
    $obj->sucess = true;
    $obj->path = 'uploads/' . $uuid .'/'. $request->name;
    return $obj;
  }

  static public function delete(): stdClass
  {
    global $request;
    $obj = new stdClass();
    $obj->request = $request['path'];
    $obj->sucess = true;
    unlink('../' . $request['path']);
    $parts = explode('/', $request['path']);
    rmdir('../' . $parts[0] . '/' . $parts[1]);
    return $obj;
  }

}
