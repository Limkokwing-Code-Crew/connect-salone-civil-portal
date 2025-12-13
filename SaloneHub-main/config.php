<?php
/**
 * SaloneHub Database Configuration
 * Works on localhost (XAMPP/WAMP) and InfinityFree hosting
 */
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'salonehub';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';

$dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    // Don't expose DB credentials in production
    if (getenv('APP_ENV') === 'development') {
        die("Database connection failed: " . $e->getMessage());
    } else {
        http_response_code(500);
        error_log("SaloneHub DB Error: " . $e->getMessage());
        die("Database connection failed. Please check your configuration.");
    }
}

