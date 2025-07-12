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

  let emailAvailable = false;

  function validateNames() {
    const fname = fnameInput.value.trim();
    const lname = lnameInput.value.trim();
    const mname = mnameInput.value.trim();

    if (!nameRegex.test(fname) || fname.length < 3) {
      registerError.textContent = 'First name must be at least 3 letters and contain no numbers.';
      return false;
    }

    if (!nameRegex.test(lname) || lname.length < 3) {
      registerError.textContent = 'Last name must be at least 3 letters and contain no numbers.';
      return false;
    }

    if (mname.toUpperCase() !== 'N/A' && (!nameRegex.test(mname) || mname.length < 3)) {
      registerError.textContent = 'Middle name must be at least 3 letters or "N/A", and must not contain numbers.';
      return false;
    }

    return true;
  }

  function validatePasswordFields() {
    const email = emailInput.value.trim();
    const confirmEmail = confirmEmailInput.value.trim();
    if (!email || !confirmEmail || !emailRegex.test(email) || email !== confirmEmail) {
      return false; // Don't show password error until email is valid
    }

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!passwordRegex.test(password)) {
      registerError.textContent = 'Password must be at least 8 characters with 1 uppercase letter and 1 number.';
      return false;
    }

    if (confirmPassword && password !== confirmPassword) {
      registerError.textContent = 'Passwords do not match.';
      return false;
    }

    return true;
  }

  function checkEmailMatchAndAvailability() {
    const email = emailInput.value.trim();
    const confirmEmail = confirmEmailInput.value.trim();

    if (!email || !confirmEmail) {
      registerError.textContent = 'Both email and confirm email are required.';
      emailAvailable = false;
      toggleRegisterButton();
      return;
    }

    if (email !== confirmEmail) {
      registerError.textContent = 'Emails do not match.';
      emailAvailable = false;
      toggleRegisterButton();
      return;
    }

    if (!emailRegex.test(email)) {
      registerError.textContent = 'Invalid email format.';
      emailAvailable = false;
      toggleRegisterButton();
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
        emailAvailable = false;
      } else if (data.status === 'available') {
        emailAvailable = true;
      } else {
        registerError.textContent = 'Unable to verify email.';
        emailAvailable = false;
      }
      toggleRegisterButton();
    })
    .catch(() => {
      registerError.textContent = 'Unable to verify email.';
      emailAvailable = false;
      toggleRegisterButton();
    });
  }

  function toggleRegisterButton() {
    if (validateNames() && validatePasswordFields() && emailAvailable) {
      registerError.textContent = '';
      registerButton.disabled = false;
    } else {
      registerButton.disabled = true;
    }
  }

  fnameInput.addEventListener('input', () => { validateNames(); toggleRegisterButton(); });
  lnameInput.addEventListener('input', () => { validateNames(); toggleRegisterButton(); });
  mnameInput.addEventListener('input', () => { validateNames(); toggleRegisterButton(); });

  passwordInput.addEventListener('input', () => { validatePasswordFields(); toggleRegisterButton(); });
  confirmPasswordInput.addEventListener('input', () => { validatePasswordFields(); toggleRegisterButton(); });

  emailInput.addEventListener('input', checkEmailMatchAndAvailability);
  confirmEmailInput.addEventListener('input', checkEmailMatchAndAvailability);

  registerForm.addEventListener('submit', function (e) {
    if (!validateNames() || !validatePasswordFields() || !emailAvailable) {
      e.preventDefault();
      registerError.textContent = 'Please fix the errors before submitting.';
    }
  });

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
