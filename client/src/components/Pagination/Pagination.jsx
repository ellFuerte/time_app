import './Pagination.css'

export default function Pagination({ postsPerPage, totalPosts, paginate, currentPage}) {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++){
    pageNumbers.push(i)
  }

  return (
    <>
      { pageNumbers.length > 1 
        ? <div className="pagination">
            {
              pageNumbers.map((number, id) => (
                <div key={id} className={currentPage === number ? 'pageItemNow' : `pageItem`} onClick={() => paginate(number)}>
                  {number}
                </div>
              ))
            }
          </div>
      : <></>
      }
    </>
  )
}
