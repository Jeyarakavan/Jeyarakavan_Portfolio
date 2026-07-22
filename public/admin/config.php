<?php
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!getenv($name)) {
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
        }
    }
}

loadEnv(__DIR__ . '/../../.env');
loadEnv(__DIR__ . '/../.env');
loadEnv(__DIR__ . '/.env');

define('ADMIN_USER', getenv('ADMIN_USER') ?: 'admin');
define('ADMIN_PASS_HASH', getenv('ADMIN_PASSWORD_HASH') ?: '$2y$10$wN9a.H7R0R.p0Qz6x6T87e8s9XwF8Yg4Vb9F3K7M1N5O3P6Q9R2S0');

define('NOTIFICATION_EMAIL', getenv('NOTIFICATION_EMAIL') ?: 'jeyagandan74@gmail.com');

define('DB_DRIVER', getenv('DB_DRIVER') ?: 'sqlite');
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'portfolio_db');
define('DB_USER', getenv('DB_USER') ?: 'postgres');
define('DB_PASS', getenv('DB_PASS') ?: '');

define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: '587');
define('SMTP_USER', getenv('SMTP_USER') ?: 'jeyagandan74@gmail.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
if (!file_exists(UPLOAD_DIR)) {
    @mkdir(UPLOAD_DIR, 0777, true);
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
