import React, { useEffect , useState} from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';

const Routing = (props) => {
  const map = useMap();
  const [trajectData, setTrajectData] = useState([]);

  useEffect(() => {
    console.log(props.info)
     // add a check for props.info.id to be truthy
     fetch(`${process.env.REACT_APP_API_KEY}/trip`)
     .then((response) => response.json())
     .then((data) => {
        setTrajectData(data.filter((item) => item._id === props.info))
        if (trajectData[0]) {
          const waypoints = trajectData[0].coords.map((position) => {
            const { latitude, longitude } = position;
            return L.latLng(latitude, longitude);
          });
    
          L.Routing.control({
            waypoints: waypoints,
            createMarker: function (i, waypoint, n) {
              return L.marker(waypoint.latLng, {
                draggable: true,
                icon: L.icon({
                  iconUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                }),
              });
            },
          }).addTo(map);
        }
     })
     .catch((error) => {
       console.log('Error fetching vehicle trip:', error);
     });
   
        
    
  }, [props.info]);



  return null;
};


export default  Routing