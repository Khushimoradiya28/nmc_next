import React from 'react';
import DeptDetailTemplate from '@/components/activities/DeptDetailTemplate';

export const metadata = {
  title: 'Activities of B.C.A. | Nandkunvarba Mahila College',
};

export default function BcaDepartmentPage() {
  return <DeptDetailTemplate deptKey="bca" deptName="B.C.A. (Computer Applications)" />;
}
