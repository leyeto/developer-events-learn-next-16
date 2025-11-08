import Image from "next/image";
import Link from "next/link";

type EventProps = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

const EventCard = ({
  title,
  image,
  slug,
  location,
  date,
  time,
}: EventProps) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        height={410}
        width={300}
        className="poster"
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>
      <div className="flex flex-row gap-2">
        <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
        <p>{date}</p>
        <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
        <p>{time}</p>
      </div>
    </Link>
  );
};
export default EventCard;
