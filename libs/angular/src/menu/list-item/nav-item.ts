export interface NavItem {
  displayName: string;
  blank?: boolean;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}
