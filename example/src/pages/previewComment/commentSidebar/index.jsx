import React, { useEffect } from 'react';
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import './index.less';

const INTERVAL_HEIGHT = 16;

export default function CommentSidebar(props) {
  const { activePreviewCommentId, activePreviewCommentGroup, previewCommentGroups, onClose } = props;

  const adjustPreviewGroupsPosition = () => {
    const groupDoms = document.querySelectorAll('.comment-group-item');

    if (groupDoms.length === 0) {
      return;
    }

    const activeId = activePreviewCommentId ? activePreviewCommentId :
      (activePreviewCommentGroup ? activePreviewCommentGroup.data[0].id : previewCommentGroups[0].data[0].id);
    const result = cloneDeep(previewCommentGroups);
    const activeGroupIndex= previewCommentGroups.findIndex(group => group.data.findIndex(item => item.id === activeId) !== -1);
    const activeGroup = result[activeGroupIndex];

    let nextTop = activeGroup.pos.y;
    for (let i = activeGroupIndex - 1; i >= 0; i--) {
      const curGroupDom = groupDoms[i];
      const curGroupDomRect = curGroupDom.getBoundingClientRect();

      const nextSourceTop = previewCommentGroups[i + 1].pos.y === nextTop ? previewCommentGroups[i + 1].pos.y : nextTop;
      const top =
        nextSourceTop - INTERVAL_HEIGHT < previewCommentGroups[i].pos.y + curGroupDomRect.height
          ? nextTop - curGroupDomRect.height - INTERVAL_HEIGHT
          : previewCommentGroups[i].pos.y;
      nextTop = top;
      result[i].pos.y = top;
    }

    let prevTop = activeGroup.pos.y;
    for (let i = activeGroupIndex + 1; i < previewCommentGroups.length; i++) {
      const prevGroupDom = groupDoms[i - 1];
      const prevGroupDomRect = prevGroupDom.getBoundingClientRect();

      const prevSourceTop = previewCommentGroups[i - 1].pos.y === prevTop ? previewCommentGroups[i - 1].pos.y : prevTop;
      const top =
        prevSourceTop + prevGroupDomRect.height + INTERVAL_HEIGHT > previewCommentGroups[i].pos.y
          ? prevTop + prevGroupDomRect.height + INTERVAL_HEIGHT
          : previewCommentGroups[i].pos.y;
      prevTop = top;
      result[i].pos.y = top;
    }

    groupDoms.forEach((dom, index) => dom.style.top = result[index].pos.y + 'px');
  };

  useEffect(() => {
    setTimeout(adjustPreviewGroupsPosition);
  }, [activePreviewCommentId, activePreviewCommentGroup, previewCommentGroups]);

  return (
    <div className="comment-display-container">
      <div className="comment-display-header">
        批注数量（{previewCommentGroups.length}）
        <span className="close-btn" onClick={onClose}>关闭</span>
      </div>
      <div className="comment-group-container">
        {
          previewCommentGroups.map(group => {
            return (
              <div
                className={classnames({
                  'comment-group-item': true,
                  'group-active': activePreviewCommentGroup && activePreviewCommentGroup.groupId === group.groupId
                })} 
                style={{ top: `${group.pos ? group.pos.y : 0}px` }}
              >
                {
                  group.data.map(item => {
                    return (
                      <div className="comment-content-item">{item.commentContent}</div>
                    );
                  })
                }
                {group.length}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
