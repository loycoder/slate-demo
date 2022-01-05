import React, { useState, useEffect } from 'react';
import Editor from '@cvte/en-rte';
import mockContent from '../../mock/content';
import mockPreviewComments from '../../mock/previewComment';
import CommentSidebar from './commentSidebar';
import CommentFloatBtns  from './CommentFloatBtns';
import Hashes from 'jshashes';
import { groupBy } from 'lodash';
import './index.less';

export default function PreviewCommentExample() {
  const [editor, setEditor] = useState(null);
  const [showCommentSidebar, setShowCommentSidebar] = useState(true);
  const [previewComments, setPreviewComments] = useState(mockPreviewComments);
  const [previewCommentGroups, setPreviewCommentGroups] = useState([]);
  const [activePreviewCommentId, setActivePreviewCommentId] = useState(null);
  const [activePreviewCommentGroup, setActivePreviewCommentGroup] = useState(null);

  useEffect(() => {
    new Editor('#rich-text-editor', {
      className: 'teaching-plan-editor',
      onCreated: (_editor) => {
        setEditor(_editor);
        window.editor = _editor;
      },
      readOnly: true,
      initContent: mockContent,
      minHeight: '1024px',
      showPreviewComment: true,
      onError: ({ error, resetErrorBoundary }) => {
        console.log('error', error);
        return <div>hello</div>
      }
    });
  }, []);

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.on('ACTIVE_PREVIEW_COMMENT_TARGET_CHANGE', onPreviewCommentTargetClick);
    return () => {
      editor.off('ACTIVE_PREVIEW_COMMENT_TARGET_CHANGE', onPreviewCommentTargetClick);
    };
  }, [previewCommentGroups, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updatePreviewCommentGroups = async () => {
      let commentsWithPosition = await editor.setPreviewComments(previewComments);
      console.log('---commentsWithPosition---', commentsWithPosition);

      commentsWithPosition = commentsWithPosition.map(item => {
        const MD5 = new Hashes.MD5;
        const groupId = MD5.hex(JSON.stringify(item.selection));
        return { ...item, groupId };
      });

      commentsWithPosition = commentsWithPosition.filter(item => {
        return item && item.pos;
      });

      const groups = Object.values(groupBy(commentsWithPosition, item => item.groupId));
      const commentGroups = groups.map((_, index) => {
        return {
          groupId: groups[index][0].groupId,
          pos: groups[index][0].pos,
          data: groups[index],
        };
      });
      setPreviewCommentGroups(commentGroups);
    };
    updatePreviewCommentGroups();
  }, [editor, previewComments]);

  const addPreviewComment = (previewComment) => {
    console.log('result', [...previewComments, previewComment]);
    setPreviewComments([...previewComments, previewComment]);
  };

  const onPreviewCommentTargetClick = ({ id }) => {
    console.log('onPreviewCommentTargetClick', id);
    setActivePreviewCommentId(id);
    for (let group of previewCommentGroups) {
      for (let comment of group.data) {
        if (comment.id === id) {
          console.log('onPreviewCommentTargetClick', group);
          setActivePreviewCommentGroup(group);
          return;
        }
      }
    }
  };

  return (
    <div className="preview-comment-example">
      <div className="example-editor">
        <div className="rich-text-edtior-wrapper">
          <div id="rich-text-editor" />
          <CommentFloatBtns
            editor={editor}
            previewCommentGroups={previewCommentGroups}
            onAddBtnClick={(id, selection, posY) => {
              editor.setHighlightRanges();
              setTimeout(() => {
                console.log('posY', posY);
                const MD5 = new Hashes.MD5;
                const groupId = MD5.hex(JSON.stringify(selection));
                addPreviewComment({ id, groupId, selection, commentContent: `这是批注内容 ${new Date()}` });
                editor.setHighlightRanges([]);
              }, 1000);
            }}
            onCommentBtnClick={(groupId) => {
              console.log('onCommentBtnClick groupId', groupId);
              const group = previewCommentGroups.find(g => g.groupId === groupId);
              if (group) {
                setActivePreviewCommentGroup(group);
                setActivePreviewCommentId(group.data[0].id);
                editor.setActivePreviewComment({ id: group.data[0].id });
              }
            }}
          />
        </div>
        
        {
          showCommentSidebar && (
            <CommentSidebar
              activePreviewCommentId={activePreviewCommentId}
              activePreviewCommentGroup={activePreviewCommentGroup}
              previewCommentGroups={previewCommentGroups}
              onClose={() => setShowCommentSidebar(false)}
            />
          )
        }
      </div>
    </div>
  );
}