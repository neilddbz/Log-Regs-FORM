<?php
// config.php
$servername = "localhost";
$username = "root";
$password = ""; // your db password
$dbname = "mydatabase"; // your db name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
