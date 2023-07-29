// import React, { useState } from 'react';
// import styles from './PeopleList.module.css'; // Import the CSS module

// const PeopleList = () => {
//   const [year, setYear] = useState('');
//   const [people, setPeople] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await fetch(`http://localhost:3001/people/${year}`);
//     const data = await response.json();
//     setPeople(data);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className={styles.formContainer}>
//         <input
//           label="Year"
//           type="number"
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className={styles.yearInput}
//         />
//         <button type="submit" className={styles.submitButton}>
//           Submit
//         </button>
//       </form>
//       <div className={styles.peopleList}>
//         {people.map((person) => (
//           <div key={person.id} className={styles.person}>
//             <h2>{person.name}</h2>
//             <p>{person.occupation}</p>
//             <p>Born in {person.birthyear}</p>
//             <p>Fame score: {person.hpi}</p>
//             <p>
//               Age in {year}: {person.age}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PeopleList;

import React, { useState } from 'react';
import styles from './PeopleList.module.css';

const PeopleList = () => {
  const [year, setYear] = useState('');
  const [people, setPeople] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3001/people/${year}`);
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
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={styles.yearInput}
          placeholder="Enter a year"
        />
        <button type="submit" className={styles.submitButton}>
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
