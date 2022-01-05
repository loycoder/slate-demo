import React from 'react';
import loadingIcon from '../../../images/loding24px.svg';
import SVG from 'react-inlinesvg';
import './index.less';

export default function PageLoading(props) {
  return (
    <div className="page-loading" id="pageLoading" style={{display: 'none'}}>
      <SVG src={loadingIcon}/>
    </div>
  );
}

export function showPageLoading() {
  const pageLoadingDom = (document.querySelector('#pageLoading'));
  if (pageLoadingDom) pageLoadingDom.style.display = 'flex';
}

export function hidePageLoading() {
  const pageLoadingDom = (document.querySelector('#pageLoading'));
  if (pageLoadingDom) pageLoadingDom.style.display = 'none';
}