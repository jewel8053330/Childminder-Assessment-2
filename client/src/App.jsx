import { useState, useEffect } from "react";
import "./App.css";
import JobCard from "./Components/JobCard.jsx";

function App() {
  const [jobs, setJobs] = useState([]);
const [error, setError] = useState("");

useEffect(() => {
  fetch("http://localhost:5000/api/jobs")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    })
    .then((data) => {
      setJobs(data);
      setError("");
    })
    .catch((error) => {
      console.error(error);
      setJobs([]);
      setError("Unable to load jobs. Please try again later.");
    });
}, []);

  
const [bookings, setBookings] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/bookings")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    })
    .then((data) => {
      setBookings(data.map((booking) => booking.jobName));
    })
    .catch((error) => console.error(error));
}, []);

  const [availability, setAvailability] = useState(() => {
  const saved = localStorage.getItem("childminder-availability");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  localStorage.setItem(
    "childminder-availability",
    JSON.stringify(availability)
  );
}, [availability]);

const [searchTerm, setSearchTerm] = useState("");
const hasMatchingJobs = jobs.some(
  (job) =>
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
);
const jobDetails = {
  "Evening Childcare": {
    location: "Bath",
    date: "12 October 2026",
    time: "5:00 PM - 10:00 PM",
    rate: "£15/hour"
  },
  "After School Care": {
    location: "Bristol",
    date: "14 October 2026",
    time: "3:30 PM - 6:30 PM",
    rate: "£14/hour"
  },
  "Weekend Babysitting": {
    location: "Bath",
    date: "17 October 2026",
    time: "6:00 PM - 11:00 PM",
    rate: "£16/hour"
  }
};

  const handleBooking = async (jobName, isBooked) => {
  if (isBooked) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings/${encodeURIComponent(jobName)}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Cancellation failed");
    }

    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking !== jobName)
    );

    alert("Booking cancelled successfully!");
  } catch (error) {
    console.error(error);
    alert("Unable to cancel booking.");
  }

  return;
}

  try {
    const response = await fetch(
      "http://localhost:5000/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobName }),
      }
    );

    if (!response.ok) {
      throw new Error("Booking failed");
    }

    setBookings((prevBookings) =>
      prevBookings.includes(jobName)
        ? prevBookings
        : [...prevBookings, jobName]
    );

    alert("Job booked successfully!");
  } catch (error) {
    console.error(error);
    alert("Unable to book job.");
  }
};
const toggleAvailability = (day) => {
  setAvailability((prev) =>
    prev.includes(day)
      ? prev.filter((item) => item !== day)
      : [...prev, day]
  );
};
  return (
    <div className="app">
      <header>
        <h1>ChildMinder</h1>

        <nav>
          <a href="#jobs">Find Jobs</a>
          <a href="#bookings">My Bookings</a>
          <a href="#availability">Availability</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h2>Find childcare jobs that work for you</h2>

          <p>
            Discover local childcare opportunities, check the details,
            and manage your bookings in one place.
          </p>

          <button
  onClick={() => {
    document.getElementById("jobs").scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Browse Jobs
</button>
        </section>
        <section className="jobs-section" id="jobs">
  <div className="section-heading">
    <h2>Available Jobs</h2>
    <p>Find childcare opportunities that match your availability.</p>
  </div>
<div className="job-search">
  <input
  type="text"
  className="search-box"
  placeholder="Search by location..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
{searchTerm && (
  <button
    type="button"
    className="clear-search"
    onClick={() => setSearchTerm("")}
  >
  Clear Search
  </button>
)}
</div>

{(error || !hasMatchingJobs) && (
  <p className="no-jobs">
    {error
      ? "Unable to load jobs. Please try again later."
      : "No jobs found. Please try another location."}
  </p>
)}

  <div className="jobs-grid">
  {jobs
  .filter((job) =>
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((job) => (
    <JobCard
      key={job.id}
      name={job.name}
      location={job.location}
      age={job.age}
      date={job.date}
      time={job.time}
      rate={job.rate}
      onBook={handleBooking}
      bookings={bookings}
    />
  ))}
</div>
</section>

<section className="bookings-section" id="bookings">
  <div className="section-heading">
    <h2>My Bookings</h2>
    <p>Your booked childcare jobs appear here.</p>
  </div>

  {bookings.length === 0 ? (
    <p className="no-bookings">You have no bookings yet.</p>
  ) : (
    <div className="bookings-list">
      {bookings.map((booking) => (
       <div className="booking-item" key={booking}>
<strong>{booking}</strong>

<div className="booking-details">
  <p>Location: {jobDetails[booking]?.location}</p>
  <p>Date: {jobDetails[booking]?.date}</p>
  <p>Time: {jobDetails[booking]?.time}</p>
  <p>Rate: {jobDetails[booking]?.rate}</p>
</div>

<span>✓ Confirmed</span>
  <button
    className="cancel-booking"
    onClick={() => {
  const confirmed = window.confirm(
    `Are you sure you want to cancel ${booking}?`
  );

  
if (confirmed) {
  fetch(
    `http://localhost:5000/api/bookings/${encodeURIComponent(booking)}`,
    { method: "DELETE" }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to cancel booking");
      }

      setBookings((prev) =>
        prev.filter((item) => item !== booking)
      );
    })
    .catch((error) => {
      console.error(error);
      alert("Unable to cancel booking.");
    });
}

}}
  >
    Cancel Booking
  </button>
</div> 
      ))}
    </div>
  )}
</section>
<section className="availability-section" id="availability">
  <div className="section-heading">
    <h2>My Availability</h2>
    <p>Set the days you are available for childcare work.</p>
  </div>
  <div className="availability-days">
<button
  className={availability.includes("Monday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Monday")}
>
  Monday
</button>

<button
  className={availability.includes("Tuesday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Tuesday")}
>
  Tuesday
</button>


<button 
  className={availability.includes("Wednesday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Wednesday")}
>
  Wednesday
</button>

<button 
className={availability.includes("Thursday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Thursday")}
>
  Thursday
</button>

<button 
className={availability.includes("Friday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Friday")}
>
  Friday
</button>

<button 
className={availability.includes("Saturday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Saturday")}
>
  Saturday
</button>

<button 
className={availability.includes("Sunday") ? "selected-day" : ""}
  onClick={() => toggleAvailability("Sunday")}
>
  Sunday
</button>
</div>
<button
  className="save-availability"
  onClick={() => alert(`Availability saved: ${availability.join(", ")}`)}
>
  Save Availability
</button>
</section>
      </main>
    </div>
  );
}

export default App;