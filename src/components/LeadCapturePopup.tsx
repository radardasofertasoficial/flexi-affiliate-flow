import { useEffect, useState } from 'react';
import LeadCaptureModal, { isLeadRegistered } from '@/components/LeadCaptureModal';

const STORAGE_KEY = 'lead_popup_seen';

const LeadCapturePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLeadRegistered()) return;
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LeadCaptureModal
      open={open}
      onOpenChange={setOpen}
      source="popup_15s"
    />
  );
};

export default LeadCapturePopup;
