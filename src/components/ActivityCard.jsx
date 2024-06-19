/* eslint-disable react/prop-types */

import { CgCalendar } from "react-icons/cg";
import { FaLocationPin } from "react-icons/fa6";
import { SERVER_URL } from "../settings/api";
import { Link } from "react-router-dom";
import './ActivityCard.css'

export default function ActivityCard({event}) {
  return (
    <div className="activity-card-container">
            <a href="#">
              <img className="event-image-activity-card" src={`${SERVER_URL}/${event?.image}`} alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="event-title-activity-card">
                  {event?.name}
                </h5>
              </a>
              <p className="event-description-activity-card">
                {event?.description?.substring(0,100) + " ..."}
              </p>
              <p className="event-description-activity-card">
                <CgCalendar />
                {new Date(event?.date).toDateString()}
              </p>
              <p className="event-description-activity-card">
                <FaLocationPin />
                {event?.location}
              </p>
              <div className="centered-container-activity-card">
              <Link
                to={`/event-detail/${event?.id}`}
                className="event-detail-link-activity-card"
              >
                Explore More
                <svg
                  className="custom-svg-style-activity-card"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
            </div>
          </div>
  )
}
