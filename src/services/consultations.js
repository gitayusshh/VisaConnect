export function getBookings() {
  const savedBookings = localStorage.getItem("bookings");

  if (!savedBookings) {
    return [];
  }

  const bookings = JSON.parse(savedBookings);

  if (!Array.isArray(bookings)) {
    throw new Error("Saved consultation data is invalid.");
  }

  const normalizedBookings = bookings.map((booking) =>
    booking.status === "Confirmed" && !booking.confirmedByAdmin
      ? {
          ...booking,
          status: "Pending",
          latestUpdate: "Consultation request is awaiting confirmation.",
        }
      : booking
  );

  if (normalizedBookings.some((booking, index) => booking !== bookings[index])) {
    localStorage.setItem("bookings", JSON.stringify(normalizedBookings));
  }

  return normalizedBookings;
}
