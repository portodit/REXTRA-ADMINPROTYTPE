import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  TrendingUp,
  Briefcase,
  Award,
} from "lucide-react";

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

interface FeedbackDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: FeedbackData | null;
}

export function FeedbackDetailModal({ open, onOpenChange, feedback }: FeedbackDetailModalProps) {
  if (!feedback) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-success/10 text-success border-success/20">Terverifikasi</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "reviewed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Ditinjau</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUserTypeBadge = (type: string) => {
    return type === "expert" ? (
      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-sm px-3 py-1">
        <Award className="h-3 w-3 mr-1" />
        Expert Validator
      </Badge>
    ) : (
      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-sm px-3 py-1">
        <User className="h-3 w-3 mr-1" />
        Mahasiswa
      </Badge>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <SheetTitle className="text-xl font-bold">Detail Feedback</SheetTitle>
            {getStatusBadge(feedback.status)}
          </div>
          <SheetDescription>
            ID: {feedback.id}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="bg-gradient-to-br from-muted/30 to-muted/50 border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{feedback.userName}</h3>
                    <div className="mt-1">{getUserTypeBadge(feedback.userType)}</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(feedback.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating & Accuracy Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-foreground">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < feedback.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-foreground">
                    {feedback.rating}/5
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Skor Akurasi</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden mr-3">
                      <div
                        className={`h-full rounded-full transition-all ${
                          feedback.accuracyScore >= 80
                            ? "bg-success"
                            : feedback.accuracyScore >= 60
                            ? "bg-warning"
                            : "bg-destructive"
                        }`}
                        style={{ width: `${feedback.accuracyScore}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {feedback.accuracyScore}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Test & Category Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Informasi Tes & Kategori
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Jenis Tes</p>
                <p className="font-medium text-foreground">{feedback.testType}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Kategori Feedback</p>
                <p className="font-medium text-foreground">{feedback.feedbackCategory}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Validation Results */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              Hasil Validasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${
                feedback.professionMatch 
                  ? "bg-success/5 border-success/20" 
                  : "bg-destructive/5 border-destructive/20"
              }`}>
                <div className="flex items-center gap-3">
                  {feedback.professionMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Kecocokan Profesi</p>
                    <p className={`font-medium ${
                      feedback.professionMatch ? "text-success" : "text-destructive"
                    }`}>
                      {feedback.professionMatch ? "Sesuai" : "Tidak Sesuai"}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${
                feedback.careerInsight 
                  ? "bg-success/5 border-success/20" 
                  : "bg-destructive/5 border-destructive/20"
              }`}>
                <div className="flex items-center gap-3">
                  {feedback.careerInsight ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Insight Karier</p>
                    <p className={`font-medium ${
                      feedback.careerInsight ? "text-success" : "text-destructive"
                    }`}>
                      {feedback.careerInsight ? "Valid" : "Perlu Perbaikan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comment Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              Komentar Pengguna
            </h4>
            <Card className="bg-muted/20 border-border/50">
              <CardContent className="p-4">
                <p className="text-foreground leading-relaxed italic">
                  "{feedback.comment}"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
