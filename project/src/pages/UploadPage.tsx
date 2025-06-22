import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { FileUpload } from '../components/Upload/FileUpload';

export function UploadPage() {
  return (
    <Layout>
      <FileUpload />
    </Layout>
  );
}