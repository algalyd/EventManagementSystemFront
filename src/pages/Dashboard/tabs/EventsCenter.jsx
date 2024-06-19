import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import api from "../../../settings/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import AddEvent from '../subcomponents/AddEvent'
import SendInvitation from "../subcomponents/SendInvitation";
import { saveNotification } from "../../../utils/notifications";
import './EventsCenter.css';



const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '80%'
  },
};
const customModalInvitationStyles = {
    top: '50%',
    left: '80%',
    right: 'auto',
    bottom: 'auto',
    marginLeft: '-50%',
    transform: 'translate(-50%, -80%)',
}

export default function EventsCenter() {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [pending, setPending] = useState(true);
  const [activeSearchItem, setActiveSearchItem] = useState("name");
  const [data, setData] = useState([]);
  const [prevData,setPrevData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isUpdateEvent, setIsUpdateEvent] = useState(false);
  const [search, setSearch] = useState("");
  const [viewEvent,setViewEvent] = useState("created")
  const [upcomingEvents,setUpcomingEvents] = useState([]);
  let subtitle;
  const [modalIsOpen, setIsOpen] =  useState(false);
  const [selectedItem,setSelectedItem] = useState(null)

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1E90FF", // DodgerBlue
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "10px",
        border: "1px solid #ffffff",
      },
    },
    cells: {
      style: {
        backgroundColor: "#f9f9f9", // Light background for better contrast
        borderBottom: "1px solid #000000", // Black vertical divider
        borderRight: "1px solid #000000", // Black diagonal divider
        fontSize: "16px",
        color: "#333333",
        padding: "8px",
        textAlign: "left",
      },
    },
  };




  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "time",
      selector: (row) => row.time,
      sortable: true,
    },
  ];

  const getUserEvents = async () => {
    try {
      const res = await api.get(`/users/${loggedUser.id}`);
      if (res.data?.events) {
        setData([...res.data.events])
        setPrevData([...res.data.events])
      }
    } catch (err) {
      toast("Error occurred while fetching created Events", {
        type: "error",
      });
    }
  };

  const getUpcomingEvents=async()=>{
    try {
      const res = await api.get(`/events/upcoming/${loggedUser.id}`);
      setUpcomingEvents([...res.data])
    } catch (err) {
      toast("Error occurred while fetching upcoming Events", {
        type: "error",
      });
    }
  }

  const updateRow = async (row) => {
    if (row.selectedCount > 0) {
      setIsUpdateEvent(true);
      setSelectedItem(row?.selectedRows[0]);
    }
    else {
      setIsUpdateEvent(false);
      setSelectedItem(null);
    }
  };

  const filterData = (value) => {
    setSearch(value);
    let arr = [];
    let currentList = viewEvent === 'created' ? [...data] : [...upcomingEvents]
    switch (activeSearchItem) {
      case "name":
        arr = currentList.filter((item) =>
          item?.name?.toLowerCase().includes(value.toString().toLowerCase())
        );
        break;
      case "location":
        arr = currentList.filter((item) =>
          item?.location?.toLowerCase().includes(value.toString().toLowerCase())
        );
        break;
      case "date":
        arr = currentList.filter((item) => item?.date?.toString() == value.toString());
        break;
      default:
        break;
    }

    setTempData([...arr]);
  };

  const toggleView=(text)=>{
    if(text === 'created'){
      const arr = [...prevData]
      setData([...arr]);
    }else{
      setData([...upcomingEvents])
    }

    setViewEvent(text)
  } 

  const deleteEvent=async()=>{
    if(selectedItem==null) return;

    try{
      const res = await api.delete(`/events/${Number(selectedItem?.id)}`);
      if(res.status === 200 || res.status === 201){
        const notifStatus = await saveNotification(loggedUser?.id, selectedItem?.name + " event deleted !!!",'all');
        if(notifStatus === 200 || notifStatus===201){
          toast("Deleted Event Successfully,  notification sent to all participants.",{
            type: 'success',
            onClose: ()=>{
              window.location.reload();
            }
          })
        }
      }
    }catch(err){
      toast("An error occurred when deleting the event try again !!!",{
        type: 'error'
      })
    }
  } 


  useEffect(() => {
    getUserEvents();
    getUpcomingEvents();
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="full-container-Events">
      <div className="centered-container">
        <label
          htmlFor="default-search"
          className="search-label"
        >
          Search
        </label>
        <div className="relative-container">
          <div className="icon-events-container">
            <svg
              className="icon-events"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            id="default-search"
            type={activeSearchItem !== "date" ? "text" : "date"}
            className="search-input"
            placeholder="Search Events"
            required
            value={search}
            onChange={(e) => filterData(e.target.value)}
          />
          <button
            type="submit"
            className="search-event-button"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex-container">
        <h3 className="search-by-heading">Search by:</h3>
        <div className="search-options-container">
          <div
            onClick={() => setActiveSearchItem("name")}
            className={`option ${
              activeSearchItem == "name"
                ? "option-active"
                : "option-inactive"
            } all-option`}
          >
            <span>Name</span>
          </div>
          <div
            onClick={() => setActiveSearchItem("location")}
            className={`option ${
              activeSearchItem == "location"
                ? "option-active"
                : "option-inactive"
            } all-option`}
          >
            <span>Location</span>
          </div>
          <div
            onClick={() => setActiveSearchItem("date")}
            className={`option ${
              activeSearchItem == "date"
                ? "option-active"
                : "option-inactive"
            } all-option`}
          >
            <span>Date</span>
          </div>
        </div>
      </div>


      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Add New Event"
      >
        <div className="w-full h-full flex">
            <AddEvent />
        </div>
      </Modal>


      <div className="flex-event-container">
        <div className="flex-row-start-events">
          <h3 className="heading-view-events">View Events:</h3>
          <div className="w-auto flex flex-row items-center justify-center">
          <div
              onClick={() => toggleView('created')}
              className={`option ${
                viewEvent == "created"
                  ? "option-active"
                  : "option-inactive"
              } all-option`}
            >
              <span>My Events</span>
            </div>

            <div
              onClick={() => toggleView('upcoming')}
              className={`option ${
                viewEvent == "upcoming"
                  ? "option-active"
                  : "option-inactive"
              } all-option`}
            >
              <span>Upcoming Events</span>
            </div>
            
          </div>
        </div>
        {isUpdateEvent && (
          <>
            <button onClick={()=> deleteEvent()} className="delete-event-button">
              Delete Event
            </button>
          </>
        )}
        {!isUpdateEvent && (
          <button onClick={openModal} className="add-event-button">
            Add New Event
          </button>
        )}
        
      </div>
      <DataTable
        columns={columns}
        data={search ? tempData : viewEvent === 'created' ? data : upcomingEvents}
        pagination
        selectableRows = {viewEvent === 'created' ? true : false}
        selectableRowsSingle
        onSelectedRowsChange={(item) => updateRow(item)}
        progressPending={pending}
        expandableRows = {viewEvent === 'created' ? true : false}
        expandableRowsComponent={ExpandedComponent}
        customStyles={customStyles}
      />
      <ToastContainer />
    </div>
  );
}

// eslint-disable-next-line react/prop-types
const ExpandedComponent = ({ data }) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const usersList = JSON.parse(sessionStorage.getItem("usersList"));
  const [selectedUsers,setSelectedUsers] = useState([])

  let subtitle;
  const [modalIsOpen, setIsOpen] =  useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const sendInvitation = async () =>{
    try{
      const res = await api.post("/invitations/all",selectedUsers);
      if(res.status == 201 || res.status == 200){
        const context = selectedUsers.map((user)=>{
          return user?.userEmail
        })
        // eslint-disable-next-line react/prop-types
        const status = await saveNotification(loggedUser?.id,`You have been invited to join ${data?.name} event`,context);
        if(status == 200 || status == 201){
          toast("Invitation sent to users successfully !!!", {
            type: "success", 
          });
        }else{{
          toast("An error occurred when sending Invitation user !!!", {
            type: "error", 
          });
        }}
        setSelectedUsers([])
      }
    }catch(err){
      console.error(err)
      toast("An error while sending invitations to users try again !!!", {
        type: "error",
      });
    }
  }
  
  return(
    <div className="flex-start-container-event">
      <button onClick={openModal} className="send-invitation-button">
          Send Event Invitation
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customModalInvitationStyles}
        contentLabel="Send Event Invitation"
      >
        <div className="modal-content-container">
            <SendInvitation sendInvitation={sendInvitation} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} usersList={usersList} data={data} closeModal={closeModal}/>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  )
};
