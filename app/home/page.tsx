import ClassroomCard from "@/components/ClassroomCard";

export default function Home() {
  const classroomCards = Array.from({ length: 9 }, (_, index) => (
    <ClassroomCard key={index} />
  ));

  return (
    <div className="classroom-card-container">
      {classroomCards}
    </div>
  );
}

