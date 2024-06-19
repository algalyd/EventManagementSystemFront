import { MyContext } from "../components/context/MyContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../settings/api";
import { CgCalendar } from "react-icons/cg";
import { FaLocationPin } from "react-icons/fa6";
import api from "../settings/api";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../components/NavigationBar.jsx";
import './EventDetail.css'

export default function EventDetail() {
  const params = useParams();
  const { eventsList } = useContext(MyContext);
  const [event, setEvent] = useState({});
  const [joining, setJoining] = useState(false);
  const [isCommenting,setIsCommenting] = useState(false)
  const [comment,setComment] = useState('')
  const [eventComments,setEventComments] = useState([])
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));

  useEffect(() => {
    let evt = eventsList.find((item) => item.id == params.id);
    if (evt) {
      sessionStorage.setItem("event", JSON.stringify(evt));
      setEvent({ ...evt });
    } else if (sessionStorage.getItem("event")) {
      evt = sessionStorage.getItem("event");
      setEvent(JSON.parse(evt));
    }

    const interval = setInterval(()=>{
      fetchEventComment()
    },5000)

    return ()=> clearInterval(interval);
  }, []);

  // function to join event
  const joinEvent = async () => {
    setJoining(true);
    const body = {
      userEmail: loggedUser.email,
      eventId: event.id,
      status: "pending",
    };
    try {
      const res = await api.post("/invitations", body);
      if (res.status === 201 || res.status === 200) {
        toast("Your invitation has been sent successfully !!!", {
          type: "success",
        });
      }
    } catch (err) {
      let message = "An error occurred while sending your invitation try again";
      if (err.response.status == 400) {
        message =
          "Sorry you have already sent invitation to this event can't send twice wait for validation please";
      }
      toast(message, {
        type: "error",
      });
    } finally {
      setJoining(false);
    }
  };

  const fetchEventComment=async()=>{
    const event = JSON.parse( sessionStorage.getItem("event"))
    try{
      const res = await api.get(`/comments/events/${event?.id}`)
      if(res.status == 200){
        console.log("EventComments: ",res.data)
        setEventComments([...res.data])
      }
    }catch(err){
      toast("Error fetching comments !!!",{
        type:'error'
      })
    }
  }

  const onSubmit=async(e)=>{
    e.preventDefault();
    if(!comment) return;
    try{
      const d = new Date();
      const body = {
        userId: loggedUser?.id,
        eventId: event?.id,
        message: comment,
        date: d.getMonth()+"-"+d.getDay()+"-"+d.getFullYear()+ " " + d.getHours()+":"+d.getMinutes()
      }

      const res = await api.post("/comments",body)
      if(res.status == 200 || res.status == 201){
        fetchEventComment()
        setComment('')
      }
    }catch(err){
      toast("Sorry couldn't send comment try again !!!",{
        type:'error'
      })
    }
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <div className="event-detail-content">
          <NavigationBar />
          <div className="event-detail-info">
            <h1 className="event-detail-title-head">Event Details</h1>

          </div>
        </div>
      </div>

      <div className="event-detail-layout">
        <img
          className={`rounded-t-md  w-${isCommenting ? '2/6': '2/5'}`}
          src={`${SERVER_URL}/${event?.image}`}
          alt=""
        />
        <div className={`w-${isCommenting ? '3/6':'2/5'} h-[100%] flex flex-col justify-around items-start`}>
          {
            !isCommenting ?
            <>
            <div>
            <h1 className="event-detail-title">
              {event?.name}
            </h1>
            <button
                type="button"
                onClick={() => setIsCommenting(true)}
                className="event-comment-button"

            >
                Comment Event
              </button>
          </div>

          <p className="event-detail-text">
            {event?.description}
          </p>
          <div className="event-detail-box">
            <p className="event-detail-item">
              <CgCalendar />
              {new Date(event?.date).toDateString()}
            </p>
            <p className="event-detail-item">
              <FaLocationPin />
              {event?.location}
            </p>
            {!joining ? (
              <button
                type="button"
                onClick={() => joinEvent()}
                className="event-detail-button-join"

              >
                Join Us
              </button>
            ) : (
              <button
                disabled
                className="event-detail-button-join-disabled"
              >
                Joining ...
              </button>
            )}
          </div>
            </>
            :
            <div className="event-detail-comment-section">
              <div className="event-detail-header-bar">
                  <h1 className="event-detail-title-text">Comments section</h1>
                  <h3 onClick={()=> setIsCommenting((isCommenting)=> !isCommenting)} className="event-detail-link">Close</h3>
              </div>


              <div className="event-detail-comments-container" style={{overflowY:'scroll'}}>

                {
                  eventComments?.map((item,index)=>(

                      item.userId !== loggedUser?.id ?
                      <div key={item?.message + index.toString()} className="event-detail-comment">
                        <span className="event-detail-comment-meta">{item?.username}</span>
                        <h3 className="event-detail-comment-text">{item?.message} </h3>
                        <span className="event-detail-comment-date">{new Date(item?.date).toDateString()}</span>
                      </div>

                      :
                      <div key={item?.message + index.toString()} className="event-detail-user-comment">
                      <span className="event-detail-comment-meta-highlighted">{item?.username}</span>
                      <h3 className="event-detail-comment-message">{item?.message} </h3>
                      <span className="event-detail-comment-meta-accent">{new Date(item?.date).toDateString()}</span>
                    </div>

                  ))
                }


              </div>
              <form className="event-detail-form-container" onSubmit={onSubmit}>
                  <input className="event-detail-input" placeholder="Enter your comment here ..." value={comment} onChange={(e)=> setComment(e.target.value)}/>
                  <button
                    type="submit"
                    className="event-detail-submit-button"

                  >
                Send
              </button>
              </form>
            </div>
          }
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
