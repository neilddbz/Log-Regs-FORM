<?php
require 'config.php';
header('Content-Type: application/json');

// Get and sanitize input
$email = strtolower(trim($_POST['email'] ?? ''));

// Validate email format
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'invalid']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['status' => 'taken']);
    } else {
        echo json_encode(['status' => 'available']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Server error.']);
}
