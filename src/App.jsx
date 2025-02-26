import React from 'react';
import { useState, useEffect } from 'react';
import IceMap from './components/Map';
import ImmigrationBot from './components/ImmigrationBot';
import './styles/styles.css';
import ReportForm from './components/ReportForm';
import { supabase } from './config/supabase';
import backgroundImage from './assets/background.png';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    console.log("Fetching data...");
    const fetchIncidents = async () => {
      try {
        // Fetch from your existing table
        const { data: incidents, error: fetchError } = await supabase
          .from('ice_arrest_records')
          .select('*');
        
        if (fetchError) throw fetchError;
        
        // Transform data to match your existing format
        const transformedData = {
          incidents: incidents.map((incident) => ({
            id: incident.id,
            coordinates: [
              parseFloat(incident.latitude) || 42.3601,
              parseFloat(incident.longitude) || -71.0589
            ],
            location: incident.location_of_arrest,
            date: incident.date_of_arrest,
            type: incident.location_of_arrest.toLowerCase().includes('courthouse') ? 'Courthouse' : 'Jail',
            status: incident.immigration_status || 'Unknown',
            details: `${incident.additional_info || ''} ${incident.courthouse_reason ? `(Courthouse reason: ${incident.courthouse_reason})` : ''}`
          }))
        };
        
        console.log("Data loaded:", transformedData);
        setData(transformedData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err);
      }
    };
    
    fetchIncidents();
  }, []);

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%',
      paddingTop: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px 20px',
        margin: '0 auto 20px',
        width: 'fit-content',
        maxWidth: '600px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1000
      }}>
        <h1 style={{
          fontSize: '24px',
          margin: 0,
          color: '#333',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          ICE TRACKER
        </h1>
        <h2 style={{
          fontSize: '16px',
          margin: 0,
          color: '#333',
          fontWeight: '400',
          letterSpacing: '0.5px'
        }}>
          Massachusetts U.S. Immigration and Customs
          Enforcement Activities Map  
        </h2>
      </div>
      <div className="app">
        <header>
          <button 
            className="report-button-top"
            onClick={() => setIsFormOpen(true)}
          >
            Report an Incident
          </button>
        </header>
        
        <main style={{ marginTop: '-30px' }}>
          <div className="content-wrapper">
            <div className="map-section">
              {error && <div className="error">Error loading map data: {error.message}</div>}
              {data && <IceMap data={data} />}
              {!data && !error && <div>Loading map data...</div>}
            </div>
            
            <div className="rights-section">
              <div style={{ height: '100px' }} />
            </div>
          </div>
        </main>
        
        <div className="bot-section">
          <div className="bot-container">
            <ImmigrationBot mapData={data} />
          </div>
        </div>
        <ReportForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </div>
  );
}

export default App; 