import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { TopicDataPoint } from "../types";

export const TopicChart = ({ data }: { data: TopicDataPoint[] }) => (
  <Card className="shadow-lg">
    <CardHeader><CardTitle className="flex items-center space-x-2 text-xl"><BookOpen className="h-6 w-6" /><span>Topics Completed by Subject</span></CardTitle></CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="subject" type="category" />
          <Bar dataKey="completed" fill="#a855f7" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);