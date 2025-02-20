import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingCard({ list }) {
  return (
    <div className="bg-white shadow hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[270px] ">
      <Link to={`/listing/${list._id}`}>
        <img
          src={list.imageUrls[0]}
          alt="listing image"
          className="h-[320px] sm:h-[220px] w-full sm:w-[270px] object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 h-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {list.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="w-4 h-4 text-green-700" />
            <p className="text-sm truncate w-full text-gray-700">
              {list.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {list.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            ${""}
            {list.offer
              ? (list.regularPrice - list.discountPrice).toLocaleString("en-US")
              : list.regularPrice.toLocaleString("en-US")}
              {list.type === 'rent' && '/month'}
          </p>
          <div className="text-slate-700 flex">
            <div className="font-bold text-xs">
                {list.bedrooms > 1 ? `${list.bedrooms} beds` :`${list.bedrooms} bed` }
            </div>
            <div className="font-bold text-xs">
                {list.bathrooms > 1 ? `${list.bathrooms} beds` :`${list.bathrooms} bed` }
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
