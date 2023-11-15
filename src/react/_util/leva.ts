import { SelectProps } from 'antd';

export const genLevaOptions = (options: SelectProps['options']) => {
  const data: any = {};
  options?.forEach((item: any) => (data[item?.label || item?.value] = item?.value));
  return data;
};
