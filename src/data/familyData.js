// data/familyData.js

export const familyData = {
  name: 'Grandparents',
  children: [
    {
      name: 'Parent 1',
      role: 'Father',
      children: [
        { name: 'Me', role: 'Self' },
        { name: 'Sibling', role: 'Sibling' },
      ],
    },
    {
      name: 'Parent 2',
      role: 'Mother',
      children: [
        { name: 'Uncle', role: 'Uncle' },
        { name: 'Aunt', role: 'Aunt' },
      ],
    },
  ],
};
