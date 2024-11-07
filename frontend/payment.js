document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get("carId");
    const userId = urlParams.get("userId");
    const returnDate = urlParams.get("returnDate");
    const totalCost = urlParams.get("totalCost");

    // Populate hidden fields with the necessary information
    document.getElementById("carId").value = carId;
    document.getElementById("userId").value = userId;
    document.getElementById("returnDate").value = returnDate;
    document.getElementById("totalCost").value = totalCost;
    document.getElementById("amount").value = `₹${totalCost}`;

    // Add event listener to the payment form
    document
        .getElementById("paymentForm")
        .addEventListener("submit", handlePayment);
});

async function handlePayment(event) {
    event.preventDefault();
    const carId = document.getElementById("carId").value;
    const userId = document.getElementById("userId").value;
    const returnDate = document.getElementById("returnDate").value;
    const totalCost = document.getElementById("totalCost").value;
    const amount = document.getElementById("amount").value.replace("₹", "");

    // Check if the payment amount matches the total cost
    if (amount !== totalCost) {
        alert("Payment amount does not match the total cost.");
        return;
    }

    // Simulate payment processing (you can integrate with a real payment gateway here)
    const paymentSuccessful = true; // Simulate a successful payment
    if (paymentSuccessful) {
        try {
            const response = await fetch("/rentals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    car_id: carId,
                    return_date: returnDate,
                    total_cost: totalCost,
                    status: "Rented",
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to rent car");
            }
            const data = await response.json();
            console.log("Car rented successfully:", data);
            alert("Payment successful! Car rented successfully!");
            window.location.href = "rentals.html"; // Redirect to the rentals page
        } catch (error) {
            console.error("Error renting car:", error);
            alert(error.message);
        }
    } else {
        alert("Payment failed. Please try again.");
    }
}
