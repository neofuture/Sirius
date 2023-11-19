<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('max_execution_time', 300);
require 'vendor/autoload.php';

use Dotenv\Dotenv;

const BASE_DIR = __DIR__;
$dotenv = Dotenv::createImmutable(__DIR__);
try {
  $dotenv->load();
} catch (Exception) {
  $status['error'] = '404 env not found';
  $status['statusText'] = '.env file was not found';
  http_response_code(404);
  echo json_encode($status);
  exit;
}

$classMethodDirectories = [
  BASE_DIR . '/libs/',
  BASE_DIR . '/libs/v1/',
  BASE_DIR . '/libs/v1/listing/',
];

spl_autoload_register(function ($class) use ($classMethodDirectories) {
  foreach ($classMethodDirectories as $dir) {
    $file = $dir . str_replace('\\', '/', $class) . '.class.php';
    if (file_exists($file)) {
      require_once $file;
    }
  }
});

system::processHeaders();
$request = json_decode(file_get_contents('php://input'));
foreach ($_REQUEST as $key => $value) {
  $request[$key] = $value;
}
$uri = explode("/", trim(explode("?", $_SERVER['REQUEST_URI'])[0], '/'));
array_shift($uri);

if ($uri[0] === 'v1') {

  if (!array_key_exists(1, $uri)) {
    $status['error'] = "Empty Request";
    echo json_encode($status);
    exit;
  }

  if (!class_exists($uri[1])) {
    $status['error'] = '405 class not found';
    $status['statusText'] = 'The class requested does not exist';
    http_response_code(405);
    echo json_encode($status);
    exit;
  }

  if (!array_key_exists(2, $uri)) {
    $uri[2] = 'index';
  }

  if (!method_exists($uri[1], $uri[2])) {
    $status['error'] = '405 method not found';
    $status['statusText'] = 'The method requested does not exist within the chosen class';
    $status['uri'] = $uri;
    http_response_code(405);
    echo json_encode($status);
    exit;
  }

  $pdo = system::connectDataset();
  $status = call_user_func([$uri[1], $uri[2]]);

} else {
  $status['error'] = 'Version Unsupported';
}

echo json_encode($status);
function base64UrlEncode($text): array|string
{
  return str_replace(
    ['+', '/', '='],
    ['-', '_', ''],
    base64_encode($text)
  );
}
