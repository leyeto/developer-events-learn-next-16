import React from "react";
import { notFound } from "next/navigation";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL environment variable not defined");
}

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventDetailAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, index) => (
      <div className="pill" key={index}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  "use cache";
  cacheLife("hours");
  const slug = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!request.ok) {
    if (request.status === 404) {
      return notFound();
    }
    throw new Error(`Failed to fetch event: ${request.statusText}`);
  }

  const data = await request.json();
  const event = data?.event;

  if (!event) {
    return notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  if (!description || !image || !overview || !date || !time || !location)
    return notFound();

  // Ensure agenda and tags are arrays
  const agendaItems = Array.isArray(agenda) ? agenda : [];
  const eventTags = Array.isArray(tags) ? tags : [];

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/*    Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />{" "}
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />{" "}
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />{" "}
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />{" "}
          </section>

          <EventDetailAgenda agendaItems={agendaItems} />

          <section className="flex-col-gap-2">
            <h2>About the Organiser</h2>
            <p>{organizer}</p>
            <EventTags tags={eventTags} />
          </section>
        </div>

        {/*    Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className={"text-sm"}>
                Join {bookings} people that have already booked their spot!
              </p>
            ) : (
              <p className={"text-sm"}>Be the first to book your spot</p>
            )}
            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>
      <div className={"flex w-full flex-col gap-4 pt-20"}>
        <h2>Similar Events</h2>
        <div className={"events"}>
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent, index) => (
              <EventCard
                key={similarEvent._id.toString() || index}
                {...similarEvent}
              />
            ))}
        </div>
      </div>
    </section>
  );
};
export default EventDetails;
