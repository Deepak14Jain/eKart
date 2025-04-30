import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/adminReports');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        } else {
          console.error('Failed to fetch reports');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Sales Reports</h2>
        {reports.map((report, index) => (
          <div key={index}>
            <p>{report}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;