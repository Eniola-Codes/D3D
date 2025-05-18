import { toast } from 'sonner';

export const toastFunc = (
  text: string,
  bgColor: string,
  borderColor: string,
  textColor: string
) => {
  toast(text, {
    style: {
      background: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      fontSize: '14px',
    },
    duration: 5000,
    position: 'bottom-left',
  });
};
