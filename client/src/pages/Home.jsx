import { useEffect, useState } from "react";
import { Link, Links } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingCard from "../component/ListingCard";

export default function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListing);

  useEffect(() => {
    const fetchOfferlisting = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferlisting();
  }, []);
  return (
    <div>
      {/* top section  */}
      <div className="flex flex-col gap-6 py-28 px-7 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl text-slate-700 font-bold">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          this estate will help you to find your home with ease, easy and
          comfrtable
          <br />
          Our expert support will be always available
        </div>
        <Link
          to={"/search"}
          className="font-bold text-blue-800 text-xs sm:text-sm hover:underline"
        >
          let's get started...
        </Link>
      </div>
      {/* swiper section  */}

      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[550px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing section  */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-gray-600">Recent Offers</h2>
              <Link className="text-blue-800 text-sm hover:underline" to={"/search?offer=true"}>show more offers</Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {offerListing &&
                offerListing.map((list) => (
                  <ListingCard key={list._id} list={list} />
                ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-gray-600">Recent places with Rent</h2>
              <Link className="text-blue-800 text-sm hover:underline" to={"/search?type=rent"}>show more offers</Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {rentListing &&
                rentListing.map((list) => (
                  <ListingCard key={list._id} list={list} />
                ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-gray-600">Recent places for sale</h2>
              <Link className="text-blue-800 text-sm hover:underline" to={"/search?type=sale"}>show more offers</Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {saleListing &&
                saleListing.map((list) => (
                  <ListingCard key={list._id} list={list} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
