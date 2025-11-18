"use client";
import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ slug, eventId }: { slug: string; eventId: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await createBooking({ eventId, slug, email });

    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      console.error("Booking Creation failed");
      posthog.captureException("Booking Creation failed.");
    }

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div id={"book-event"}>
      {submitted ? (
        <p className={"text-sm"}>Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={"email"}>Email Address</label>
            <input
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter email"
            />
          </div>
          <button type={"submit"} className={"button-submit"}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
