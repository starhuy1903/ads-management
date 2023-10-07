import { promises as fs } from 'fs';

export const readTemplateFile = async (template: string) => {
  const pathToTemplate = 'templates/' + template;
  const fileData = await fs.readFile(pathToTemplate, 'utf-8');
  return fileData;
};
