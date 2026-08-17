export interface ContextMenuItem {
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly danger?: boolean;
  readonly action: () => void;
}
