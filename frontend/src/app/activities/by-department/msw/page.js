import React from 'react';
import DeptDetailTemplate from '@/components/activities/DeptDetailTemplate';

export const metadata = {
  title: 'Activities of M.S.W. | Nandkunvarba Mahila College',
};

export default function MswDepartmentPage() {
  return <DeptDetailTemplate deptKey="msw" deptName="M.S.W. (Master of Social Work)" />;
}
