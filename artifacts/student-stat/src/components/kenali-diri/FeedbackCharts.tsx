import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface FeedbackData {
  id: string;
  userName: string;
  userType: string;
  date: string;
  testType: string;
  feedbackCategory: string;
  rating: number;
  accuracyScore: number;
  status: string;
  comment: string;
  professionMatch: boolean;
  careerInsight: boolean;
}

interface FeedbackChartsProps {
  data: FeedbackData[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export function FeedbackCharts({ data }: FeedbackChartsProps) {
  // Prepare data for rating distribution chart
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Bintang`,
    count: data.filter((d) => d.rating === rating).length,
  }));

  // Prepare data for user type pie chart
  const userTypeData = [
    { name: "Expert", value: data.filter((d) => d.userType === "expert").length },
    { name: "Mahasiswa", value: data.filter((d) => d.userType === "student").length },
  ];

  // Prepare data for feedback category chart
  const categoryData = data.reduce((acc, curr) => {
    const existing = acc.find((a) => a.category === curr.feedbackCategory);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category: curr.feedbackCategory, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);

  // Prepare data for accuracy insight
  const accuracyInsight = [
    { label: "Sangat Akurat (≥90%)", value: data.filter((d) => d.accuracyScore >= 90).length },
    { label: "Akurat (80-89%)", value: data.filter((d) => d.accuracyScore >= 80 && d.accuracyScore < 90).length },
    { label: "Cukup (70-79%)", value: data.filter((d) => d.accuracyScore >= 70 && d.accuracyScore < 80).length },
    { label: "Perlu Perbaikan (<70%)", value: data.filter((d) => d.accuracyScore < 70).length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rating Distribution Bar Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Distribusi Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="rating" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Type Pie Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Distribusi Tipe Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {userTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Category Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Kategori Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Accuracy Insight Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Insight Akurasi Asesmen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accuracyInsight.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(item.value / data.length) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {data.filter((d) => d.professionMatch).length}
                </p>
                <p className="text-xs text-muted-foreground">Profesi Sesuai</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {data.filter((d) => d.careerInsight).length}
                </p>
                <p className="text-xs text-muted-foreground">Insight Karier Valid</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
