import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import Contact from "../component/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchingList = async () => {
      const response = await fetch(`/api/listing/find/${params.id}`);
      const data = await response.json();

      if (data.success == false) {
        setError(data.message);
        setListing(false);
        setLoading(false);
        return;
      }

      setListing(data);
      setLoading(false);
      setError(null);
    };
    fetchingList();
  }, [params.id]);
  console.log(loading);
  console.log(listing);

  return (
    <div>
      {loading && <p className="my-7 text-center text-2xl">Loading...</p>}
      {error && (
        <p className="my-7 text-center text-2xl text-red-500">
          Something went wrong
        </p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p className="text-2xl font-semibold">
          {listing.name} - ${" "}
          {listing.offer ? listing.regularPrice -listing.discountPrice : listing.regularPrice}
          {listing.type === "rent" && "/month"}
        </p>
        <p className="flex items-center gap-2 mt-6 text-slate-700 text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address}
        </p>
        <div className="flex gap-2">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {
            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg">
              ${listing.discountPrice} OFF
            </p>
          }
        </div>
        <p className="text-slate-800">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>
        <ul className="flex flex-wrap items-center gap-4 sm:gap-6 font-semibold text-sm text-green-900">
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaBed className="text-lg" />
            {listing.bedrooms > 1
              ? listing.bedrooms + " beds"
              : listing.bedrooms + " bed"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaBath className="text-lg" />
            {listing.bathrooms > 1
              ? listing.bathrooms + " bathrooms"
              : listing.bathrooms + " bathroom"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaParking className="text-lg" />
            {listing.parking ? " Parking available" : " No parking"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaChair className="text-lg" />
            {listing.furnished ? " Furnished" : " Not furnished"}
          </li>
        </ul>
        {currentUser && currentUser._id !== listing.userRef && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95"
          >
            Contact landloard
          </button>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </div>
  );
}
