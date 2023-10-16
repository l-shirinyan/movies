import { ReactNode } from "react";

interface IProps { field: string, children: ReactNode }

const ValidField = ({ field, children }: IProps) => {
  return field !== "N/A" ? children : null;
}

export default ValidField;