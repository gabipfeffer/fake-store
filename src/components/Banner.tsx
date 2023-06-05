"use client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
export default function Banner() {
  return (
    <div className={"relative"}>
      <div
        className={
          "absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20"
        }
      />
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div>
          <Image
            loading={"lazy"}
            src={"https://links.papareact.com/gi1"}
            alt={"banner-image"}
            width={1200}
            height={600}
          />
        </div>
        <div>
          <Image
            loading={"lazy"}
            src={"https://links.papareact.com/6ff"}
            alt={"banner-image"}
            width={1200}
            height={600}
          />
        </div>
        <div>
          <Image
            loading={"lazy"}
            src={"https://links.papareact.com/7ma"}
            alt={"banner-image"}
            width={1200}
            height={600}
          />
        </div>
      </Carousel>
    </div>
  );
}
