import Navbar from '@/components/Navbar';
import SubscribeClient from './SubscribeClient';

export default function SubscribePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <SubscribeClient />
    </div>
  );
}
