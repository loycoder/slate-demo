import React, { useCallback, useMemo, useState, useRef } from 'react';
import { Editable, withReact, useSlate, Slate, useSelected, useFocused } from 'slate-react';
import { createEditor, Transforms, Text, Editor } from 'slate';
import { cloneDeep, merge } from 'lodash'
import classnames from 'classnames';
import Toolbar from '../components/toolbar/index.jsx';
import pluginMap from '../components/plugins/index.js';
import {blockWithEditor, extendWithEditor} from './common.js';
import '../css/slate-editor.less';




const SlateEditor = React.memo(({ className: _className, value, onChange, plugins: _plugins }) => {

    // 得到所有 slate 插件
    const plugins = useMemo(() => {
        return _plugins.map((item) => {
            if (typeof item === 'string') {
                return pluginMap[item] || item;
            } else if (pluginMap[item.key]) {
                return merge(cloneDeep(pluginMap[item.key]), item);
            } else {
                return item;
            }
        });
    }, [_plugins]);


    /**
     * 根据slate 编辑器的节点类型，找到对应的 插件解析渲染
     */
    const Element = React.memo((props) => {
        let { attributes, children, element, plugins } = props;
        attributes.style = attributes.style || {};
        let res, item;
        for (var i = 0, len = plugins.length; i < len; i++) {
            item = plugins[i];
            if (item.processElement) {  //  如果插件有定义自定义渲染逻辑方法，则执行
                res = item.processElement({ attributes, children, element });
                if (res) {
                    return res;
                }
            }
        }
        return <div {...attributes}>{children}</div>; // 如果找不到对应的 插件去匹配，则原样输出
    });

    /**
     * renderElement 是  slate-react 中暴露出来的渲染钩子，
     * 可以根据 props.element.type 来渲染不同的插件处理器
     *   props.attributes 可以获取到 对应 slate节点的 dom节点
     */
    const renderElement = useCallback((props) => {
        // console.log('props processElement----->: ', props.children);
        return <Element {...props} plugins={plugins} />;
    }, []);



    /**
     * 渲染编辑器内容
     * render 逻辑和  renderElement 类似。 
     * 区别在下 leaf 会更细，以 textColor 为例查看
     */
    const Leaf = React.memo((props) => {
        let { attributes, children, leaf, plugins } = props;
        const style = {};
        plugins.forEach((item) => {
            if (item.processLeaf) { 
                item.processLeaf({ attributes, children, leaf, style });
            }
        });
        if (leaf.key) {
            attributes.key = leaf.key;
        }
        return (
            <span className='test' {...attributes} style={style}>
                {children}
            </span>
        );
    });

    /**
     * 指定slate 叶子节点渲染器，例如： 渲染某个大节点下的 详细叶子节点,
     */
    const renderLeaf = useCallback((props) =>{
       return <Leaf {...props} plugins={plugins} />
    }, []);

   
    const [className, setClassName] = useState('');
    const editor = useMemo(() => {
        // withReact 用于支持 react-dom , withHistory,
        // withHistory 用于支持撤销

        /**
         * 
         * 创建一个 slate 编辑器实例，通过高阶实现功能增强
         * 通过 withReact 包裹支持react-dom, 
         * blockWithEditor 支持块级容器的插入 和删除
         */
        let editor = extendWithEditor(blockWithEditor(withReact(createEditor())));
        console.log('editor: ', editor);
        plugins.forEach(item => {
            if (item.withEditor) { // 中间钩子，插件内部改变 editor对象
                editor = item.withEditor(editor);
            }
        });
        let _className = className;

        // 监听class 变化，动态set
        Object.defineProperty(editor, 'className', {
            get() {
                return _className;
            },
            set: function (value) {
                _className = value;
                setClassName(value);
            }
        });

        return editor;
    }, []);

    const containerNode = useRef(null);
    const getContainerNode = useCallback(() => containerNode.current);

    return (
        <div className={classnames('slate-container', _className, className)} ref={containerNode}>
            <Slate editor={editor} value={value} onChange={onChange}>

                {/* slate 包裹了 Toolbar（工具条） 和 Editable（编辑区域） */}
                <Toolbar getContainerNode={getContainerNode} plugins={plugins} />
                <Editable
                    className="slate-content"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck={false}
                    autoFocus
                    onCompositionEnd={(e) => {
                        Transforms.setNodes(
                            editor,
                            {
                                key: +new Date()
                            },
                            { match: Text.isText }
                        );
                    }}
                />
            </Slate>
        </div>
    );
});


const defaultPlugins = [
    'history',
    'line',
    'fontSize',
    'lineHeight',
    'letterSpacing',
    'line',
    'textColor',
    'bold',
    'italic',
    'underlined',
    'strikethrough',
    'line',
    'superscript',
    'subscript',
    'format-clear',
    'line',
    'indent',
    'align',
    'line',
    'headings',
    'bulleted-list',
    'numbered-list',
    'block-quote',
    'block-code',
    'line',
    'linkEditor',
    'hr',
    'clear-all',
    'line',
    'fullscreen'
];

SlateEditor.defaultProps = {
    plugins: defaultPlugins
};





export default SlateEditor;

export { defaultPlugins };
