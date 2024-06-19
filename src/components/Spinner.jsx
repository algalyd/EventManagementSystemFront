import './Spinner.css';

export default function Spinner() {
  return (
    <div>
      <div
            className="spinner-container"
            role="status">
            <span
            className="spinner-text"
            >Loading...</span>
    </div>
    </div>
  )
}
