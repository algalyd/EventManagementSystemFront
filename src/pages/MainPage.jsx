
import ActivityCard from "../components/ActivityCard.jsx";
import PageNavigator from "../components/PageNavigator.jsx";
import { useState, useEffect } from "react";
import api from "../settings/api";
import Spinner from "../components/Spinner.jsx";
import { MyContext } from "../components/context/MyContext";
import { useContext } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import './MainPage.css'


function MainPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paginate, setPaginate] = useState({
    start: 1,
    stop: 9,
  });
  const { eventsList, setEventsList } = useContext(MyContext);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/events");
      if (res.status === 200 || res.statusText.toLocaleLowerCase() === "ok") {
        if (res?.data?.length < 9) {
          setPaginate({
            ...paginate,
            stop: res?.data?.length,
          });
        }
        setEventsList([...res.data]);
      }
    } catch (e) {
      setErrorMessage("There is no such event available at the moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers=async ()=>{
    try{
      const res = await api.get("/users");
      if(res.status == 200 || res.status == 201){
        sessionStorage.setItem("usersList",JSON.stringify(res.data))
      }
    }catch(err){
      console.log("Error fetching users: ",err)
    }
  }

  const filterEvents = (text) => {
    setSearch(text);
  };

  useEffect(() => {
    loadEvents();
    fetchAllUsers();
  }, []);

  return (
    <div className="main-page-container">
      <div className="main-page-banner">
        <div className="main-page-overlay-container">

          <NavigationBar />

          <div className="main-page-content-container">
            <h1 className="main-page-title">Event Manager</h1>
            <span className="main-page-text-center">
              Step into Event Manager, where every occasion becomes a masterpiece.
              From orchestrating upscale corporate gatherings and enchanting weddings to celebrating special birthdays,
              <br />our platform excels in flawless event execution, ensuring every moment is unforgettable.
            </span>
          </div>
        </div>
      </div>

      <div className="main-page-section">
        {/* search section */}
        <div className="main-page-search-container">
          <div className="relative w-full flex flex-row ">
            <input
              type="text"
              className="main-page-search-input"
              placeholder="Find your next event..."
              onChange={(e) => filterEvents(e.target.value)}
            />
            <button
              type="button"
              className="main-page-search-button"
            >
              Search
            </button>
          </div>
        </div>

        <div className="main-page-events-container">

          {errorMessage && <h1>{errorMessage}</h1>}
          {!search
            ? eventsList
                ?.slice(paginate.start - 1, paginate?.stop)
                ?.map((event, index) => (
                  <ActivityCard key={event?.id + index.toString()} event={event} />
                ))
            : eventsList
                ?.filter((event) =>
                  event?.name
                    ?.toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                )
                .slice(paginate.start - 1, paginate?.stop)
                ?.map((event, index) => (
                  <ActivityCard key={event?.id + index.toString()} event={event} />
                ))}
          {isLoading && <Spinner />}
        </div>

        <PageNavigator
          paginate={paginate}
          setPaginate={setPaginate}
          size={eventsList?.length}
        />
      </div>
    </div>
  );
}

export default MainPage;
