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
    $rows = $pdo->query("SELECT * FROM experience ORDER BY id DESC")->fetchAll();
    foreach ($rows as &$r) {
        if (!empty($r['bullets'])) $r['bullets'] = json_decode($r['bullets']);
        if (!empty($r['tags'])) $r['tags'] = json_decode($r['tags']);
        if (!empty($r['photos'])) $r['photos'] = json_decode($r['photos']);
        if (!empty($r['documents'])) $r['documents'] = json_decode($r['documents']);
    }
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
