import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ClassroomCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ id, name, description, image }) => {
  return (
    <li className="classroom-card" aria-label="Classroom Card">
      <Link href={`/classroom/${id}/stream`} className="card-link">
        <article>
          <div className="image-container">
            <Image
              src={image}
              alt="Classroom Image"
              width={216}
              height={160}
              layout="responsive"
            />
          </div>
          <div className="content">
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default ClassroomCard;
