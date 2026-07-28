import React from 'react';
import EnterpriseLayout from './layout/EnterpriseLayout';

export default function SuperAdminLayout() {
  return <EnterpriseLayout isSuperAdmin={true} />;
}
