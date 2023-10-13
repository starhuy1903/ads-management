import { ReactNode } from 'react';

export type StatusProps = {
  status?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};
