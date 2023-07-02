import { FC, useEffect, useState } from "react";
//import data from "../../../mocks/platformbyid.json";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/auth.service";
import platformService from "../../../services/platform.service";
import { PlatformInfo, Sensor } from "../../../models/models";

interface PlatformDetailsProps {
    id: string;
    onClose: () => void;
}

const PlatformDetails: FC<PlatformDetailsProps> = ({ id, onClose }) => {
    const [data, setData] = useState<PlatformInfo | null>(null);
    const [sensorData, setSensorData] = useState<Sensor[]>([]);
    const [showIframe, setShowIframe] = useState<boolean>(false);
    const [iframeUrl, setIframeUrl] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchPlatformData(id);
    }, [id])

    const fetchPlatformData = async (platfromId: string,) => {

        if (authService.isValidToken() === false) {
            navigate("/", { replace: true });
            return;
        }

        const response = await platformService.getPlatformById(platfromId);

        if (response.ok && response.data) {
            setData(response.data);
            setSensorData(response.data.sensors);
            setIframeUrl(response.data.lastReport);
        } else {
            // if error is "token_expired" then redirect to login
            if (response.error === "token_expired") {
                navigate("/", { replace: true });
            }

            if (response.error === "platform" || response.error === "request") {
                console.log("Error trying to get platforms")
            }
        }

    }

    const handleLastReport = () => {
        setShowIframe(true);
    }

    return (
        <>
            <div className='modal-overlay'>
                <div className='modal-box'>

                    <div>Platform ID: {id}</div>
                    {data ? (
                        <div className="modal-content">
                            <div>Platform Name: {data.name}</div>
                            <div>Platform Description: {data.fleet}</div>
                            <div>Platform Fleet: {data.fleet}</div>
                            <ul>
                                {sensorData.map((sensor) => (
                                    <li key={sensor.id}>{sensor.name} - {sensor.type}</li>

                                ))}
                                {/* Colocar aqui los Records*/}
                            </ul>

                            <button className="modal-button" onClick={handleLastReport}>Show last report</button>
                            {showIframe && (
                                <iframe src={iframeUrl} title="last report" width={300} height={300} sandbox="allow-modals"/>
                            )}
                        </div>
                    ) : (
                        <div>Platform not found</div>
                    )}

                    <button onClick={onClose} >Close</button>
                </div>

            </div>
        </>
    );
};

export default PlatformDetails;