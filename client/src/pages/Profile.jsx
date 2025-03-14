import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import axios from "axios";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  userSignOutFailure,
  userSignOutStart,
  userSignOutSuccess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import { set } from "mongoose";
// import { cloudinaryConfig } from "../../../api/cloudinary/cloudinary.js";

export default function Profile() {
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [onUploadProgress, setonUploadProgress] = useState(0);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [userCreated, setUserCreated] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingError, setListingError] = useState("");
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imagePreview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      uploadCloudinary(file);
    };
  };

  const uploadCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "profile");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmcaonkhk/image/upload",
        formData,
        {
          onUploadProgress: (ProgressEvent) => {
            const percentCompleted = Math.round(
              (ProgressEvent.loaded / ProgressEvent.total) * 100
            );
            console.log(percentCompleted);

            setonUploadProgress(percentCompleted);
          },
        }
      );

      const data = res.data;
      console.log(currentUser);

      console.log(data.url, currentUser.email);
      const imageApi = await fetch(
        "http://localhost:3000/api/upload/image-upload",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: currentUser.email, avatar: data.url }),
        }
      );

      const imageApiData = await imageApi.json();
      console.log(imageApiData.message);
      setImage(data.url);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
    imagePreview(file);
  };

  const handleEventChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateFailure(data));
        return;
      }
      dispatch(updateSuccess(data));
      setUserCreated(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const userSignOut = async () => {
    dispatch(userSignOutStart());
    try {
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(userSignOutFailure(data.message));
        return;
      }
      dispatch(userSignOutSuccess(data));
      navigate("/sign-in");
    } catch (error) {
      dispatch(userSignOutFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      showListingError(true);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const listing = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await listing.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => {
        prev.filter((listing) => listing._id !== id);
      });
    } catch (error) {
      setListingError("something went wrong on deleting listing");
      alert(listingError);
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleChange}
        />
        <img
          src={image ? image : currentUser.avatar}
          onClick={() => fileRef.current.click()}
          alt="profile"
          className="h-24 w-24 rounded-full self-center object-cover cursor-pointer mt-2"
        />
        {onUploadProgress > 0 && (
          <div className="flex justify-center items-center mt-4">
            <p className="text-green-600 text-lg font-semibold">
              {onUploadProgress === 100
                ? "image uploaded successfuly"
                : `image upload :${onUploadProgress} %`}
            </p>
          </div>
        )}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg"
          onChange={handleEventChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg"
          onChange={handleEventChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg"
          onChange={handleEventChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleUserDelete}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={userSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error.message : ""}</p>
      <p className="text-green-700 mt-5">
        {userCreated ? "user updated successfuly" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-800 w-full">
        show listings
      </button>
      <p className="text-red-800 w-full">
        {showListingError ? "something went wrong" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            your listing
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="p-3 flex justify-between items-center gap-4  border"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing image"
                  className="h-16 w-16 object-cover"
                />
              </Link>
              <Link
                className="flex-1 text-slate-700 font-semibold hover:underline truncate f"
                to={`/listing/${listing._id}`}
              >
                <p className="">{listing.name}</p>
              </Link>
              <div className="flex flex-col ">
                <button
                  className="uppercase text-red-700"
                  onClick={() => handleDeleteListing(listing._id)}
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="uppercase text-green-700">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
