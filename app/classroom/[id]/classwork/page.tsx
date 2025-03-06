import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MoreVertical, FileText, SquareUserRound } from "lucide-react";

const classworkData = [
  {
    unit: "Unit 3: XX",
    items: [
      { title: "Lorem Ipsum", link: "#" },
      { title: "Lorem Ipsum", link: "#" },
    ],
  },
  {
    unit: "Unit 2: XX",
    items: [
      { title: "Lorem Ipsum", link: "#" },
      { title: "Lorem Ipsum", link: "#" },
      { title: "Lorem Ipsum", link: "#" },
      { title: "Lorem Ipsum", link: "#" },
    ],
  },
];

const Classwork = () => {
  return (
    <div className="p-10">
      <a href="#" className="text-purple-600 flex items-center mb-10">
        <SquareUserRound className="w-6 h-6 mr-2 text-purple-600" />
        View your work
      </a>


      {classworkData.map((unit, index) => (
        <div key={index} className="mb-10">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300">
            <h2 className="text-lg font-semibold">{unit.unit}</h2>
            <MoreVertical className="text-gray-500 cursor-pointer" />
          </div>

          {unit.items.map((item, idx) => (
            <Card key={idx} className="my-2 mt-transparent shadow-none border-none">
              <CardHeader className="flex flex-row items-center space-x-3 p-2">
                <FileText className="text-gray-500" />
                <CardTitle className="text-base font-normal">
                  <a href={item.link} className="text-gray-600">
                    {item.title}
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Classwork;
