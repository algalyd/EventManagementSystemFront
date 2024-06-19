import { Link } from "react-router-dom";
import { MdMessage } from 'react-icons/md';
import { MdEvent } from 'react-icons/md';
import { useState, useEffect } from "react";
import { getMyNotifications } from "../utils/notifications";
import './NavigationBar.css';

export default function NavigationBar() {
  const [noticationLength, setNoticationLength] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const updateNotif = (notif) => {
    const prevListCount = JSON.parse(
      sessionStorage.getItem("my_notifications")
    )?.length;
    const prevCount = JSON.parse(sessionStorage.getItem("notif_count"));
    let newCount =
      notif?.data?.length - prevListCount > 0
        ? prevCount + (notif?.data?.length - prevCount)
        : prevCount;
    sessionStorage.setItem("notif_count", newCount);
    setNoticationLength(newCount);
  };

  useEffect(() => {
    var interval = setInterval(async () => {
      const notif = await getMyNotifications();
      if (!notif.success) return;
      if (!isLoaded) {
        if (
          sessionStorage.getItem("notif_count") != null ||
          sessionStorage.getItem("notif_count") != undefined
        ) {
          updateNotif(notif);
        } else {
          sessionStorage.setItem("notif_count", notif?.data?.length);
          setNoticationLength(notif?.data?.length);
        }
      } else {
        if (sessionStorage.getItem("notif_count") != null) {
          updateNotif(notif);
        }
      }

      // eslint-disable-next-line no-unsafe-optional-chaining
      sessionStorage.setItem("my_notifications",JSON.stringify([...notif?.data]));
    }, 5000);

    setIsLoaded(true);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboardContainer">
      <Link
        to={"/"}
        className="logo-link"
      >
        <MdEvent />
        <h1 className="logo-title">E.M.</h1>
      </Link>
      <div className="control-container">
        <Link to={"/dashboard"}>
          <button
            type="button"
            className="dashboard-button"
          >
            Go To Dashboard
          </button>
        </Link>

       <Link to={"/dashboard?q=notification"} className="notification-link">
        <MdMessage size={22} />
        <span className="notification-badge">
            {noticationLength}
        </span>
       </Link>

      </div>
    </div>
  );
}
