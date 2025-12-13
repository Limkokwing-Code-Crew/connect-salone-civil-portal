<?php
/**
 * Authentication API Endpoint
 * POST /api/auth.php - Login
 * GET /api/auth.php - Check auth status
 * DELETE /api/auth.php - Logout
 */
require_once __DIR__ . '/../config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($method) {
        case 'POST':
            // Login
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            
            if ($username === 'admin' && $password === 'salonehub2025') {
                $_SESSION['admin'] = true;
                echo json_encode(['success' => true, 'authenticated' => true]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
            }
            break;
            
        case 'GET':
            // Check auth status
            echo json_encode([
                'success' => true,
                'authenticated' => isset($_SESSION['admin'])
            ]);
            break;
            
        case 'DELETE':
            // Logout
            session_destroy();
            echo json_encode(['success' => true, 'authenticated' => false]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

