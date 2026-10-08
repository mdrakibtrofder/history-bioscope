'use client';
import { Copy, FileText, Film, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { useMedia, useMutate } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { EmptyState, Spinner } from '../ui/misc';

export function MediaAdmin() {
  const { data: media, isLoading } = useMedia();
  const upload = useMutate((ds, f: File) => ds.uploadMedia(f, f.name));
  const del = useMutate((ds, id: string) => ds.deleteMedia(id));
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (files: FileList | null) => {
    if (!files) return;
    setErr('');
    for (const f of Array.from(files)) {
      try {
        await upload.mutateAsync(f);
      } catch (e) {
        setErr((e as Error).message);
      }
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => (e.preventDefault(), setDrag(true))}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => (e.preventDefault(), setDrag(false), handle(e.dataTransfer.files))}
        onClick={() => ref.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition',
          drag ? 'border-royal-500 bg-royal-50' : 'border-royal-200 bg-white hover:bg-royal-50/50',
        )}
      >
        <UploadCloud className="size-10 text-royal-500" />
        <p className="mt-3 font-semibold">{upload.isPending ? 'Uploading…' : 'Drop images, videos or PDFs here, or click to browse'}</p>
        <p className="text-sm text-muted">Stored by the active storage provider (local disk via the API, or this browser in offline mode).</p>
        <input ref={ref} type="file" multiple hidden accept="image/*,video/*,application/pdf" onChange={(e) => handle(e.target.files)} />
      </div>
      {err && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}

      <div className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : !media?.length ? (
          <EmptyState title="No media yet">Uploaded files appear here and can be attached to events.</EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {media.map((m) => (
              <div key={m.id} className="group overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-square bg-royal-50">
                  {m.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.caption} className="h-full w-full object-cover" />
                  ) : m.type === 'video' ? (
                    <video src={m.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <div className="flex h-full items-center justify-center text-royal-400">{m.type === 'document' ? <FileText className="size-10" /> : <Film className="size-10" />}</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                    <Button
                      size="icon-sm"
                      variant="white"
                      title="Copy URL"
                      onClick={() => {
                        navigator.clipboard?.writeText(m.url);
                        setCopied(m.id);
                        setTimeout(() => setCopied(''), 1500);
                      }}
                    >
                      <Copy />
                    </Button>
                    <Button size="icon-sm" variant="destructive" title="Delete" onClick={() => window.confirm('Delete this file?') && del.mutate(m.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold">{m.originalName}</p>
                  <p className="text-[11px] text-muted">{copied === m.id ? 'URL copied!' : `${(m.size / 1024).toFixed(0)} KB · ${m.type}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
