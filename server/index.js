
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ChildMinder backend is running!");
});

const jobs = [
  {
    id: 1,
    name: "Evening Childcare",
    location: "Bath",
    age: "4 years",
    date: "12 October 2026",
    time: "5:00 PM - 10:00 PM",
    rate: 15
  },
  {
    id: 2,
    name: "After School Care",
    location: "Bristol",
    age: "7 years",
    date: "14 October 2026",
    time: "3:30 PM - 6:30 PM",
    rate: 14
  },
  {
    id: 3,
    name: "Weekend Babysitting",
    location: "Bath",
    age: "5 and 8 years",
    date: "17 October 2026",
    time: "6:00 PM - 11:00 PM",
    rate: 16
  }
];

app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

let bookings = [];

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { jobName } = req.body;
    if (typeof jobName !== "string" || !jobName.trim()) {
    return res.status(400).json({
      message: "A job name is required"
    });
  }

  if (bookings.some((booking) => booking.jobName === jobName)) {
    return res.status(409).json({
      message: "Job already booked"
    });
  }

  const booking = {
  id: bookings.length > 0
    ? Math.max(...bookings.map((b) => b.id)) + 1
    : 1,
  jobName
};

  bookings.push(booking);
  res.status(201).json(booking);
});

app.delete("/api/bookings/:jobName", (req, res) => {
  const jobName = req.params.jobName;

  const index = bookings.findIndex(
    (booking) => booking.jobName === jobName
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  bookings.splice(index, 1);

  res.json({
    message: "Booking cancelled successfully"
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
