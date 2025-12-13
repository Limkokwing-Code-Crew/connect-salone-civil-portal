<?php
/**
 * Representatives API Endpoint
 * GET /api/reps.php - List all representatives (with optional district filter)
 */
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $district = $_GET['district'] ?? '';
    
    $sql = "SELECT * FROM representatives WHERE 1=1";
    $params = [];
    
    if ($district) {
        $sql .= " AND district = :district";
        $params[':district'] = $district;
    }
    
    $sql .= " ORDER BY district, name";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $reps = $stmt->fetchAll();
    
    // Get unique districts
    $districts = array_unique(array_column($reps, 'district'));
    sort($districts);
    
    echo json_encode([
        'success' => true,
        'data' => $reps,
        'districts' => $districts
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    error_log("Reps API Error: " . $e->getMessage());
}

