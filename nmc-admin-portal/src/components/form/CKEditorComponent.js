// src/components/form/CKEditorComponent.js

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; 
// NOTE: Ensure you have installed @ckeditor/ckeditor5-react and @ckeditor/ckeditor5-build-classic

const editorConfiguration = {
    toolbar: [ 
        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 
        'blockQuote', '|', 'undo', 'redo' 
    ],
};

const CKEditorComponent = ({ data, onChange, placeholder }) => {

  return (
    <div className="ckeditor-container text-black">
      <CKEditor
        editor={ClassicEditor}
        config={{
            ...editorConfiguration,
            placeholder: placeholder,
        }}
        // Set the initial data (value) from the form state
        data={data || ''} 
        
        // This is the key bridge: it calls the Controller's onChange function
        onChange={(event, editor) => {
          const content = editor.getData();
          // Update react-hook-form state with the new HTML content
          onChange(content); 
        }}
      />
    </div>
  );
};

export default CKEditorComponent;