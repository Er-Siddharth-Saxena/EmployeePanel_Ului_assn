import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeesPerPage] = useState(10);

  useEffect(() => {
    const apiUrl = 'https://hub.dummyapis.com/employee?noofRecords=100&idStarts=10000';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = key => {
    if (key === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleClick = employee => {
    setSelectedEmployee(employee);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const filteredEmployees = employees.filter(employee =>
    Object.values(employee).some(val =>
      typeof val === 'string' ? val.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
    const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1 id='heading'>Employee Panel</h1>
      <div className="container">
        <div className="employee-list">
          <div className="search-bar">
            <input type="text" placeholder="Search..." onChange={e => handleSearch(e.target.value)} />
          </div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('firstName')}>Name</th>
                <th onClick={() => handleSort('age')}>Age</th>
                <th onClick={() => handleSort('email')}>Email</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map(employee => (
                <tr key={employee.id} onClick={() => handleClick(employee)}>
                  <td>{employee.firstName} {employee.lastName}</td>
                  <td>{employee.age}</td>
                  <td>{employee.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
              Previous
            </button>
            <span>{`${currentPage} / ${Math.ceil(sortedEmployees.length / employeesPerPage)}`}</span>
            <button
              disabled={currentPage === Math.ceil(sortedEmployees.length / employeesPerPage)}
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
        <div className="profile-details">
          {selectedEmployee && (
            <div>
              <h2>Profile Details</h2>
              <p>Name: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
              <p>Age: {selectedEmployee.age}</p>
              <p>Email: {selectedEmployee.email}</p>
              <p>Contact Number: {selectedEmployee.contactNumber}</p>
              <p>Date of Birth: {selectedEmployee.dob}</p>
              <p>Salary: {selectedEmployee.salary}</p>
              <p>Address: {selectedEmployee.address}</p>
              <button onClick={() => setSelectedEmployee(null)}>Close Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;