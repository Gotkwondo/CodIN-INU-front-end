import { ReactNode } from 'react';
import BottomNav from '@/components/Layout/Navigation/BottomNav';

export default function LayoutWithBottomNav({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto w-full flex justify-center">
      {children}
      <BottomNav />
    </div>
  );
}
