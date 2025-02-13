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
    <li className="classroom-card w-full sm:w-[300px] md:w-[300px] lg:w-[320px] xl:w-[350px] 2xl:w-[380px] bg-white rounded-lg shadow-sm" aria-label="Classroom Card">
      <Link href={`/classroom/${id}/stream`} className="card-link block">
        <article>
          <div 
            className="image-container w-full h-[200px] bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${image})` }}
          ></div>

          <div className="content p-4">
            <h3 className="text-lg">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default ClassroomCard;