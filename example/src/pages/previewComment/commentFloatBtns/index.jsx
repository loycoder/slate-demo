import React, { useEffect, useState } from 'react';
import Hashes from 'jshashes';
import SVG from 'react-inlinesvg';
import AddCommentIcon from '../../../images/add_comment.svg';
import CommentIcon from '../../../images/comment.svg';
import { utils as editorUtils } from '@cvte/en-rte';
import { groupBy } from 'lodash';
import './index.less';

export default function CommentFloatBtns(props) {
  const { editor, previewCommentGroups, onAddBtnClick, onCommentBtnClick } = props; 

  const [cursorPos, setCursorPos] = useState(null);
  const [linedPreviewCommentGroups, setLinedPreviewCommentGroups] = useState([]); // 按相同起始行再分组

  useEffect(() => {
    if (!editor) {
      return;
    }

    const selector = editor.getSelector();
    document.querySelector(selector).onmouseup = () => {
      const selection = editor.getSelection();
      if (selection && !editorUtils.range.isCollapsed(selection)) {
        const pos = editor.getSelectionPositionInEditor(selection);
        setCursorPos(pos);
      } else {
        setCursorPos(null);
      }
    };
  }, [editor]);

  useEffect(() => {
    const groups = Object.values(groupBy(previewCommentGroups, item => item.pos.y));
    setLinedPreviewCommentGroups(groups);
  }, [previewCommentGroups]);

  const renderFloatCommentBtn = (linedGroups) => {
    const { y, lineHeight } = linedGroups[0].pos;
    if (cursorPos && y === cursorPos.y) {
      return;
    }

    const handleSelect = (event) => {
      event.stopPropagation();
      onCommentBtnClick(linedGroups[0].groupId)
    };

    return (
      <div className="comment-float-btn" style={{ top: `${y + lineHeight/2 - 8}px`}} onClick={handleSelect}>
        <SVG src={CommentIcon} />
      </div>
    );
  };
  
  const renderFloatAddCommentBtn = () => {
    const selection = editorUtils.editor.sortRange(editor.getSelection());
    const pos = editor.getSelectionPositionInEditor(selection);

    function handleAdd(event) {
      event.preventDefault();
      const MD5 = new Hashes.MD5;
      const id = MD5.hex(JSON.stringify(selection));
      onAddBtnClick(id, selection, pos.y);
    }

    return (
      <div className="add-float-btn" style={{ top: `${pos.y + pos.lineHeight/2 - 8}px`}} onMouseDown={handleAdd}>
        <SVG src={AddCommentIcon} />
      </div>
    );
  };

  return (
    <div className="comment-float-btns-container">
      { linedPreviewCommentGroups.map((linedGroups) => renderFloatCommentBtn(linedGroups)) }
      { cursorPos && renderFloatAddCommentBtn() }
    </div>
  );
}