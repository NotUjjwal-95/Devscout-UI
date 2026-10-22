import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useJob } from '../../app/providers';
import { CloseIcon } from '../ui/icons';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { WarningBanner } from './WarningBanner';

export function AppShell() {
  const [open, setOpen] = useState(false);
  const job = useJob();
  return (
    <div className="app-shell">
      <Sidebar close={() => setOpen(false)} />
      <div className="content">
        <Topbar open={() => setOpen(true)} />
        <main>
          <WarningBanner />
          {job.status === 'running' && (
            <div className="running-bar">Learning job in progress · {Math.round(job.progress * 100)}%</div>
          )}
          <Outlet />
        </main>
      </div>
      {open && (
        <div className="mobile-drawer">
          <button onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
          <Sidebar close={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
