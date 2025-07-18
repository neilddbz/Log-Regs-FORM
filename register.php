<?php
session_start();
require 'config.php';

// Optional: enable error reporting during development
error_reporting(E_ALL);
ini_set('display_errors', 1);

function returnToRegister($message) {
    $_SESSION['register_error'] = $message;
    header("Location: index.php#register");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // === Get and sanitize inputs ===
    $fname = trim($_POST['fname'] ?? '');
    $mname = trim($_POST['mname'] ?? '');
    $lname = trim($_POST['lname'] ?? '');
    $email = strtolower(trim($_POST['email'] ?? ''));
    $confirmEmail = strtolower(trim($_POST['confirmEmail'] ?? ''));
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';

    // === Required fields check ===
    if (
        empty($fname) || empty($mname) || empty($lname) ||
        empty($email) || empty($confirmEmail) ||
        empty($password) || empty($confirmPassword)
    ) {
        returnToRegister('All fields are required.');
    }

    // === Name validation ===
    if (!preg_match('/^[A-Za-z\s]{3,}$/', $fname)) {
        returnToRegister('First name must be at least 3 letters and only letters allowed.');
    }

    if (!preg_match('/^[A-Za-z\s]{3,}$/', $lname)) {
        returnToRegister('Last name must be at least 3 letters and only letters allowed.');
    }

    if (strtoupper($mname) !== 'N/A' && !preg_match('/^[A-Za-z\s]{3,}$/', $mname)) {
        returnToRegister('Middle name must be at least 3 letters or "N/A".');
    }

    // === Email validation ===
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        returnToRegister('Invalid email format.');
    }

    if ($email !== $confirmEmail) {
        returnToRegister('Emails do not match.');
    }

    // === Password validation ===
    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/\d/', $password)) {
        returnToRegister('Password must be at least 8 characters, with 1 uppercase letter and 1 number.');
    }

    if ($password !== $confirmPassword) {
        returnToRegister('Passwords do not match.');
    }

    // === Check if email already exists ===
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$stmt) {
        returnToRegister('Database error (email check).');
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        returnToRegister('Email is already registered.');
    }
    $stmt->close();

    // === Insert new user ===
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (fname, mname, lname, email, password) VALUES (?, ?, ?, ?, ?)");

    if (!$stmt) {
        returnToRegister('Database error while inserting user.');
    }

    $stmt->bind_param("sssss", $fname, $mname, $lname, $email, $hashedPassword);

    if ($stmt->execute()) {
        $_SESSION['register_success'] = 'Registration successful! You can now login.';
        header("Location: index.php#login");
        exit;
    } else {
        returnToRegister('Failed to register. Please try again later.');
    }
} else {
    header("Location: index.php");
    exit;
}
