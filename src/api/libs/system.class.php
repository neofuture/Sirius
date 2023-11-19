<?php

use Carbon\Carbon;

class system
{
  public static function connectDataset(): PDO
  {

    return new PDO(
      "mysql:host=" . $_ENV['DB_HOST'] . ";dbname=" . $_ENV['DB_NAME'] .';charset=utf8mb4',
      $_ENV['DB_USER'],
      $_ENV['DB_PASS'],
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
      ]
    );
  }

  public static function processHeaders(): void
  {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
      header('Access-Control-Allow-Origin: ' . $_ENV['ALLOW_ORIGIN']);
      header('Access-Control-Allow-Methods: ' . $_ENV['ALLOW_METHODS']);
      header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers, Authorization');
      exit;
    }

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: ' . $_ENV['ALLOW_ORIGIN']);
    header('Access-Control-Allow-Methods: ' . $_ENV['ALLOW_METHODS']);
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  }

  public static function uuid(): string
  {
    return strtolower(sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535)));

  }

  /**
   * @throws Exception
   */
  public static function generateOtp(): string
  {
    return strval(random_int(100000, 999999));
  }

  public static function guid()
  {
    if (function_exists('com_create_guid') === true) {
      return trim(com_create_guid(), '{}');
    }
    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X',
      mt_rand(0, 65535),
      mt_rand(0, 65535),
      mt_rand(0, 65535),
      mt_rand(16384, 20479),
      mt_rand(32768, 49151),
      mt_rand(0, 65535),
      mt_rand(0, 65535),
      mt_rand(0, 65535)
    );
  }

  public static function generatePassword($n): string
  {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $randomString = '';

    for ($i = 0; $i < $n; $i++) {
      $index = rand(0, strlen($characters) - 1);
      $randomString .= $characters[$index];
    }

    return $randomString;
  }

  public static function generateJWT($sub, $csub, $scopes, $ttl = 2592000): string
  {
    $payload = new stdClass();
    $payload->sub = $sub;
    $payload->csub = $csub;
    $payload->iat = time();
    $payload->exp = time() + $ttl;
    $payload->scopes = $scopes;
    return self::jwt($payload);
  }

  public static function jwt($payload): string
  {
    $secret = $_ENV['SECRET'];
    $header = json_encode([
      'typ' => 'JWT',
      'alg' => 'HS256'
    ]);
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
  }

  public static function hashPassword($password): string
  {
    $options = [
      'cost' => 11
    ];
    return password_hash($password, PASSWORD_BCRYPT, $options);
  }

  public static function verifyHash($password, $hash): bool
  {
    return password_verify($password, $hash);
  }

  public static function sendEmail($address, $subject, $template, $content): void
  {
    exec($_ENV['PHP_LOCATION'] . ' sendemail.php "' . $address . '" "' . $subject . '" "' . $template . '" \'' . json_encode($content) . '\' >/dev/null 2>&1 &');
    file_put_contents('logs/email.log',
      $_ENV['PHP_LOCATION'] . ' sendemail.php "' . $address . '" "' . $subject . '" "' . $template . '" \'' . json_encode($content) . '\' >/dev/null 2>&1 &' ."\n",
      FILE_APPEND);
  }

  public static function sendSMS($number, $template, $content): void
  {
    exec($_ENV['PHP_LOCATION'] . ' sendsms.php "' . $number . '" "' . $template . '" \'' . json_encode($content) . '\' >/dev/null 2>&1 &');
  }

  public static function base64UrlEncode($text): array|string
  {
    return str_replace(
      ['+', '/', '='],
      ['-', '_', ''],
      base64_encode($text)
    );
  }

  static public function getUser()
  {
    $sub = system::getSub();
    $account = system::query("SELECT * FROM users WHERE id = ?", [$sub]);
    if ($account) {
      return $account[0];
    }
  }

  static public function getSub(): ?string
  {
    $bearerToken = system::getBearerToken();
    if (!$bearerToken) {
      $obj = new stdClass();
      $obj->success = false;
      $obj->error = '401 Unauthorized';
      $obj->statusText = 'The request requires user authentication';
      http_response_code(401);
      echo json_encode($obj);
      exit;
    }
    $token = system::validateJwt($bearerToken);
    $account = system::query(
      "SELECT id FROM users WHERE id = ? AND status NOT LIKE 'suspended' LIMIT 1",
      [$token['payload']->sub]
    );
    if ($token["expired"] === "false" && $token["signatureValid"] === "true" && $account) {
      return $token['payload']->sub;
    } else {
      $obj = new stdClass();
      $obj->success = false;
      $obj->error = '401 Unauthorized';
      $obj->statusText = 'The request requires user authentication';
      http_response_code(401);
      echo json_encode($obj);
      exit;
    }
  }
  static public function getSubComplete(): stdClass
  {
    $bearerToken = system::getBearerToken();
    if (!$bearerToken) {
      $obj = new stdClass();
      $obj->success = false;
      $obj->error = '401 Unauthorized';
      $obj->statusText = 'The request requires user authentication';
      http_response_code(401);
      echo json_encode($obj);
      exit;
    }
    $token = system::validateJwt($bearerToken);
    if ($token["expired"] === "false" && $token["signatureValid"] === "true") {
      return $token['payload'];
    } else {
      $obj = new stdClass();
      $obj->success = false;
      $obj->error = '401 Unauthorized';
      $obj->statusText = 'The request requires user authentication';
      http_response_code(401);
      echo json_encode($obj);
      exit;
    }
  }

  public static function isAdmin($sub){
    return system::query("SELECT user_group FROM users WHERE id = ? AND user_group = 'b288d972-c2ab-4ee1-a81b-93ffd55f3a93'", [$sub])[0]['user_group'] === 'b288d972-c2ab-4ee1-a81b-93ffd55f3a93';
  }
  public static function checkUserAccess($allowances)
  {
    $account = system::query(
      "SELECT user_groups.permissions FROM users, user_groups WHERE users.id = ? AND users.user_group = user_groups.id",
      [system::getSub()]
    );
    $method = debug_backtrace()[2]['class'];
    if ($account) {
      return json_decode($account[0]['permissions'])->$method->$allowances === true;
    }
    return false;
  }

  public static function getBearerToken(): ?string
  {
    $headers = system::getAuthorizationHeader();
    if (!empty($headers)) {
      if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        if ($matches[1] !== 'false') {
          return $matches[1];
        }
      }
    }
    return false;
  }

  public static function getAuthorizationHeader(): ?string
  {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
      $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
      $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
      $requestHeaders = apache_request_headers();
      $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
      if (isset($requestHeaders['Authorization'])) {
        $headers = trim($requestHeaders['Authorization']);
      }
    }
    return $headers;
  }

  public static function validateJwt($jwt): array
  {

    $secret = $_ENV['SECRET'];
    $tokenParts = explode('.', $jwt);
    $header = base64_decode($tokenParts[0]);
    $payload = base64_decode($tokenParts[1]);
    $signatureProvided = $tokenParts[2];
    $expiration = @Carbon::createFromTimestamp(json_decode($payload)->exp);
    $tokenExpired = (Carbon::now()->diffInSeconds($expiration, false) < 0);
    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64UrlEncode($signature);
    $signatureValid = ($base64UrlSignature === $signatureProvided);

    $result['header'] = json_decode($header);
    $result['payload'] = json_decode($payload);

    if ($tokenExpired) {
      $result['expired'] = 'true';
    } else {
      $result['expired'] = 'false';
    }

    if ($signatureValid) {
      $result['signatureValid'] = 'true';
    } else {
      $result['signatureValid'] = 'false';
    }
    return $result;
  }

  public static function query($sql, $args): bool|array
  {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($args);
    $results = $stmt->fetchAll();
    return count($results) > 0 ? $results : false;
  }

  public static function getDate($date, $formatted = true): string
  {
    if ($formatted) {
      return date_format(
        date_create($date),
        "l\, j\<\s\u\p>S\<\/\s\u\p\> F Y \a\\t g:i:s a"
      );
    } else {
      return date_format(
        date_create($date),
        "l\, jS F Y \a\\t g:i:s a"
      );
    }
  }

  public static function generateToken($status, $sub, $clearPerms) {


    global $request;

    $account = system::query(
      "SELECT users.id,
                  companies.id as company_id,
                  companies.name as company_name,
                  users.password,
                  users.status_email,
                  users.status_mobile,
                  users.email,
                  users.mobile,
                  users.forename,
                  users.surname,
                  users.user_group,
                  users.avatar,
                  user_groups.name,
                  user_groups.permissions,
                  users.user_settings
             FROM users, user_groups, companies
            WHERE users.id = ?
              AND companies.id = users.company_id
              AND users.user_group = user_groups.id LIMIT 1",
      [$sub]
    );

    $scopes = new stdClass();
    $scopes->user_group = $account[0]['name'];
    $scopes->status_email = $account[0]['status_email'];
    $scopes->status_mobile = $account[0]['status_mobile'];
    $scopes->forename = $account[0]['forename'];
    $scopes->surname = $account[0]['surname'];
    $scopes->company_name = $account[0]['company_name'];
    $scopes->email = $account[0]['email'];
    $scopes->mobile = $account[0]['mobile'];
    $scopes->avatar = $account[0]['avatar'];
    $scopes->user_settings = json_decode($account[0]['user_settings']);
    if($clearPerms) {
      $scopes->permissions = [];
    } else {
      $scopes->permissions = json_decode($account[0]['permissions']);
    }
    $scopes->login_status = $status;
    return system::generateJWT($account[0]['id'], $account[0]['company_id'], $scopes);
  }
}

