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

loginTab.addEventListener("click", () => setActiveTab("login"));
registerTab.addEventListener("click", () => setActiveTab("register"));

document.querySelector("#loginForm form").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const error = validateLogin(email, password);

    if (error) {
        displayMessage(error, "error");
        return;
    }

    displayMessage(`Has iniciado sesión con ${email}.`, "success");
});

document.querySelector("#registerForm form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const error = validateRegistration(name, email, password);

    if (error) {
        displayMessage(error, "error");
        return;
    }

    displayMessage(`Cuenta creada para ${name}. Ahora puedes iniciar sesión.`, "success");
});

setActiveTab("login");
