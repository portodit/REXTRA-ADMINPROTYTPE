import MasterDataPreviewPage from '@/pages/kenali-diri/MasterDataPreviewPage'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <MasterDataPreviewPage code={code} />
}
