<?php
/**
 * Services API Endpoint
 * GET /api/services.php - List all services (with optional search)
 * POST /api/services.php - Create new service
 * PUT /api/services.php?id=X - Update service
 * DELETE /api/services.php?id=X - Delete service
 */
require_once __DIR__ . '/../config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    switch ($method) {
        case 'GET':
            // List services with optional search
            $search = $_GET['search'] ?? '';
            $agency = $_GET['agency'] ?? '';
            $region = $_GET['region'] ?? '';
            
            $sql = "SELECT * FROM services WHERE 1=1";
            $params = [];
            
            if (!empty($search)) {
                $sql .= " AND (name LIKE ? OR agency LIKE ?)";
                $params[] = "%{$search}%";
                $params[] = "%{$search}%";
            }
            if (!empty($agency)) {
                $sql .= " AND agency = ?";
                $params[] = $agency;
            }
            if (!empty($region)) {
                $sql .= " AND region = ?";
                $params[] = $region;
            }
            
            $sql .= " ORDER BY last_verified IS NULL, last_verified DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $services = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'data' => $services]);
            break;
            
        case 'POST':
            // Create service (admin only)
            if (!isset($_SESSION['admin'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                break;
            }
            
            $data = [
                'name' => $input['name'] ?? '',
                'agency' => $input['agency'] ?? '',
                'fee' => $input['fee'] ?? '',
                'processing_time' => $input['processing_time'] ?? '',
                'documents' => $input['documents'] ?? '',
                'eligibility' => $input['eligibility'] ?? '',
                'process_steps' => $input['process_steps'] ?? '',
                'locations' => $input['locations'] ?? '',
                'contacts' => $input['contacts'] ?? '',
                'notes' => $input['notes'] ?? '',
                'last_verified' => $input['last_verified'] ?? null,
                'region' => $input['region'] ?? '',
            ];
            
            $sql = "INSERT INTO services (name, agency, fee, processing_time, documents, eligibility, process_steps, locations, contacts, notes, last_verified, region) 
                    VALUES (:name, :agency, :fee, :processing_time, :documents, :eligibility, :process_steps, :locations, :contacts, :notes, :last_verified, :region)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            // Update service (admin only)
            if (!isset($_SESSION['admin'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                break;
            }
            
            $id = $_GET['id'] ?? $input['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID required']);
                break;
            }
            
            $data = [
                'id' => $id,
                'name' => $input['name'] ?? '',
                'agency' => $input['agency'] ?? '',
                'fee' => $input['fee'] ?? '',
                'processing_time' => $input['processing_time'] ?? '',
                'documents' => $input['documents'] ?? '',
                'eligibility' => $input['eligibility'] ?? '',
                'process_steps' => $input['process_steps'] ?? '',
                'locations' => $input['locations'] ?? '',
                'contacts' => $input['contacts'] ?? '',
                'notes' => $input['notes'] ?? '',
                'last_verified' => $input['last_verified'] ?? null,
                'region' => $input['region'] ?? '',
            ];
            
            $sql = "UPDATE services SET name=:name, agency=:agency, fee=:fee, processing_time=:processing_time, documents=:documents, eligibility=:eligibility, process_steps=:process_steps, locations=:locations, contacts=:contacts, notes=:notes, last_verified=:last_verified, region=:region WHERE id=:id";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data);
            
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            // Delete service (admin only)
            if (!isset($_SESSION['admin'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                break;
            }
            
            $id = $_GET['id'] ?? $input['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID required']);
                break;
            }
            
            $stmt = $pdo->prepare("DELETE FROM services WHERE id=:id");
            $stmt->execute(['id' => $id]);
            
            echo json_encode(['success' => true]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    error_log("API Error: " . $e->getMessage());
}

