<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/db.php';

$pdo = getDBConnection();

if (!$pdo) {
    echo json_encode(['success' => false, 'data' => []]);
    exit;
}

try {
    $rows = $pdo->query("SELECT * FROM projects ORDER BY id DESC")->fetchAll();
    foreach ($rows as &$r) {
        if (!empty($r['tech'])) $r['tech'] = json_decode($r['tech']);
        $r['github'] = $r['github_url'] ?? '';
        $r['demo'] = $r['demo_url'] ?? '';
        $r['banner'] = $r['banner_image'] ?? '';
    }
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
