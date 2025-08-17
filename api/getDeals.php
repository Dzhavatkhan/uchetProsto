<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require __DIR__ . '/../database/connect.php';

try {
    $stmt = $pdo->query("
    SELECT 
        deals.id as deal_id,
        deals.name,
        deals.price,
        GROUP_CONCAT(users.firstname, ' ', users.surname) as participants
    FROM `deals`
    LEFT JOIN users ON deals.id = users.deal_id
    GROUP BY deals.id
    ");

    $deals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Альтернатива если GROUP_CONCAT не работает:
    if (!$deals) {
        $stmt = $pdo->query("SELECT * FROM deals");
        $deals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($deals as &$deal) {
            $stmt = $pdo->prepare("
                SELECT firstname, surname 
                FROM users 
                WHERE deal_id = ?
            ");
            $stmt->execute([$deal['id']]);
            $deal['participants'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    // Обрабатываем результаты
    foreach ($deals as &$deal) {
        if (isset($deal['participants'])){
            $deal['participants'] = $deal['participants'] 
                ? array_map('trim', explode(',', $deal['participants']))
                : [];
        } 
        else {
            $deal['participants'] = array_map(
                fn($p) => $p['firstname'] . ' ' . $p['surname'],
                $deal['participants'] ?? []
            );
        }
        $deal['deal_id'] = $deal['deal_id'] ?? $deal['id'];
    }

    echo json_encode([
        'success' => true,
        'data' => $deals
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}