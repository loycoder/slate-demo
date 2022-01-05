import React from 'react';
import ReactDOM from 'react-dom';
import IndexPage from './pages';
import SimpleExample from './pages/simple';
import PreviewExample from './pages/preview';
import PreviewCommentExample from './pages/previewComment';
import MobilePreviewExample from './pages/mobilePreview';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './editor-theme.less';

ReactDOM.render((
  <HashRouter>
    <Routes>
      <Route path='/simple' element={<SimpleExample />} />
      <Route path='/preview' element={<PreviewExample />} />
      <Route path='/previewComment' element={<PreviewCommentExample />} />
      <Route path='/m/preview' element={<MobilePreviewExample />} />
      <Route path='/' exact={true} element={<IndexPage />} />
    </Routes>
  </HashRouter>
), document.getElementById('root'));