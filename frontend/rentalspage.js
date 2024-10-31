document.addEventListener("DOMContentLoaded", () => {
    fetchMyRentals();

    // Add event listener to the logout link
    document.getElementById("logout").addEventListener("click", handleLogout);
});

async function fetchMyRentals() {
    const userId = localStorage.getItem("userId");

    try {
        const response = await fetch(`/rentals?user_id=${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch rentals");
        }
        const rentals = await response.json();
        displayRentals(rentals);
    } catch (error) {
        console.error("Error fetching rentals:", error);
    }
}

function displayRentals(rentals) {
    const rentalList = document.querySelector(".rental-list");
    rentalList.innerHTML = ""; // Clear existing rentals

    rentals.forEach((rental) => {
        const rentalItem = document.createElement("div");
        rentalItem.classList.add("rental-item");

        const rentalDate = new Date(rental.rental_date).toLocaleDateString();

        rentalItem.innerHTML = `
            <h3>${rental.car_name} (Rented on: ${rentalDate})</h3>
            <a href="#" class="btn" data-rental-id="${rental.id}">Return Car</a>
        `;

        rentalList.appendChild(rentalItem);
    });

    // Add event listeners to "Return Car" buttons
    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", handleReturnCar);
    });
}

async function handleReturnCar(event) {
    event.preventDefault();
    const rentalId = event.target.getAttribute("data-rental-id");

    try {
        const response = await fetch(`/rentals/${rentalId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to return car");
        }

        alert("Car returned successfully!");
        fetchMyRentals(); // Refresh the rentals list
    } catch (error) {
        console.error("Error returning car:", error);
        alert("Error returning car");
    }
}

function handleLogout(event) {
    event.preventDefault();
    // Clear user data from localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    // Redirect to the login page
    window.location.href = "auth.html";
}
