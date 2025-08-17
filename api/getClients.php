<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
require __DIR__ . '/../database/connect.php';

try {
    $stmt = $pdo->query("
        SELECT 
            users.id,
            users.firstname,
            users.surname,
            users.deal_id,
            deals.name as deal_name,
            deals.price
        FROM `users`
        LEFT JOIN deals ON users.deal_id = deals.id
    ");
    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $clients
    ]);
    } catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}