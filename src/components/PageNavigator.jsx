/* eslint-disable react/prop-types */
import './PageNavigator.css'
export default function PageNavigator({paginate, setPaginate,size}) {

  const updatePageBounds = (action) => {
    let newStart = 0;
    let newEnd = 0;

    if (action === 'next') {
      if (paginate.stop === size) return;
      newStart = paginate.stop;
      newEnd = (size - paginate.stop > 9) ? paginate.stop + 9 : size;
    } else {
      if (paginate.start <= 1) return;
      newEnd = paginate.start;
      newStart = (paginate.start > 10) ? paginate.start - 9 : 1;
    }

    setPaginate({
      start: newStart,
      stop: newEnd
    });
  }


  return (
    <div className="center-column">
    <span className="info-text">
      Showing{" "}
      <span className="pagination-text">
        {paginate.start}
      </span>{" "}
      to{" "}
      <span className="pagination-text">
        {paginate?.stop}
      </span>{" "}
      of{" "}
      <span className="pagination-text">
        {size < 9 ? paginate?.stop : size}
      </span>{" "}
      Entries
    </span>
    <div className="inline-flex-btn-wrap">
      <button
      onClick={()=> updatePageBounds('previous')}
       className="prev-page-button" >
        <svg
          className="prev-svg"
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
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
        Prev
      </button>
      <button
      onClick={()=> updatePageBounds('next')}
      className="next-page-button">
        Next
        <svg
          className="next-svg"
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
      </button>
    </div>
  </div>
  )
}
