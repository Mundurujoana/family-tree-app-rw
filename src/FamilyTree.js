import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import { FaUser, FaPen, FaPlus, FaCamera } from 'react-icons/fa';
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
const genders = ['Male', 'Female', 'Unknown'];

// Status Options
const statusOptions = ['Living', 'Deceased'];

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
  'Nyamagabe',
];

const FamilyTree = () => {
  const [treeData, setTreeData] = useState(initialData);
  const [formStep, setFormStep] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [relationship, setRelationship] = useState('');
  const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    status: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file)); // Set the photo preview
    }
  };

  // Add or edit a member in the tree
  const addOrEditMember = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthDate ||
      !formData.birthPlace ||
      !formData.gender ||
      !formData.status
    ) {
      alert('Please provide valid inputs.');
      return;
    }

    const newMember = {
      name: `${formData.firstName} ${formData.lastName}`,
      attributes: {
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        relationship,
        gender: formData.gender,
        status: formData.status,
      },
      children: [],
      profilePhoto: profilePhoto, // Add profile photo to the member
    };

    const editNode = (node) => {
      if (node.name === currentNode) {
        node.name = newMember.name;
        node.attributes = newMember.attributes;
        node.profilePhoto = newMember.profilePhoto;
      } else if (node.children) {
        node.children.forEach(editNode);
      }
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
      if (isEditMode) {
        editNode(newTreeData);
      } else {
        addNode(newTreeData);
      }
      return newTreeData;
    });

    setFormVisible(false);
    setFormStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      birthPlace: '',
      gender: '',
      status: '',
    });
    setProfilePhoto(null);
    setIsEditMode(false);
  };

  const handlePenClick = (nodeName) => {
    setCurrentNode(nodeName);
    setIsEditMode(true);
    setFormVisible(true);
    // Find the current node's data to populate the form for editing
    const findNode = (node) => {
      if (node.name === nodeName) {
        return node;
      } else if (node.children) {
        for (let child of node.children) {
          const result = findNode(child);
          if (result) return result;
        }
      }
      return null;
    };

    const nodeData = findNode(treeData);
    if (nodeData) {
      const [firstName, lastName] = nodeData.name.split(' ');
      setFormData({
        firstName,
        lastName,
        birthDate: nodeData.attributes.birthDate,
        birthPlace: nodeData.attributes.birthPlace,
        gender: nodeData.attributes.gender,
        status: nodeData.attributes.status,
      });
      setProfilePhoto(nodeData.profilePhoto);
    }
  };

  const handlePlusClick = (nodeName) => {
    setCurrentNode(nodeName);
    setFormVisible(true);
    setIsEditMode(false); // Ensure add mode is set
  };

  const handleRelationshipChange = (e) => {
    setRelationship(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      gender: e.target.value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      status: e.target.value,
    }));
  };

  const handleNextStep = () => {
    if (!relationship && !isEditMode) {
      // No need to select relationship in edit mode
      alert('Please select a relationship.');
      return;
    }
    setFormStep(2);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addOrEditMember();
  };

  const handleBackClick = () => {
    setFormStep(1);
    setRelationship('');
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
        <circle cx={30} cy={30} r={30} className="node-circle" />
        {nodeDatum.profilePhoto ? (
          <foreignObject
            x="0"
            y="0"
            width="60"
            height="60"
            clipPath="url(#clipCircle)"
          >
            <img
              src={nodeDatum.profilePhoto}
              alt="Profile"
              className="profile-photo"
            />
          </foreignObject>
        ) : (
          <FaUser x={8} y={5} size={45} className="node-user-icon" />
        )}

        <g transform="translate(45, 45)">
          <FaCamera size={15} className="node-camera-icon" />
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
      <g transform="translate(80, 20)">
        <FaPen
          className="node-pen"
          onClick={() => handlePenClick(nodeDatum.name)}
        />
      </g>
      <g transform="translate(-20, 20)">
        <circle cx={25} cy={20} r={10} className="node-plus-background" />
        <FaPlus
          x={19}
          y={14}
          className="node-plus"
          onClick={() => handlePlusClick(nodeDatum.name)}
        />
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
            {formStep === 1 && !isEditMode ? (
              <>
                <h2>Select Relationship</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNextStep();
                  }}
                >
                  <label>
                    Relationship:
                    <select
                      value={relationship}
                      onChange={handleRelationshipChange}
                      required
                    >
                      <option value="">Select</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="form-footer">
                    <button type="submit" className="next">
                      Next
                    </button>
                    <button
                      type="button"
                      className="cancel"
                      onClick={() => setFormVisible(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>
                  {isEditMode
                    ? `Edit ${currentNode}`
                    : `Add ${relationship} to ${currentNode}`}
                  's profile
                </h2>
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
                          <option key={place} value={place}>
                            {place}
                          </option>
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
                  {!isEditMode && (
                    <label>
                      Email:
                      <input
                        type="text"
                        name="Email"
                        value={formData.Email}
                        onChange={handleFormChange}
                      />
                    </label>
                  )}
                  {isEditMode && (
                    <label>
                      Profile Photo:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {profilePhoto && (
                        <div className="photo-preview">
                          <img
                            src={profilePhoto}
                            alt="Profile Preview"
                            style={{ width: '150px', height: '150px' }}
                          />
                        </div>
                      )}
                    </label>
                  )}
                  <div className="form-footer">
                    <button type="submit" className="next">
                      {isEditMode ? 'Save Changes' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      className="cancel"
                      onClick={() => setFormVisible(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree;
