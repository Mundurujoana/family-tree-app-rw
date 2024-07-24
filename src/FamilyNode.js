// src/FamilyNode.js
import React from 'react';

const FamilyNode = ({ node, onAddMember }) => {
  return (
    <div className="family-node">
      <img src={node.photo} alt={node.name} className="node-photo" />
      <div className="node-info">
        <h2 className="node-name">{node.name}</h2>
        <p className="node-birthYear">{node.birthYear}</p>
      </div>
      <button onClick={onAddMember} className="add-member-button">+</button>
    </div>
  );
};

export default FamilyNode;
