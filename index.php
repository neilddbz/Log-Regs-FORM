<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login & Register</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
<div class="container">
  <div class="form-toggle">
    <button id="showLogin">Login</button>
    <button id="showRegister">Register</button>
  </div>

  <!-- Login Form -->
  <form id="loginForm" class="<?= (isset($_SESSION['register_success']) || (isset($_GET['show']) && $_GET['show'] === 'login')) ? 'active' : '' ?>" method="POST" action="login.php">
    <h2>Login</h2>

    <?php if (!empty($_SESSION['register_success'])): ?>
      <div class="success"><?php echo $_SESSION['register_success']; unset($_SESSION['register_success']); ?></div>
    <?php endif; ?>

    <?php if (!empty($_SESSION['login_error'])): ?>
      <div class="error"><?php echo $_SESSION['login_error']; unset($_SESSION['login_error']); ?></div>
    <?php endif; ?>

    <input type="email" name="loginEmail" placeholder="Email" required />
    <div class="password-wrapper">
      <input type="password" name="loginPassword" id="loginPassword" placeholder="Password" required />
      <button type="button" class="toggle-password" data-target="loginPassword">Show</button>
    </div>
    <div class="error"></div>
    <button type="submit">Login</button>
  </form>

  <!-- Register Form -->
  <form id="registerForm" class="<?= (!isset($_SESSION['register_success']) && (!isset($_GET['show']) || $_GET['show'] === 'register')) ? 'active' : '' ?>" method="POST" action="register.php">
    <h2>Register</h2>

    <?php if (!empty($_SESSION['register_error'])): ?>
      <div class="error"><?php echo $_SESSION['register_error']; unset($_SESSION['register_error']); ?></div>
    <?php endif; ?>

    <input type="text" name="fname" placeholder="First Name" required />
    <input type="text" name="mname" placeholder="Middle Name (or N/A)" required />
    <input type="text" name="lname" placeholder="Last Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <input type="email" name="confirmEmail" placeholder="Confirm Email" required />
    <div class="password-wrapper">
      <input type="password" name="password" id="regPassword" placeholder="Password" required />
      <button type="button" class="toggle-password" data-target="regPassword">Show</button>
    </div>
    <div class="password-wrapper">
      <input type="password" name="confirmPassword" id="regConfirmPassword" placeholder="Confirm Password" required />
      <button type="button" class="toggle-password" data-target="regConfirmPassword">Show</button>
    </div>
    <div class="error"></div>
    <button type="submit">Register</button>
  </form>
</div>

<script src="script.js"></script>
</body>
</html>
