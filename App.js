import React, { useState, useEffect } from 'react';
import './JobList.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', resumes: [] });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resumes: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    
    for (let i = 0; i < formData.resumes.length; i++) {
      data.append('resumes', formData.resumes[i]);
    }

    try {
      const response = await fetch('http://localhost:5000/apply', {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      setMessage(result.message || result.error);
    } catch (error) {
      setMessage('Error submitting application. Please try again.Because the file should be in 5 MB');
    }
  };

  return (
    <div className="container">
      <h2>Job Listings</h2>
      <ul className="job-list">
        {jobs.length > 0 ? (
          jobs.map(job => <li key={job.id}>{job.title} - {job.company}</li>)
        ) : (
          <p>Loading jobs...</p>
        )}
      </ul>

      <h2>Apply for a Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="file" accept=".pdf,.doc,.docx" multiple onChange={handleFileChange} required />
        <button type="submit">Apply</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
