const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginFormPanel = document.getElementById("loginForm");
const registerFormPanel = document.getElementById("registerForm");
const mensajeAutenticacion = document.getElementById("mensajeAutenticacion");

const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

function setActiveTab(tab) {
    loginTab.classList.toggle("active", tab === "login");
    registerTab.classList.toggle("active", tab === "register");
    loginFormPanel.classList.toggle("active", tab === "login");
    registerFormPanel.classList.toggle("active", tab === "register");
    clearMessage();
}

function displayMessage(message, type = "info") {
    mensajeAutenticacion.textContent = message;
    mensajeAutenticacion.classList.remove("error", "success");
    if (type === "error") mensajeAutenticacion.classList.add("error");
    if (type === "success") mensajeAutenticacion.classList.add("success");
}

function clearMessage() {
    mensajeAutenticacion.textContent = "";
    mensajeAutenticacion.classList.remove("error", "success");
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    return allowedDomains.includes(domain);
}

function isValidPassword(password) {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const digitCheck = /[0-9]/.test(password);
    const specialCheck = /[^A-Za-z0-9]/.test(password);

    return lengthCheck && upperCheck && lowerCheck && digitCheck && specialCheck;
}

function validateLogin(email, password) {
    if (!isValidEmail(email)) {
        return "Ingresa un correo válido y permitido.";
    }
    if (password.length === 0) {
        return "Ingresa tu contraseña.";
    }
    return "";
}

function validateRegistration(name, email, password) {
    if (name.length < 2) {
        return "Ingresa tu nombre completo.";
    }
    if (!isValidEmail(email)) {
        return `El correo debe ser válido y pertenecer a uno de estos dominios: ${allowedDomains.join(", ")}.`;
    }
    if (!isValidPassword(password)) {
        return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
    return "";
}

function updatePasswordFeedback(password) {
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    // Actualizar lista visual
    document.getElementById("checkLength").className = checks.length ? "valid" : "invalid";
    document.getElementById("checkUpper").className = checks.upper ? "valid" : "invalid";
    document.getElementById("checkLower").className = checks.lower ? "valid" : "invalid";
    document.getElementById("checkDigit").className = checks.digit ? "valid" : "invalid";
    document.getElementById("checkSpecial").className = checks.special ? "valid" : "invalid";

    // Calcular nivel de seguridad
    const score = Object.values(checks).filter(Boolean).length;
    const bar = document.getElementById("passwordStrengthBar");

    const width = (score / 5) * 100;
    bar.style.width = width + "%";

    if (score <= 2) bar.style.background = "red";
    else if (score <= 4) bar.style.background = "orange";
    else bar.style.background = "green";
}

loginTab.addEventListener("click", () => setActiveTab("login"));
registerTab.addEventListener("click", () => setActiveTab("register"));

const API_BASE_URL = "http://localhost:5097/api/usuarios";

document.querySelector("#loginForm form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const error = validateLogin(email, password);

    if (error) {
        displayMessage(error, "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email: email, Password: password })
        });

        if (!response.ok) {
            const message = await response.text();
            displayMessage(message || "Credenciales incorrectas.", "error");
            return;
        }

        const result = await response.json();
        displayMessage(`Bienvenido, ${result.nombre || email}.`, "success");
        document.querySelector("#loginForm form").reset();
    } catch (err) {
        displayMessage("No se pudo conectar con el servidor. Intenta nuevamente.", "error");
        console.error(err);
    }
});

document.querySelector("#registerForm form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const error = validateRegistration(name, email, password);

    if (error) {
        displayMessage(error, "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Nombre: name, email, Password: password })
        });

        if (!response.ok) {
            const message = await response.text();
            displayMessage(message || "Error al registrar el usuario.", "error");
            return;
        }

        const result = await response.json();
        displayMessage(`Cuenta creada para ${result.Nombre}. Ahora puedes iniciar sesión.`, "success");
        document.querySelector("#registerForm form").reset();
        feedback.classList.remove("visible");
        updatePasswordFeedback("");
    } catch (err) {
        displayMessage("No se pudo conectar con el servidor. Intenta nuevamente.", "error");
        console.error(err);
    }
});

const passwordInput = document.getElementById("registerPassword");
const feedback = document.getElementById("passwordFeedback");

passwordInput.addEventListener("input", (e) => {
    const value = e.target.value;

    if (value.length > 0) {
        feedback.classList.add("visible");
        updatePasswordFeedback(value);
    } else {
        feedback.classList.remove("visible");
    }
});

setActiveTab("login");
