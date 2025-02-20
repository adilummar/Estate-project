import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [file, setFile] = useState([]);
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [imagesUploaded, setImagesUploaded] = useState(false); // New state
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/find/${params.id}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(error);
        return;
      }
      setFormData(data);
      console.log(params.id);
    };

    fetchListing();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0 && selectedFiles.length <= 6) {
      setFile(selectedFiles);
      setProgress(Array(selectedFiles.length).fill(0));
    } else {
      setImageUploadError("you can only upload 6 images per listing");
    }
  };

  const storeImage = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmcaonkhk/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress((prevProgress) => {
              const updatedProgress = [...prevProgress];
              updatedProgress[index] = percentCompleted;
              return updatedProgress;
            });
          },
        }
      );

      return res.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image. please try again");
    }
  };

  const handleImageSubmit = async () => {
    if (file.length === 0) {
      setImageUploadError("No image uploaded");
      return;
    }

    setUploadingStatus("Uploading image...");
    setUploading(true);

    try {
      console.log("this is file ", file);
      const promises = file.map((file, index) => storeImage(file, index));
      const urls = await Promise.all(promises);

      // Update the formData state with the new URLs
      setFormData((prevFormData) => {
        const updatedFormData = {
          ...prevFormData,
          imageUrls: [...prevFormData.imageUrls, ...urls],
        };
        console.log("Updated formData inside setFormData:", updatedFormData); // Log the updated state
        return updatedFormData;
      });

      setUploading(false);
      setImageUploadError(false);
      setUploadingStatus("Upload complete!");
      setImagesUploaded(true); // Mark images as uploaded
    } catch (error) {
      setUploadingStatus("An error occurred during the upload.");
      setImageUploadError(true);
      setUploading(false);
      setImagesUploaded(false); // Mark images as not uploaded
    }
  };

  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "textarea" ||
      e.target.type === "text"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    // console.log(formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if images are uploaded
    if (formData.imageUrls.length === 0) {
      setError("Please upload at least one image before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Include the current user's ID in the form data

      const updatedData = { ...formData, userRef: currentUser._id };
      console.log("formData before file sub", updatedData);

      // Submit the form data to the server
      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      console.log("data", data);

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/profile`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Updating the list
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            id="name"
            maxLength={62}
            minLength={10}
            className="border p-3 rounded-lg"
            placeholder="Name"
            onChange={handleInputChange}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleInputChange}
            value={formData.description}
          />
          <input
            type="text"
            name="address"
            id="address"
            className="border p-3 rounded-lg"
            placeholder="address"
            required
            onChange={handleInputChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.type === "sale"}
              />
              <span>sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={1000000}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleInputChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            images:{" "}
            <span className="font-normal ml-2 text-gray-500">
              The first image will be the cover (max: 6)
            </span>
          </p>
          <div className=" flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="p-3 border border-green-700 text-gtreen rounded hover:shadow-lg disable:opacity-80"
            >
              {uploading ? "Uploading... " : "upload"}
            </button>
          </div>
          <p className="text-red-500">
            {imageUploadError ? imageUploadError : ""}
          </p>
          {formData.imageUrls.map((url, index) => (
            <div
              className="flex justify-between items-center p-3 border "
              key={url}
            >
              <img
                key={url}
                className="h-20 w-20 object-cover rounded-lg"
                src={url}
              />
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="p-3 text-red-600 uppercase hover:opacity-90"
              >
                delete
              </button>
            </div>
          ))}
          <button
            className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80"
            disabled={
              loading || uploading || formData.imageUrls.length === 0 // Disable if no images are in the array
            }
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </main>
  );
}
