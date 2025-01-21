import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

const data = [
  { month: 'Jan', users: 2000 },
  { month: 'Feb', users: 3000 },
  { month: 'Mar', users: 4500 },
  { month: 'Apr', users: 7000 },
  { month: 'May', users: 10000 },
];

export function GrowthChart() {
  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">User Growth</h3>
        <p className="text-2xl font-bold text-primary">500% in 5 months</p>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#0A2463" 
              strokeWidth={2}
              dot={{ fill: '#0A2463', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}