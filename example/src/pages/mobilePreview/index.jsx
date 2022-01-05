import React, { useState, useEffect } from 'react';
import Editor from '@cvte/en-rte';
import mockContent from '../../mock/content';
import mockPreviewComments from '../../mock/previewComment';
import './index.less';

export default function MobilePreviewExample() {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    new Editor('#rich-text-editor', {
      className: 'teaching-plan-editor',
      onCreated: (editor) => {
        setEditor(editor);
        window.editor = editor;

        setTimeout(() => {
          editor.setPreviewComments(mockPreviewComments);
        });
      },
      initContent: mockContent,
      readOnly: true,
      minHeight: '1024px',
      showPreviewComment: true,
    });
  }, []);

  return (
    <div className="mobile-preview-example">
      <div className="example-editor">
        <div id="rich-text-editor" />
      </div>
    </div>
  );
}