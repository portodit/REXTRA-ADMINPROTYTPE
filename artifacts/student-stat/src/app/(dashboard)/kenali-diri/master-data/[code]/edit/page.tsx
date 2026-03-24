import MasterDataDetailPage from '@/pages/kenali-diri/MasterDataDetailPage'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <MasterDataDetailPage code={code} />
}
