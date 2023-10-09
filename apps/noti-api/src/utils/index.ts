import { promises as fs } from 'fs';
import { join } from 'path';

export const readTemplateFile = async (template: string) => {
  const pathToTemplate = 'apps/noti-api/templates/' + template;
  const fileData = await fs.readFile(pathToTemplate, 'utf-8');
  return fileData;
};
