import {useState} from 'react'
import api from '../../../settings/api';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { saveNotification } from '../../../utils/notifications';
import "./AddEvent.css";

export default function AddEvent() {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage,setSuccessMessage] = useState("")
  const [file,setFile] = useState(null)

  const getFile=async(e)=>{
    setFile(e.target.files[0])
  }
  const saveEvent=async(values,setSubmitting)=>{
    let eventData = new FormData();
    

    eventData.append("name",values?.name);
    eventData.append("description", values?.description);
    eventData.append("location",values?.location)
    eventData.append("date",values?.datetime?.split("T")[0])
    eventData.append("time",values?.datetime?.split("T")[1])
    eventData.append("image",file)
    eventData.append("users[]",loggedUser?.id?.toString())

    try {
        const res = await api.post("/events", eventData);
        if (res.status === 200 || res.status === 201 || res.statusText.toLowerCase() === "ok") {
            // eslint-disable-next-line no-unused-vars
            const sendNotifStatus = await saveNotification(loggedUser?.id,`New event with name: ${values?.name} created`,'all');
            setSuccessMessage('Event created successfully.')
            values = {name: "", description: "", location: "" ,datetime:""}
            setTimeout(()=>{
              setErrorMessage('')
              setSuccessMessage('')

              window.location.reload();
            },1500)
        }
      } catch (err) {
        setErrorMessage("An error while saving event, try again.");
      } finally {
        setSubmitting(false);
      }
  }
    
  return (
    <div className="full-height-center">
    <div className="title-container">
      <h2>Add New Event</h2>
    </div>
    <Formik
      initialValues={{ name: "", description: "", location: "" ,datetime:"",image:null}}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Event name is required !!!";
        } 
        if (!values.description) {
          errors.description = "Description is required !!!";
        }
        if (!values.location) {
          errors.location = "Location is required !!!";
        }
        if(!values.datetime){
          errors.datetime = "Date and time of event is required !!!"
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        saveEvent(values, setSubmitting);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="form-container">
          <h2 className="text-error">
            {errorMessage}
          </h2>
          <h2 className="text-success">
            {successMessage}
          </h2>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="label-field"
            >
              Event name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="fields-submit-form"
              placeholder="Ex: Party"
            />
            <ErrorMessage
              name="name"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="description"
              className="label-field"
            >
              Description
            </label>
            <Field
              type="text"
              id="description"
              name="description"
              placeholder="Ex: Party at the beach ..."
              className="fields-submit-form"
            />
            <ErrorMessage
              name="description"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="location"
              className="label-field"
            >
              Location
            </label>
            <Field
              type="text"
              id="location"
              name="location"
              placeholder="Ex: Tel Aviv"
              className="fields-submit-form"
            />
            <ErrorMessage
              name="location"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="datetime"
              className="label-field"
            >
              Event Date and Time
            </label>
            <Field
              type="datetime-local"
              id="datetime"
              name="datetime"
              className="fields-submit-form"
            />
            <ErrorMessage
              name="datetime"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="datetime"
              className="label-field"
            >
                Choose Event Banner Image
            </label>
            <input type='file' onChange={getFile} required/>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`button-submit ${isSubmitting ? '' : 'hover:bg-primary-light'}`}
          >
           Save Event
          </button>
        </Form>
      )}
    </Formik>
  </div>
  )
}
