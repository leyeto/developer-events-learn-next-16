import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL environment variable");
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

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!request.ok) {
    if (request.status === 404) {
      return notFound();
    }
    throw new Error(`Failed to fetch event: ${request.statusText}`);
  }

  const {
    event: {
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
    },
  } = await request.json();

  if (!description) return notFound();

  // Safely parse agenda with validation
  let agendaItems: string[] = [];
  if (
    Array.isArray(agenda) &&
    agenda.length > 0 &&
    typeof agenda[0] === "string"
  ) {
    try {
      agendaItems = JSON.parse(agenda[0]);
    } catch (error) {
      console.error("Failed to parse agenda:", error);
      agendaItems = [];
    }
  }

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

          <EventDetailAgenda agendaItems={JSON.parse(agenda[0])} />

          <section className="flex-col-gap-2">
            <h2>About the Organiser</h2>
            <p>{organizer}</p>
            <EventTags tags={tags} />
          </section>
        </div>

        {/*    Right Side - Booking Form */}
        <aside className="booking">
          <p className="text-lg font-semibold ">Book Event</p>
        </aside>
      </div>
    </section>
  );
};
export default EventDetailsPage;
