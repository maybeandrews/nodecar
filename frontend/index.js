document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the browse cars button
    document
        .getElementById("browseCars")
        .addEventListener("click", fetchAvailableCars);

    // Add event listener to the logout link
    document.getElementById("logout").addEventListener("click", handleLogout);
});

async function fetchAvailableCars(event) {
    event.preventDefault();
    const rentalDate = document.getElementById("rentalDate").value;
    if (!rentalDate) {
        alert("Please select a rental date.");
        return;
    }

    try {
        const response = await fetch(`/cars/available/${rentalDate}`);
        if (!response.ok) {
            throw new Error("Failed to fetch available cars");
        }
        const cars = await response.json();
        if (cars.length === 0) {
            alert("No available cars on the selected date.");
        } else {
            displayAvailableCars(cars);
        }
    } catch (error) {
        console.error("Error fetching available cars:", error);
    }
}

function displayAvailableCars(cars) {
    const carList = document.querySelector(".car-list");
    carList.innerHTML = ""; // Clear existing cars

    cars.forEach((car) => {
        const carItem = document.createElement("div");
        carItem.classList.add("car-item");

        carItem.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <div class="car-details">
                <h3>${car.name} (${car.year})</h3>
                <a href="#" class="btn" data-car-id="${car.id}" data-total-cost="${car.daily_rental_rate}">Rent Now - ₹${car.daily_rental_rate}</a>
            </div>
        `;

        carList.appendChild(carItem);
    });

    // Add event listeners to "Rent Now" buttons
    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", redirectToPayment);
    });
}

function redirectToPayment(event) {
    event.preventDefault();
    const carId = event.target.getAttribute("data-car-id");
    const totalCost = event.target.getAttribute("data-total-cost");
    const userId = localStorage.getItem("userId"); // Get the actual user ID from localStorage
    const returnDate = "2023-12-31"; // Replace with actual return date

    // Redirect to the payment page with the necessary information
    window.location.href = `payment.html?carId=${carId}&userId=${userId}&returnDate=${returnDate}&totalCost=${totalCost}`;
}

function handleLogout(event) {
    event.preventDefault();
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    // Redirect to the login page
    window.location.href = "auth.html";
}
