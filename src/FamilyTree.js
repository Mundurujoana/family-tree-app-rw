import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import { FaUser, FaPen, FaCamera, FaPlus } from 'react-icons/fa';
import './FamilyTree.css';

// Initial data
const initialData = {
  name: 'Munduru Joana',
  attributes: { birthDate: '1990-01-01', relationship: 'Me' },
  children: [],
};

// Relationships
const relationships = [
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Spouse',
  // Add more relationships as needed
];

// Genders
const genders = [
  'Male',
  'Female',
  'Unknown'
];

// Status Options
const statusOptions = [
  'Living',
  'Deceased'
];

// Places in Rwanda
const placesInRwanda = [
  'Kigali',
  'Butare',
  'Gisenyi',
  'Musanze',
  'Ruhengeri',
  'Gitarama',
  'Cyangugu',
  'Kibungo',
  'Kayonza',
  'Nyamagabe'
];

const FamilyTree = () => {
  const [treeData, setTreeData] = useState(initialData);
  const [formStep, setFormStep] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [profilePhotoFormVisible, setProfilePhotoFormVisible] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [relationship, setRelationship] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    status: '',
    Email: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Set the photo preview
    }
  };

  // Add a member to the tree
  const addMember = () => {
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.birthPlace || !formData.gender || !formData.status || !formData.Email) {
      alert("Please provide valid inputs for the new member.");
      return;
    }

    const newMember = {
      name: `${formData.firstName} ${formData.lastName}`,
      attributes: { birthDate: formData.birthDate, birthPlace: formData.birthPlace, relationship, gender: formData.gender, status: formData.status },
      children: [],
      profilePhoto: profilePhoto, // Add profile photo to the member
    };

    const addNode = (node) => {
      if (node.name === currentNode) {
        node.children = node.children || [];
        node.children.push(newMember);
      } else if (node.children) {
        node.children.forEach(addNode);
      }
    };

    setTreeData((prevTreeData) => {
      const newTreeData = { ...prevTreeData };
      addNode(newTreeData);
      return newTreeData;
    });

    setFormVisible(false);
    setProfilePhotoFormVisible(false);
    setFormStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      birthPlace: '',
      gender: '',
      status: '',
      Email: ''
    });
    setProfilePhoto(null);
  };

  const handlePenClick = (nodeName) => {
    addMember(nodeName);
  };

  const handlePlusClick = (nodeName) => {
    setCurrentNode(nodeName);
    setFormVisible(true);
  };

  const handleRelationshipChange = (e) => {
    setRelationship(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData(prevFormData => ({ ...prevFormData, gender: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFormData(prevFormData => ({ ...prevFormData, status: e.target.value }));
  };

  const handleNextStep = () => {
    if (!relationship) {
      alert("Please select a relationship.");
      return;
    }
    setFormStep(2);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addMember();
  };

  const handleBackClick = () => {
    setFormStep(1);
    setRelationship('');
  };

  const handleCameraClick = () => {
    setProfilePhotoFormVisible(true);
  };

  const renderCustomNode = ({ nodeDatum }) => (
    <g>
      <rect
        className={`node-rect ${nodeDatum.name === 'Munduru Joana' ? 'initial-node' : ''}`}
        width="200"
        height="90"
        x="-100"
        y="-50"
      />
      <g transform="translate(-80, -40)">
        <circle cx={25} cy={29} r={30} className="node-circle" />
        {nodeDatum.profilePhoto ? (
          <image
            href={nodeDatum.profilePhoto}
            x="0"
            y="0"
            width="60" // Ensure this fits within the circle's radius
            height="60" // Ensure this fits within the circle's radius
            clipPath="url(#clipCircle)"
          />
        ) : (
          <FaUser size={50} className="node-user-icon" />
        )}
        <defs>
          <clipPath id="clipCircle">
            <circle cx={25} cy={29} r={30} />
          </clipPath>
        </defs>
        <g transform="translate(40, 40)">
          <FaCamera size={15} className="node-camera-icon" onClick={handleCameraClick} />
        </g>
      </g>
      <text className="node-name" x="0" y="-20">
        {nodeDatum.name}
      </text>
      <text className="node-birthDate" x="0" y="0">
        {nodeDatum.attributes.birthDate}
      </text>
      <text className="node-relationship" x="0" y="20">
        {nodeDatum.attributes.relationship}
      </text>
      <g transform="translate(0, 40)">
        <circle className="node-plus-background" />
        <FaPlus className="node-plus" onClick={() => handlePlusClick(nodeDatum.name)} />
      </g>
      <g transform="translate(80, 20)">
        <FaPen className="node-pen" onClick={() => handlePenClick(nodeDatum.name)} />
      </g>
    </g>
  );
  
  return (
    <div className="tree-container">
      <Tree
        data={treeData}
        renderCustomNodeElement={renderCustomNode}
        orientation="vertical"
        pathFunc="step"
        separation={{ siblings: 2, nonSiblings: 2 }}
        translate={{ x: 600, y: 100 }}
        allowForeignObjects={true}
        enableLegacyTransitions={false}
        transitionDuration={500}
      />

      {formVisible && (
        <div className="overlay">
          <div className="form-container">
            {formStep === 1 ? (
              <>
                <h2>Select Relationship</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                  <label>
                    Relationship:
                    <select value={relationship} onChange={handleRelationshipChange} required>
                      <option value="">Select</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </label>
                  <div className="form-footer">
                    <button type="submit" className="next">Next</button>
                    <button type="button" className="cancel" onClick={() => setFormVisible(false)}>Cancel</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Add {relationship} to {currentNode}</h2>
                <form onSubmit={handleFormSubmit}>
                  <label>
                    <div className="radio-group">
                      {genders.map((gender) => (
                        <label key={gender}>
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleGenderChange}
                            required
                          />
                          {gender}
                        </label>
                      ))}
                    </div>
                  </label>
                  <div className="name-fields">
                    <label>
                      First Name:
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        required
                      />
                    </label>
                    <label>
                      Last Name:
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="name-fields">
                    <label>
                      Birth Date:
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleFormChange}
                        required
                      />
                    </label>
                    <label>
                      Birth Place:
                      <select
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select a place</option>
                        {placesInRwanda.map((place) => (
                          <option key={place} value={place}>{place}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    <div className="radio-group">
                      {statusOptions.map((status) => (
                        <label key={status}>
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={formData.status === status}
                            onChange={handleStatusChange}
                            required
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  </label>
                  <label>
                    Email:
                    <input
                      type="text"
                      name="Email"
                      value={formData.Email}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <div className="form-footer">
                    <button type="submit" className="next">Add Member</button>
                    <button type="button" className="cancel" onClick={() => setFormVisible(false)}>Cancel</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

{profilePhotoFormVisible && (
  <div className="overlay">
    <div className="form-container">
      <h2>Add Joana's Profile Photo</h2>
      {profilePhoto ? (
        <div className="photo-preview">
          <img src={profilePhoto} alt="Profile Preview" />
        </div>
      ) : (
        <div className="icon-placeholder">
          <FaUser className="react-icon" />
        </div>
      )}
      <form>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="form-footer">
          <button
            type="button"
            className="next"
            onClick={() => setProfilePhotoFormVisible(false)}
          >
            Done
          </button>
          <button
            type="button"
            className="cancel"
            onClick={() => setProfilePhotoFormVisible(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default FamilyTree;
