import React, { useState, useEffect, useRef } from 'react';
import Editor, { Toolbar, utils } from '@cvte/en-rte';
// import mockContent from '../../mock/content';
import PageLoading, { showPageLoading, hidePageLoading} from './pageLoading';
import './index.less';

export default function SimpleExample() {
  const [editor, setEditor] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    new Editor('#rich-text-editor', {
      className: 'teaching-plan-editor',
      onCreated: (_editor) => {
        setEditor(_editor);
        window.editor = _editor;
        _editor.on('ON_PASTE_START', (data) => {
          console.log('ON_PASTE_START 1data', data);
          if (data.content?.length > 80000) {
            showPageLoading();
          }
        })
        _editor.on('ON_PASTE_FINISH', (data) => {
          console.log('ON_PASTE_FINISH 1data', data);
          if (data.content?.length > 80000) {
            hidePageLoading();
          }
        })
      },
      onContentChange: (content) => {
        console.log('content', content);
      },
      onError: handleEditorError,
      env: 'test1',
      initContent: [
        {
          type: 'heading1',
          children: [{text: ''}]
        },
        {
          type: 'paragraph',
          children: [{text: ''}]
        },
        {
          type: 'paragraph',
          children: [{text: ''}]
        },
        {
          type: 'heading1',
          children: [{text: '二、教学思路'}]
        },
      ],
      // upload, 默认使用内置的 defaultUploadProvider
    });
  }, []);
  

  const insertWord = async (e) => {
    const progress = (percent) => {
      console.log('import percent', percent);
    };

    // 转换word文件为html
    const html = await utils.convert.convertWordToHtml({file: e.target.files[0], onProgress: progress, env: 'test1'});
    // html转换为编辑器内容格式
    const slateFragment = await editor.htmlConverter(html);
    // 当前编辑器追加word解析后的内容
    editor.appendContent(slateFragment);
  }

  const chooseFile = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleEditorError = ({ error, resetErrorBoundary }) => {
    return (
      <div className="error-tips">
        <div>解析异常，点击 <span className="refresh-btn" onClick={() => location.reload()}>刷新</span></div>
      </div>
    );
  };

  return (
    <div className="simple-example">
      <div className="example-editor">
        <div className="example-toolbar">
          { editor && <Toolbar editor={editor} onError={handleEditorError} />}
          <div className="extend-toolbar">
            <button onClick={chooseFile}>Word 导入</button>
            <input type="file" name="file" ref={fileInputRef} onChange={insertWord} hidden />
          </div>
        </div>
        <div id="rich-text-editor" />
      </div>
      <PageLoading />
    </div>
  );
}