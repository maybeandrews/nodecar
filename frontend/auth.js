document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            console.log("Login successful:", data);
            // Save user data to localStorage or sessionStorage
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("isAdmin", data.isAdmin);
            // Redirect to the landing page
            window.location.href = "home.html";
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed");
        }
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("registerUsername").value;
        const password = document.getElementById("registerPassword").value;
        const email = document.getElementById("registerEmail").value;
        const phone = document.getElementById("registerPhone").value;
        const address = document.getElementById("registerAddress").value;

        try {
            const response = await fetch("/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    phone,
                    address,
                }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const data = await response.json();
            console.log("Registration successful:", data);
            alert("Registration successful! Please login.");
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed");
        }
    });
});
