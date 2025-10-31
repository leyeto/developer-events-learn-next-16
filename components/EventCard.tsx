import Image from "next/image"
import Link from "next/link";

type EventProps={
    title: string,
    image: string,

}

const EventCard = ({title,image}:EventProps) => {
    return (
        <Link href={`/events/${title}`} id="event-card">
            <Image src={image} alt={title} height={410} width={300} className="poster" />
            <p className="title">{title}</p>

        </Link>
    )
}
export default EventCard
