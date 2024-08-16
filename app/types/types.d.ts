export interface FileStoreProps {
  nameFile: string;
  setNameFile: (param: string) => void;
}

export interface UserStoreProps {
  username: string | null;
  setUser: (param: string | null) => void;
  deleteUserStore: () => void;
}

export interface NotificationProps {
  isOpenNotification: boolean;
  message: string;
  title?: string | null;
  type?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  duration?: number;
}

export interface NotificationStoreProps {
  notification: NotificationProps;
  setNotification: (param: NotificationProps) => void;
  setResetStateNotification: () => void;
}

export interface Task {
  id: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
  productos: string | null;
  estado: 'Completado' | 'Pendiente' | 'En proceso' | 'Error';
  nombre: string;
  xtf: string;
  usuario: number;
}

export interface Models {
  id: number;
  nombre: string;
  descripcion: string;
  iliname: string;
}

export interface Rules {
  id: number;
  query: string;
  nombre: string;
  descripcion: string;
  modelo: number;
}

export interface SelectedModel {
  model: Models | null;
  setSelectedModel: (param: Models) => void;
}

export interface SelectedRule {
  id: number | string;
  setSelectedRule: (param: number | string) => void;
}

export interface ContentResponse {
  message: string;
  error?: string;
  codeStatus?: number;
}

export interface UrlsProps {
  pdf: string;
  log: string;
}

export interface ResponseNodeFetch {
  message: string;
  detail?: string;
  urls?: UrlsProps;
}
