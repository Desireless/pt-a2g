/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
//import data from '../../mocks/platforms.json'
import { Platform } from '../../models/models';
import platformService from '../../services/platform.service';
import { getUrlParams } from '../../utils/url.utillity';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import PlatformDetails from './components/PlatformDetails';


function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState<Platform[] | null>([]);
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('');

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

  const availableFleets = ['Flota 1', 'Flota 2', 'Flota 3', 'Flota 4', 'Flota 5', 'Flota 6'];

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

      if(response.error === "platform" || response.error === "request"){
        console.log("Error trying to get platforms")
      }
    }

    setLoading(false);

  }

  const handleFleetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFleet = event.target.value;
    setFleet(newFleet);
    fetchPlatformData(pageNumber, pageSize, newFleet);
  }

  const handleNextPage = () => {
    if (nextPage) {
      const { pageNumber: newPageNumber, pageSize: newPageSize, fleet: newFleet } = getUrlParams(nextPage);
      fetchPlatformData(newPageNumber, newPageSize, newFleet);
    }
  }

  const handlePreviousPage = () => {
    if (previousPage) {
      const { pageNumber: newPageNumber, pageSize: newPageSize, fleet: newFleet } = getUrlParams(previousPage);
      fetchPlatformData(newPageNumber, newPageSize, newFleet);
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

  const openModal = (platformId: string) => {
    setSelectedPlatformId(platformId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <h1>Platforms</h1>
      <div>
      {modalOpen && <PlatformDetails id={selectedPlatformId} onClose={closeModal} />}

      </div>

      <table className='styled-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((platform) => (
            <tr key={platform.id} onClick={() => openModal(platform.id)}>
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
      <div>
        <span>Select Fleet: </span>
        <select id='fleet-select' value={fleet} onChange={handleFleetChange} title='fleet'> 
            {availableFleets.map((fleet) => (
              <option key={fleet} value={fleet}>{fleet}</option>
            )
            )}
        </select>
      </div>
      
    </>
  )
}

export default Dashboard