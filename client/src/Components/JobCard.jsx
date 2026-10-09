import { useState } from "react";

function JobCard({
  name,
  location,
  age,
  date,
  time,
  rate,
  onBook,
  bookings
}) {
  const booked = bookings.includes(name);
  const [showDetails, setShowDetails] = useState(false);
  

  return (
    <article className="job-card">
      <h3>{name}</h3>

      <p><strong>Location:</strong> {location}</p>
      <p><strong>Child age:</strong> {age}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Rate:</strong> £{rate}/hour</p>

      {showDetails && (
        <div className="extra-details">
          <p>
            The family is looking for a reliable and friendly childcare
            provider for this booking.
          </p>
        </div>
      )}

      <button
        className="details-button"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Details" : "View Details"}
      </button>

      <button
        className="book-button"
        onClick={() => {
  if (!booked) {
    const confirmed = window.confirm(
      `Are you sure you want to book ${name}?`
    );

    if (confirmed) {
      onBook(name, booked);
    }
  } else {
  const confirmed = window.confirm(
    `Are you sure you want to cancel ${name}?`
  );

  if (confirmed) {
    onBook(name, booked);
  }
}
}}
      >
        {booked ? "Cancel Booking" : "Book Job"}
      </button>

      {booked && (
        <p className="booking-message">
          ✓ Booking confirmed
        </p>
      )}
    </article>
  );
}

export default JobCard;