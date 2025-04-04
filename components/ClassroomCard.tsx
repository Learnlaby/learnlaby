import Link from "next/link";
import React from "react";
import { CLASSROOM_STREAM_PAGE } from "@/lib/api_routes";

interface ClassroomCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ id, name, description, image }) => {
  const classroomStreamUrl = CLASSROOM_STREAM_PAGE.replace("[id]", id);

  return (
    <li className="classroom-card w-full sm:w-[300px] md:w-[300px] lg:w-[320px] xl:w-[350px] 2xl:w-[380px] bg-white rounded-lg shadow-sm" aria-label="Classroom Card">
      <Link href={classroomStreamUrl} className="card-link block">
        <article>
          <div 
            className="image-container w-full h-[200px] bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${image})` }}
            aria-label={`Cover image for ${name}`}
          ></div>

          <div className="content p-4">
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default ClassroomCard;
