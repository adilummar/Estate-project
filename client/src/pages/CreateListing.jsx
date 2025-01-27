import axios from "axios";
import { useState } from "react";

export default function CreateListing() {
  const [file, setFile] = useState([]);
  const [progress, setProgress] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  // console.log(file);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0 && selectedFiles.length <= 6) {
      setFile(selectedFiles);
      setProgress(Array(selectedFiles.length).fill(0));
    } else {
      setImageUploadError("you can only upload 6 images per listing");
    }
  };

  const storeImage = (file, index) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "profile");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dmcaonkhk/image/upload",
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const precentCompleted = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                updatedProgress[index] = precentCompleted;
                return updatedProgress;
              });
            },
          }
        );

        resolve(res.data.url);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleImageSubmit = () => {
    if (file.length === 0) {
      // alert("Please select Images first....!");
      setImageUploadError("no image updated");
      return;
    }

    setUploadingStatus("Uploading image ....");

    try {
      setUploading(true);
      const promises = file.map((file, index) => storeImage(file, index));
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        console.log(formData);
        setUploading(false);
      });

      // await fetch("/api/listing/listing-image", {
      //   method: "POST",
      //   headers: {
      //     "Content-type": "Application/json",
      //   },
      //   body: JSON.stringify({
      //     email: currentUser.email,
      //     imageges: imageUrls,
      //   }),
      // });
      setImageUploadError(false);
    } catch (error) {
      setUploadingStatus("An error occured during the upload.");
      setImageUploadError(true);
      setUploading(false);
    }
  };

  const handleImageRemove = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            name="name"
            id="name"
            maxLength={62}
            minLength={10}
            className="border p-3 rounded-lg"
            placeholder="Name"
            required
          />
          <textarea
            type="text"
            name="Description"
            id="Description"
            className="border p-3 rounded-lg"
            placeholder="Description"
            required
          />
          <input
            type="text"
            name="address"
            id="address"
            className="border p-3 rounded-lg"
            placeholder="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="beRegularPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="DiscountPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
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
              {uploading ? 'Uploading... ' : 'upload'}
            </button>
          </div>  
          <p className="text-red-500">
            {imageUploadError ? imageUploadError : ""}
          </p>
          {file.length > 0 &&
            formData.imageUrls.map((url, index) => (
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
          <button className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
