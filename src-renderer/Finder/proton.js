'use strict';


const { h } = require('preact');




const Window = exports.Window = ({ children }) => {
	return h('div', { class: 'window' }, children);
};


const WindowContent = exports.WindowContent = ({ children }) => {
	return h('div', { class: 'window-content' }, children);
};


const WindowHeader = exports.WindowHeader = ({ children }) => {
	return h('header', { class: 'toolbar toolbar-header' }, children);
};


const WindowFooter = exports.WindowFooter = ({ children }) => {
	return h('footer', { class: 'toolbar toolbar-footer' }, children);
};


const PaneGroup = exports.PaneGroup = ({ children }) => {
	return h('div', { class: 'pane-group' }, children);
};


const Pane = exports.Pane = ({ children, isSidebar, class: className }) => {
	const cls = isSidebar ? 'pane pane-sm sidebar' : (className ? 'pane ' + className : 'pane');
	return h('div', { class: cls }, children);
};


const NavGroup = exports.NavGroup = ({ title, items }) => {
	const children = [];
	if(title) {
		children.push(h('h5', { class: 'nav-group-title' }, title));
	}
	items && items.forEach(item => {
		children.push(h(NavGroupItem, item));
	});
	return h('nav', { class: 'nav-group' }, children);
};


const NavGroupItem = exports.NavItem = ({ title, isActive, icon, iconColor, onClick }) => {
	const children = [];
	if(icon) {
		const style = iconColor ? { color: iconColor } : {};
		children.push(h('span', { class: `icon icon-${icon}`, style }));
	}
	children.push(title);
	return h('span', { class: 'nav-group-item ' + (isActive ? 'active' : ''), onClick }, children);
};


const Table = exports.Table = ({ columns, children }) => {
	return h('table', { class: 'table-striped' }, [
		h('thead', null, [
			h('tr', null, columns && columns.map(col => {
				return h('th', null, col);
			}))
		]),
		h('tbody', null, children),

	]);
};
