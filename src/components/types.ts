export type Product = {
  sku: string;
  name: string;
  brand: string;
  specializations?: {
    L1_id?: string[] | null;
    L2_id?: string[] | null;
    L3_id?: string[] | null;
  };
  type?: {
    L1_id?: string | null;
    L2_id?: string | null;
    L3_id?: string | null;
  };
};

export interface DataType {
  id: string;
  name: string;
  parentId?: string;
}

export interface TreeData {
  children?: TreeData[];
  disabled: boolean;
  title: string;
  value: string;
}
