import React, { useState, useEffect } from 'react';
import Editor from '@cvte/en-rte';
import mockContent from '../../mock/content';
import './index.less';

export default function PreviewExample() {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    new Editor('#rich-text-editor', {
      className: 'teaching-plan-editor',
      onCreated: (editor) => {
        setEditor(editor);
        window.editor = editor;
      },
      initContent: mockContent,
      readOnly: true,
      minHeight: '1024px',
    });
  }, []);

  return (
    <div className="preview-example">
      <div className="example-editor">
        <div id="rich-text-editor" />
      </div>
    </div>
  );
}