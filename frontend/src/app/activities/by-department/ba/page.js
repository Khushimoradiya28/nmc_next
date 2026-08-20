import React from 'react';
import DeptDetailTemplate from '@/components/activities/DeptDetailTemplate';

export const metadata = {
  title: 'Activities of B.A. | Nandkunvarba Mahila College',
};

export default function BaDepartmentPage() {
  return <DeptDetailTemplate deptKey="ba" deptName="B.A. (Bachelor of Arts)" />;
}
