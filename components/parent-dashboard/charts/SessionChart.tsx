import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import { SessionDataPoint } from "../types";

export const SessionChart = ({ data, timeRange, setTimeRange }: { data: SessionDataPoint[], timeRange: string, setTimeRange: (v: string) => void }) => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="flex items-center space-x-2 text-xl"><BarChart3 className="h-6 w-6" /><span>Daily Session Time</span></CardTitle>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);