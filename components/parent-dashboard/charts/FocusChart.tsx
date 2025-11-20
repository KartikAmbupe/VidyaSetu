import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { FocusDataPoint } from "../types";

export const FocusChart = ({ data }: { data: FocusDataPoint[] }) => (
  <Card className="shadow-lg">
    <CardHeader><CardTitle className="flex items-center space-x-2 text-xl"><TrendingUp className="h-6 w-6" /><span>Focus Level Trend</span></CardTitle></CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Line type="monotone" dataKey="focus" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);