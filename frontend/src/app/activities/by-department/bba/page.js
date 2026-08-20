import React from 'react';
import DeptDetailTemplate from '@/components/activities/DeptDetailTemplate';

export const metadata = {
  title: 'Activities of B.B.A. | Nandkunvarba Mahila College',
};

export default function BbaDepartmentPage() {
  return <DeptDetailTemplate deptKey="bba" deptName="B.B.A. (Business Administration)" />;
}
