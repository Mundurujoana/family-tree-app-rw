// src/FamilyMember.js
import React from 'react';

const FamilyMember = ({ member, addMember }) => {
  return (
    <div className="flex items-center space-x-4 border p-4 rounded-lg shadow-md bg-white">
      <img
        src={member.photo}
        alt={member.name}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h2 className="font-bold">{member.name}</h2>
        <p className="text-gray-600">{member.yearOfBirth}</p>
      </div>
      <button
        onClick={() => addMember(member.id)}
        className="ml-auto text-blue-500 hover:text-blue-700"
      >
        + Add Member
      </button>
    </div>
  );
};

export default FamilyMember;
