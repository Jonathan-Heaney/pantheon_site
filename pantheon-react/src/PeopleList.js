import React, { useState, useEffect } from 'react';
import styles from './PeopleList.module.css';

const PeopleList = () => {
  const [year, setYear] = useState('');
  const [people, setPeople] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState('');

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const response = await fetch('http://localhost:3001/occupations');
        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Error: ${response.status} ${response.statusText}\n${text}`
          );
        }
        const data = await response.json();
        setOccupations(data.map((item) => item.occupation));
      } catch (error) {
        console.error('Error fetching occupations:', error);
      }
    };

    fetchOccupations();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:3001/people/${year}?occupation=${selectedOccupation}`
    );
    const data = await response.json();
    setPeople(data);
  };

  return (
    <div>
      <div className={styles.instructionContainer}>
        <p>
          Please enter a year to see the top 10 most famous people who were
          alive in that year:
        </p>
      </div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <label>
          Enter a year:
          <input
            className={styles.yearInput}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </label>
        <label>
          Select an occupation:
          <select
            className={styles.occupationInput}
            value={selectedOccupation}
            onChange={(e) => setSelectedOccupation(e.target.value)}
          >
            <option value="">-- All --</option>
            {occupations.map((occupation, index) => (
              <option key={index} value={occupation}>
                {occupation}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
      <div className={styles.peopleList}>
        {people.map((person) => (
          <div key={person.id} className={styles.person}>
            <h2>{person.name}</h2>
            <p>{person.occupation}</p>
            <p>Born in {person.birthyear}</p>
            <p>Fame score: {Number(person.hpi).toFixed(2)}</p>
            <p>
              Age in {year}: {person.age}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleList;
