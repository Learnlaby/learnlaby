import ClassroomCard from "@/components/ClassroomCard";
import Layout from "@/components/layout";

export default function Home() {
  const classroomCards = Array.from({ length: 9 }, (_, index) => (
    <ClassroomCard key={index} />
  ));

  return (
    <Layout>
      <div className="classroom-card-container">
        {classroomCards}
      </div>
    </Layout>
  );
}

