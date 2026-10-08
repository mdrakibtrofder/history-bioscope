import { StoryView } from './story-view';
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StoryView slug={decodeURIComponent(slug)} />;
}
