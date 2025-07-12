<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php#login");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h2>Welcome to your dashboard!</h2>
    <p>You are logged in.</p>
    <a href="logout.php" class="logout-button">Logout</a>
  </div>
</body>
</html>
