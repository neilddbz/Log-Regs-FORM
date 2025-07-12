<?php
session_start();
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['loginEmail'] ?? ''));
    $password = $_POST['loginPassword'] ?? '';

    if (empty($email) || empty($password)) {
        $_SESSION['login_error'] = 'Email and password are required.';
        header("Location: index.php#login");
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['login_error'] = 'Invalid email format.';
        header("Location: index.php#login");
        exit;
    }

    // Check if users table has any account
    $result = $conn->query("SELECT COUNT(*) AS total FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        if ((int)$row['total'] === 0) {
            $_SESSION['login_error'] = 'No account registered yet. Please register first.';
            header("Location: index.php#login");
            exit;
        }
    } else {
        $_SESSION['login_error'] = 'Database error. Please try again.';
        header("Location: index.php#login");
        exit;
    }

    $stmt = $conn->prepare("SELECT id, fname, password FROM users WHERE email = ?");
    if ($stmt) {
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 0) {
            $_SESSION['login_error'] = 'Email not found. Please register.';
            header("Location: index.php#login");
            exit;
        }

        $stmt->bind_result($user_id, $fname, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $fname;
            unset($_SESSION['login_error']);
            header("Location: dashboard.php");
            exit;
        } else {
            $_SESSION['login_error'] = 'Incorrect password.';
            header("Location: index.php#login");
            exit;
        }

        $stmt->close();
    } else {
        $_SESSION['login_error'] = 'Login failed. Please try again later.';
        header("Location: index.php#login");
        exit;
    }
} else {
    header("Location: index.php");
    exit;
}
