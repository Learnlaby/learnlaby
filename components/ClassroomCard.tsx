import Image from 'next/image'
import React from 'react'

const ClassroomCard = () => {
  return (
    <li className='classroom-card' aria-label="Classroom Card">
      <article>
        <div className="image-container">
          <Image src="https://placehold.co/216x160" alt="Classroom Image" width={216} height={160} />
        </div>
        <div className="content">
          <h3>Classroom Name</h3>
          <p>Classroom Description</p>
        </div>
      </article>
    </li>
  )
}

export default ClassroomCard