import React from 'react';
import DeptDetailTemplate from '@/components/activities/DeptDetailTemplate';

export const metadata = {
  title: 'Activities of F.D. | Nandkunvarba Mahila College',
};

export default function FdDepartmentPage() {
  return <DeptDetailTemplate deptKey="fd" deptName="F.D. (Fashion Design)" />;
}
