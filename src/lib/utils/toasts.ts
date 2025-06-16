import { toast } from 'sonner';

export const toastFunc = (text: string, status: boolean) => {
  if (status) {
    toast(text, {
      style: {
        background: '#DCFCE7',
        color: '#22C55E',
        border: `1px solid #22C55E`,
        fontSize: '14px',
      },
      duration: 5000,
      position: 'bottom-left',
    });
  } else {
    toast(text, {
      style: {
        background: '#FDECEA',
        color: '#EF4444',
        border: `1px solid #EF4444`,
        fontSize: '14px',
      },
      duration: 5000,
      position: 'bottom-left',
    });
  }
};
