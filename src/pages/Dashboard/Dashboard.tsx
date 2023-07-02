/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
//import data from '../../mocks/platforms.json'
import { Platform } from '../../models/models';
import platformService from '../../services/platform.service';
import { getUrlParams } from '../../utils/url.utillity';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';


function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState<Platform[] | null>([]);
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(false);

  // datos iniciales
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [fleet, setFleet] = useState<string>("Flota 1");

  // datos obtenidos
  const [totalPageNumber, setTotalPageNumber] = useState<number | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [firstPage, setFirstPage] = useState<string | null>(null);
  const [lastPage, setLastPage] = useState<string | null>(null);


  useEffect(() => {
    if(authService.isValidToken() === false){
      navigate("/", { replace: true });
    }else{

      fetchPlatformData(pageNumber, pageSize, fleet);
    }

  }, [])

  const fetchPlatformData = async (newPageNumber: number, newPageSize: number, newFleet: string) => {
    setLoading(true);

    const response = await platformService.getPlatforms(newPageNumber, newPageSize, newFleet);

    if (response.ok && response.data) {
      setData(response.data.data);
      setPageNumber(response.data.pageNumber);
      setTotalPageNumber(response.data.totalPages);
      setPreviousPage(response.data.previousPage);
      setNextPage(response.data.nextPage);
      setFirstPage(response.data.firstPage);
      setLastPage(response.data.lastPage);
    } else {
      // if error is "token_expired" then redirect to login
      if(response.error === "token_expired"){
        navigate("/", { replace: true });
      }
    }

    setLoading(false);

  }

  const handleNextPage = () => {
    if (nextPage) {
      setPageNumber(pageNumber + 1);
      //fetchPLaformData();
    }
  }

  const handlePreviousPage = () => {
    if (previousPage) {
      setPageNumber(pageNumber + 1);
      //fetchPLaformData();
    }
  }

  const handleFirstPage = () => {
    if (firstPage) {
      const { pageNumber: newPageNumber, pageSize: newPageSize, fleet: newFleet } = getUrlParams(firstPage);
      fetchPlatformData(newPageNumber, newPageSize, newFleet);
    }
  }

  const handleLastPage = () => {
    if (lastPage) {
      const { pageNumber: newPageNumber, pageSize: newPageSize, fleet: newFleet } = getUrlParams(lastPage);
      fetchPlatformData(newPageNumber, newPageSize, newFleet);
    }
  }

  return (
    <>
      <h1>Platforms</h1>
      <table className='styled-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((platform) => (
            <tr key={platform.id}>
              <td>{platform.name}</td>
              <td>{platform.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='table-buttons'>
        <button onClick={handlePreviousPage} disabled={!previousPage}> Previous Page</button>
        <button onClick={handleNextPage} disabled={!nextPage}> Next Page</button>
      </div>
      <div>
        <span>Page: {pageNumber} of {totalPageNumber}</span>
      </div>
      <div>
        <span onClick={handleFirstPage} className='clickable'>first page</span>
        <span> - </span>
        <span onClick={handleLastPage} className='clickable'>last page</span>
      </div>
    </>
  )
}

export default Dashboard