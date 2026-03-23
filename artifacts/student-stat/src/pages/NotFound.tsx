import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from "react";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Halaman tidak ditemukan</p>
        <Link href="/persona-rextra" className="text-primary underline hover:text-primary/90">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
