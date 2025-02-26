import React, { useState } from 'react';
import { supabase } from '../config/supabase';

const ReportForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    aNumber: '',
    arrestDate: '',
    location: '',
    locationDetail: '',
    custodyDuration: '',
    address: '',
    immigrationStatus: '',
    circumstances: '',
    isap: 'no',
    isapType: '',
    iceInfoSource: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    canFollowUp: 'no'
  });

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('ice_arrest_records')
        .insert([
          {
            last_three_digits_a_number: formData.aNumber.slice(-3),
            date_of_arrest: formData.arrestDate,
            location_of_arrest: formData.location,
            courthouse_reason: formData.locationDetail,
            police_custody_duration: formData.custodyDuration,
            arrest_address: formData.address,
            immigration_status: formData.immigrationStatus,
            additional_info: formData.circumstances,
            isap_monitoring: formData.isap === 'yes',
            monitoring_type: formData.isapType,
            ice_location_source: formData.iceInfoSource,
            form_filler_name: formData.contactName,
            form_filler_email: formData.contactEmail,
            form_filler_phone: formData.contactPhone,
            follow_up: formData.canFollowUp === 'yes'
          }
        ]);
      
      if (error) throw error;

      // Clear form and close
      setFormData({
        aNumber: '',
        arrestDate: '',
        location: '',
        locationDetail: '',
        custodyDuration: '',
        address: '',
        immigrationStatus: '',
        circumstances: '',
        isap: 'no',
        isapType: '',
        iceInfoSource: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        canFollowUp: 'no'
      });
      alert('Report submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>Report ICE Arrest Information</h2>
        <p className="form-disclaimer">
          Please do not include any identifying information of the arrested/detained individual.
          This form is for Massachusetts arrests only.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Last Three Digits of A-Number:</label>
            <input
              type="text"
              maxLength="3"
              pattern="\d{3}"
              placeholder="123"
              value={formData.aNumber}
              onChange={(e) => setFormData({...formData, aNumber: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Date of ICE Arrest:</label>
            <input
              type="date"
              value={formData.arrestDate}
              onChange={(e) => setFormData({...formData, arrestDate: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Location of ICE Arrest:</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            >
              <option value="">Select location...</option>
              <option value="Home">Home</option>
              <option value="Courthouse-Custody">Courthouse (In Custody)</option>
              <option value="Courthouse-Present">Courthouse (Present, Not in Custody)</option>
              <option value="Jail">Jail</option>
              <option value="Street">Street</option>
              <option value="CarStop">Car Stop</option>
              <option value="Workplace">Workplace</option>
              <option value="Probation">Probation/Parole Office</option>
              <option value="Police">Police Precinct</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>If courthouse/probation, reason for visit:</label>
            <input
              type="text"
              value={formData.locationDetail}
              onChange={(e) => setFormData({...formData, locationDetail: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Time in police custody before ICE arrival:</label>
            <input
              type="text"
              value={formData.custodyDuration}
              onChange={(e) => setFormData({...formData, custodyDuration: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Address of arrest location:</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Immigration Status at Time of ICE Arrest:</label>
            <input
              type="text"
              value={formData.immigrationStatus}
              onChange={(e) => setFormData({...formData, immigrationStatus: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Additional circumstances:</label>
            <textarea
              value={formData.circumstances}
              onChange={(e) => setFormData({...formData, circumstances: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Under ISAP or ICE monitoring?</label>
            <select
              value={formData.isap}
              onChange={(e) => setFormData({...formData, isap: e.target.value})}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {formData.isap === 'yes' && (
            <div className="form-group">
              <label>Type of monitoring:</label>
              <input
                type="text"
                value={formData.isapType}
                onChange={(e) => setFormData({...formData, isapType: e.target.value})}
              />
            </div>
          )}

          <div className="form-group">
            <label>How did ICE obtain location information?</label>
            <textarea
              value={formData.iceInfoSource}
              onChange={(e) => setFormData({...formData, iceInfoSource: e.target.value})}
            />
          </div>

          <h3>Contact Information (Optional)</h3>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>May we follow up with you?</label>
            <select
              value={formData.canFollowUp}
              onChange={(e) => setFormData({...formData, canFollowUp: e.target.value})}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Submit Report</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm; 