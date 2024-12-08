import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
import './Dialog.scss';
const Dialog = ({ title, content, close, index, cancel, apply }) => {
    //const Dialog = forwardRef<HTMLDivElement, DialogProps>(({ title, content, close, index }, ref) => {
    const contentRef = useRef(null); // Create a ref for the content
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const dialog = document.querySelector('.Dialog-underlay');
        dialog.style.zIndex = ((index + 1) * 1000).toString();
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 100);
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    const newContent = React.cloneElement(content, Object.assign(Object.assign({}, content.props), { close: close, ref: contentRef }));
    return (_jsx("div", { className: "Dialog-underlay", children: _jsxs("div", { className: 'Dialog-main', children: [_jsxs("header", { children: [_jsx("span", { children: title }), _jsx("button", { onClick: close, className: 'Dialog-close', children: "x" })] }), _jsx("div", { className: 'Dialog-content', children: newContent }), _jsxs("div", { className: 'Dialog-button-group', children: [cancel ? _jsx("button", { onClick: () => {
                                if (contentRef.current) {
                                    contentRef.current.cancel(); // Call method on content
                                }
                            }, children: cancel }) : null, _jsx("button", { onClick: () => {
                                if (contentRef.current) {
                                    contentRef.current.apply(); // Call method on content
                                    if (close) {
                                        close();
                                    }
                                }
                            }, children: apply })] })] }) }));
};
export default Dialog;
