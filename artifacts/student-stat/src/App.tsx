import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRestoreAuth } from "@/hooks/auth/useRestoreAuth";
import useAuthStore from "@/store/useAuthStore";

// ─── Pages ──────────────────────────────────────────────────────────
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import ChangePasswordSuccessPage from "./pages/auth/ChangePasswordSuccessPage";
import VerifikasiAkunPage from "./pages/auth/VerifikasiAkunPage";
import VerifikasiAkunTerkirimPage from "./pages/auth/VerifikasiAkunTerkirimPage";
import VerifikasiAkunGagalPage from "./pages/auth/VerifikasiAkunGagalPage";
import LinkExpiredPage from "./pages/auth/LinkExpiredPage";

// Persona REXTRA
import PersonaRextraPage from "./pages/persona-rextra/KonfigurasiJourneyPage";
import JourneyUserDetailPage from "./pages/persona-rextra/JourneyUserDetailPage";

// Kenali Diri
import HasilTesPage from "./pages/kenali-diri/HasilTesPage";
import UmpanBalik from "./pages/kenali-diri/UmpanBalikPage";

// Kamus Karier
import KamusKarierMasterData from "./pages/kamus-karier/MasterDataPage";
import ProfesiDetail from "./pages/kamus-karier/ProfesiDetailPage";
import ProfesiEdit from "./pages/kamus-karier/ProfesiEditPage";
import PerusahaanDetail from "./pages/kamus-karier/PerusahaanDetailPage";
import PerusahaanEdit from "./pages/kamus-karier/PerusahaanEditPage";

// Membership
import MembershipFiturHakAkses from "./pages/membership/FiturHakAksesPage";
import MembershipStatusPage from "./pages/membership/StatusPage";
import MembershipDetailPage from "./pages/membership/DetailPage";
import MembershipRiwayatLangganan from "./pages/membership/RiwayatLanggananPage";
import UserMembershipDetailPage from "./pages/membership/UserDetailPage";
import PengaturanMembershipPage from "./pages/membership/PengaturanPage";
import PromoDiskonPage from "./pages/membership/PromoDiskonPage";
import PromoDiskonDetailPage from "./pages/membership/PromoDiskonDetailPage";
import TransaksiDetailPage from "./pages/membership/TransaksiDetailPage";
import RiwayatTransaksiPage from "./pages/membership/RiwayatTransaksiPage";
import InvoiceViewPage from "./pages/membership/InvoiceViewPage";

// Sistem Token
import SistemTokenIkhtisar from "./pages/sistem-token/IkhtisarPage";
import SistemTokenPengadaan from "./pages/sistem-token/PengadaanPage";
import SistemTokenLedger from "./pages/sistem-token/LedgerPage";

const queryClient = new QueryClient();

function RootRedirect() {
  const { isAuthenticated } = useAuthStore();
  return <Navigate to={isAuthenticated ? "/persona-rextra" : "/login"} replace />;
}

function AppRoutes() {
  const { isRestoring } = useRestoreAuth();

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#005DFF] border-t-transparent" />
          <p className="text-sm text-gray-500">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* ─── Auth ─── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/change-password/success" element={<ChangePasswordSuccessPage />} />
      <Route path="/verifikasi-akun" element={<VerifikasiAkunPage />} />
      <Route path="/verifikasi-akun/terkirim" element={<VerifikasiAkunTerkirimPage />} />
      <Route path="/verifikasi-akun/gagal" element={<VerifikasiAkunGagalPage />} />
      <Route path="/link-expired" element={<LinkExpiredPage />} />

      {/* ─── Kenali Diri ─── */}
      <Route path="/kenali-diri/hasil-tes" element={<HasilTesPage />} />
      <Route path="/kenali-diri/umpan-balik" element={<UmpanBalik />} />

      {/* ─── Persona REXTRA ─── */}
      <Route path="/persona-rextra" element={<PersonaRextraPage />} />
      <Route path="/persona-rextra/journey/:userId" element={<JourneyUserDetailPage />} />

      {/* ─── Kamus Karier ─── */}
      <Route path="/kamus-karier/master-data" element={<KamusKarierMasterData />} />
      <Route path="/kamus-karier/master-data/profesi/:id" element={<ProfesiDetail />} />
      <Route path="/kamus-karier/master-data/profesi/:id/edit" element={<ProfesiEdit />} />
      <Route path="/kamus-karier/master-data/perusahaan/:id" element={<PerusahaanDetail />} />
      <Route path="/kamus-karier/master-data/perusahaan/:id/edit" element={<PerusahaanEdit />} />

      {/* ─── Membership ─── */}
      <Route path="/membership/fitur-hak-akses" element={<MembershipFiturHakAkses />} />
      <Route path="/membership/status" element={<MembershipStatusPage />} />
      <Route path="/membership/status/:id" element={<MembershipDetailPage />} />
      <Route path="/membership/riwayat-langganan" element={<MembershipRiwayatLangganan />} />
      <Route path="/membership/riwayat-langganan/:userId" element={<UserMembershipDetailPage />} />
      <Route path="/membership/riwayat-transaksi" element={<Navigate to="/membership/riwayat-langganan" replace />} />
      <Route path="/membership/riwayat-transaksi/:id" element={<TransaksiDetailPage />} />
      <Route path="/membership/pengaturan" element={<PengaturanMembershipPage />} />
      <Route path="/membership/promo-diskon" element={<PromoDiskonPage />} />
      <Route path="/membership/promo-diskon/:id" element={<PromoDiskonDetailPage />} />
      <Route path="/faktur/view/:id" element={<InvoiceViewPage />} />

      {/* ─── Sistem Token ─── */}
      <Route path="/sistem-token/ikhtisar" element={<SistemTokenIkhtisar />} />
      <Route path="/sistem-token/pengadaan" element={<SistemTokenPengadaan />} />
      <Route path="/sistem-token/ledger" element={<SistemTokenLedger />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster position="top-right" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
