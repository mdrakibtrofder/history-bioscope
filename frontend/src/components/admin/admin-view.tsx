'use client';
import { BarChart3, BookOpen, CalendarClock, Image as ImageIcon, MapPin, Settings2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '../ui/misc';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BlogsAdmin } from './blogs-admin';
import { Dashboard } from './dashboard';
import { EventsAdmin } from './events-admin';
import { LocationsAdmin } from './locations-admin';
import { MediaAdmin } from './media-admin';
import { Settings } from './settings';

export function AdminView() {
  const params = useSearchParams();
  const edit = params.get('edit');
  const blog = params.get('blog');
  return (
    <div>
      <PageHeader eyebrow="Admin dashboard" title="Manage the archive">
        Create and edit events, upload media, write stories and manage places. Drafts stay hidden until you publish.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue={edit ? 'events' : blog ? 'blogs' : 'dashboard'}>
          <TabsList>
            <TabsTrigger value="dashboard"><BarChart3 /> Dashboard</TabsTrigger>
            <TabsTrigger value="events"><CalendarClock /> Timeline events</TabsTrigger>
            <TabsTrigger value="media"><ImageIcon /> Media</TabsTrigger>
            <TabsTrigger value="blogs"><BookOpen /> Stories</TabsTrigger>
            <TabsTrigger value="locations"><MapPin /> Locations</TabsTrigger>
            <TabsTrigger value="settings"><Settings2 /> Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><Dashboard /></TabsContent>
          <TabsContent value="events"><EventsAdmin editId={edit} /></TabsContent>
          <TabsContent value="media"><MediaAdmin /></TabsContent>
          <TabsContent value="blogs"><BlogsAdmin editId={blog} /></TabsContent>
          <TabsContent value="locations"><LocationsAdmin /></TabsContent>
          <TabsContent value="settings"><Settings /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
