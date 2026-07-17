export interface MenuItem {
  label: string;
  route: string;
  permissionsAny?: string[];
  phase: string;
}
