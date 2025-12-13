<?php
/**
 * SaloneHub - Main Entry Point
 * Serves React SPA for all routes except /backend/
 */

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = dirname($_SERVER['SCRIPT_NAME']);

// Remove script name from URI if present
if ($script_name !== '/') {
    $request_uri = substr($request_uri, strlen($script_name));
}

// Remove query string
$request_uri = strtok($request_uri, '?');

// If requesting backend API or admin, let Apache handle it
if (strpos($request_uri, '/backend/') === 0) {
    return false;
}

// If requesting a static asset from dist/, serve it
if (strpos($request_uri, '/assets/') === 0 || 
    strpos($request_uri, '/vite.svg') === 0 ||
    preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/', $request_uri)) {
    
    $file_path = __DIR__ . '/dist' . $request_uri;
    
    if (file_exists($file_path)) {
        // Set appropriate content type
        $ext = pathinfo($file_path, PATHINFO_EXTENSION);
        $content_types = [
            'js' => 'application/javascript',
            'css' => 'text/css',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject'
        ];
        
        if (isset($content_types[$ext])) {
            header('Content-Type: ' . $content_types[$ext]);
        }
        
        readfile($file_path);
        exit;
    }
}

// For all other routes, serve the React app
$index_file = __DIR__ . '/dist/index.html';

if (file_exists($index_file)) {
    readfile($index_file);
} else {
    http_response_code(404);
    echo "SaloneHub: Build files not found. Please run 'npm run build' in the frontend directory.";
}
?>
