import Image from 'next/image';
import React from 'react';

const ClassroomCard = () => {
  return (
    <li className='classroom-card' aria-label="Classroom Card">
      <article>
        <div className="image-container">
          <Image 
            src="https://placehold.co/216x160" 
            alt="Classroom Image" 
            width={216} // Set the width
            height={160} // Set the height
            layout="responsive" // This will maintain the aspect ratio
          />
        </div>
        <div className="content">
          <h3>Classroom Name</h3>
          <p>Classroom Description</p>
        </div>
      </article>
    </li>
  );
}

export default ClassroomCard;