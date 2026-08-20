import React from 'react';
import DeptDetailTemplate from '@/components/activities/DeptDetailTemplate';

export const metadata = {
  title: 'Activities of M.Com. | Nandkunvarba Mahila College',
};

export default function McomDepartmentPage() {
  return <DeptDetailTemplate deptKey="mcom" deptName="M.Com. (Master of Commerce)" />;
}
