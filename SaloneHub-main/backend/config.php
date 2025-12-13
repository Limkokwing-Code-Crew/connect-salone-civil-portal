<?php
/**
 * SaloneHub Backend API - Database Configuration
 * Works on localhost (XAMPP/WAMP) and InfinityFree hosting
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = getenv('DB_HOST') ?: 'sql201.infinityfree.com';
$db_name = getenv('DB_NAME') ?: 'if0_40670157_salonehub';
$db_user = getenv('DB_USER') ?: 'if0_40670157';
$db_pass = getenv('DB_PASS') ?: 'vXajp2qDGY8KUjG';

$dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    error_log("SaloneHub DB Error: " . $e->getMessage());
    exit;
}

