import { ReactNode } from 'react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

declare const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps>;

export default KeyboardShortcutsModal;