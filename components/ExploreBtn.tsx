"use client"

import Link from "next/link";
import Image from "next/image";

const ExploreBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mt-7"  onClick={() => console.log("Clicked")}>
            <Link href="#events">
                Explore Events
            </Link>
            <Image src="/icons/arrow-down.svg" alt="arrow-down" width="24" height="24" />
        </button>
    )
}
export default ExploreBtn
