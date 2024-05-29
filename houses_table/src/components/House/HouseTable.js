import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function HouseTable() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetch('https://anapioficeandfire.com/api/houses')
      .then(response => response.json())
      .then(data => {
        
        const promises = data.map(house => getSwornMembersNames(house.swornMembers));
       
        Promise.all(promises).then(swornMembersNames => {
          
          const updatedHouses = data.map((house, index) => {
            return {
              ...house,
              swornMembersNames: swornMembersNames[index]
            };
          });
          setHouses(updatedHouses);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getSwornMembersNames = async (swornMembersUrls) => {
    const names = [];
    for (const url of swornMembersUrls) {
      const response = await fetch(url);
      const swornMember = await response.json();
      names.push(swornMember.name);
    }
    return names.join(', ');
  };

  return (
    <div>
      <h1>House Information</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Titles</TableCell>
              <TableCell>Sworn Members</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {houses.map((house, index) => (
              <TableRow key={index}>
                <TableCell>{house.name}</TableCell>
                <TableCell>{house.region}</TableCell>
                <TableCell>{house.titles.length > 0 ? house.titles.join(', ') : 'None'}</TableCell>
                <TableCell>{house.swornMembersNames ? house.swornMembersNames : 'None'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default HouseTable;
