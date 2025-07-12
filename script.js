document.addEventListener('DOMContentLoaded', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  const nameRegex = /^[A-Za-z\s]+$/;

  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  const fnameInput = registerForm.querySelector('input[name="fname"]');
  const mnameInput = registerForm.querySelector('input[name="mname"]');
  const lnameInput = registerForm.querySelector('input[name="lname"]');
  const emailInput = registerForm.querySelector('input[name="email"]');
  const confirmEmailInput = registerForm.querySelector('input[name="confirmEmail"]');
  const passwordInput = registerForm.querySelector('input[name="password"]');
  const confirmPasswordInput = registerForm.querySelector('input[name="confirmPassword"]');
  const registerButton = registerForm.querySelector('button[type="submit"]');
  const registerError = registerForm.querySelector('.error');

  const loginError = loginForm.querySelector('.error');
  const loginEmail = loginForm.querySelector('input[name="loginEmail"]');
  const loginPassword = loginForm.querySelector('input[name="loginPassword"]');

  const showLoginBtn = document.getElementById('showLogin');
  const showRegisterBtn = document.getElementById('showRegister');

  // === Form Toggle with Title Change ===
  showLoginBtn.addEventListener('click', () => {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    document.title = "Login";
    location.hash = "#login";
  });

  showRegisterBtn.addEventListener('click', () => {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    document.title = "Register";
    location.hash = "#register";
  });

  function switchFormByHash() {
    if (location.hash === '#register') {
      showRegisterBtn.click();
    } else {
      showLoginBtn.click();
    }
  }

  switchFormByHash();
  window.addEventListener('hashchange', switchFormByHash);

  // === Toggle Password Visibility ===
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(toggle.dataset.target);
      if (input) {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        toggle.textContent = isHidden ? 'Hide' : 'Show';
      }
    });
  });

  // === Name Validation ===
  function validateNames() {
    const fname = fnameInput.value.trim();
    const lname = lnameInput.value.trim();
    const mname = mnameInput.value.trim();

    if (!nameRegex.test(fname) || fname.length < 3) {
      registerError.textContent = 'First name must be at least 3 letters and contain no numbers.';
      registerButton.disabled = true;
      return false;
    }

    if (!nameRegex.test(lname) || lname.length < 3) {
      registerError.textContent = 'Last name must be at least 3 letters and contain no numbers.';
      registerButton.disabled = true;
      return false;
    }

    if (mname.toUpperCase() !== 'N/A' && (!nameRegex.test(mname) || mname.length < 3)) {
      registerError.textContent = 'Middle name must be at least 3 letters or "N/A", and must not contain numbers.';
      registerButton.disabled = true;
      return false;
    }

    registerError.textContent = '';
    return true;
  }

  fnameInput.addEventListener('input', validateNames);
  lnameInput.addEventListener('input', validateNames);
  mnameInput.addEventListener('input', validateNames);

  // === Password Validation ===
  function validatePasswordFields() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!passwordRegex.test(password)) {
      registerError.textContent = 'Password must be at least 8 characters with 1 uppercase letter and 1 number.';
      registerButton.disabled = true;
      return false;
    }

    if (confirmPassword && password !== confirmPassword) {
      registerError.textContent = 'Passwords do not match.';
      registerButton.disabled = true;
      return false;
    }

    registerError.textContent = '';
    return true;
  }

  passwordInput.addEventListener('input', validatePasswordFields);
  confirmPasswordInput.addEventListener('input', validatePasswordFields);

  // === Email Match + Availability Check ===
  function checkEmailMatchAndAvailability() {
    const email = emailInput.value.trim();
    const confirmEmail = confirmEmailInput.value.trim();

    if (!email || !confirmEmail) {
      registerError.textContent = 'Both email and confirm email are required.';
      registerButton.disabled = true;
      return;
    }

    if (email !== confirmEmail) {
      registerError.textContent = 'Emails do not match.';
      registerButton.disabled = true;
      return;
    }

    if (!emailRegex.test(email)) {
      registerError.textContent = 'Invalid email format.';
      registerButton.disabled = true;
      return;
    }

    fetch('check_email.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=' + encodeURIComponent(email)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'taken') {
          registerError.textContent = 'Email is already registered.';
          registerButton.disabled = true;
        } else if (data.status === 'available') {
          if (validateNames() && validatePasswordFields()) {
            registerError.textContent = '';
            registerButton.disabled = false;
          }
        } else {
          registerError.textContent = 'Unable to verify email.';
          registerButton.disabled = true;
        }
      })
      .catch(() => {
        registerError.textContent = 'Unable to verify email.';
        registerButton.disabled = true;
      });
  }

  emailInput.addEventListener('input', checkEmailMatchAndAvailability);
  confirmEmailInput.addEventListener('input', checkEmailMatchAndAvailability);

  // === Final Register Form Submit Validation ===
  registerForm.addEventListener('submit', function (e) {
    const email = emailInput.value.trim();
    const confirmEmail = confirmEmailInput.value.trim();

    if (!validateNames() || !validatePasswordFields()) {
      e.preventDefault();
      return;
    }

    if (!email || !confirmEmail) {
      e.preventDefault();
      registerError.textContent = 'Both email and confirm email are required.';
      return;
    }

    if (!emailRegex.test(email)) {
      e.preventDefault();
      registerError.textContent = 'Invalid email format.';
      return;
    }

    if (email !== confirmEmail) {
      e.preventDefault();
      registerError.textContent = 'Emails do not match.';
      return;
    }
  });

  // === Login Form Validation ===
  loginForm.addEventListener('submit', function (e) {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!emailRegex.test(email)) {
      e.preventDefault();
      loginError.textContent = 'Invalid email format.';
      return;
    }

    if (!password) {
      e.preventDefault();
      loginError.textContent = 'Password is required.';
      return;
    }

    loginError.textContent = '';
  });
});
