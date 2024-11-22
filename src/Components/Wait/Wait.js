import { jsx as _jsx } from "react/jsx-runtime";
import './Wait.scss';
const Wait = ({ active, spinner, relative }) => {
    return (active ?
        _jsx("div", { className: `Wait-underlay${relative ? ' Wait-relative' : ''}`, children: spinner ? _jsx("div", { className: "Wait-spinner" }) : null })
        : null);
};
export default Wait;
