import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  const messageHandler = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandLord(data);
        console.log("this is data", data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchListing();
  }, [listing.userRef]);

  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landLord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            className="w-full border p-3 rounded-lg"
            value={message}
            onChange={messageHandler}
          ></textarea>
          <Link className="bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95" to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
        </div>
      )}
    </>
  );
}
