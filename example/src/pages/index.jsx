import React from 'react';
import { NavLink } from 'react-router-dom';
import './index.less';

export default function IndexPage() {
  return (
    <div className="index-page">
      <h1>en-rte examples</h1>
      <ul>
        <li>
          <NavLink to='/simple'>基础编辑器</NavLink>
        </li>
        <li>
          <NavLink to='/preview'>文档预览</NavLink>
        </li>
        <li>
          <NavLink to='/previewComment'>文档预览批注</NavLink>
        </li>
        <li>
          <NavLink to='/m/preview'>移动端预览</NavLink>
        </li>
      </ul>
    </div>
  );
}