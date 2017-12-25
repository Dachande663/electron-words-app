'use strict';


const { Component, h, render } = require('preact');
const { connect, Provider } = require('preact-redux');

const win = require('electron').remote.getCurrentWindow();

const Proton = require('./proton');
const { actionScanDir, actionSelectDoc } = require('./actions');


const AppContainer = exports.AppContainer = ({ store }) => {
	return h(Provider, { store }, h(FinderWindowContainer));
};










const getDocsList = (state) => {

	const docs = state.data.docs;
	const currentDoc = state.ui.docsCurrentKey;

	const col = state.ui.currentSort;
	const dir = state.ui.currentSortDir;

	let ids = state.data.docSorts[col];
	if(dir === 'desc') {
		ids = ids.reverse();
	}

	const output = [];

	ids.forEach(idx => {
		const doc = docs[idx];
		doc.isCurrent = (idx === currentDoc);
		output.push(doc);
	});

	return output;

};



const FinderWindowContainerState = (state) => {
	const output = {
		windowTitle: state.ui.window.title,
		docs: getDocsList(state),
		currentDoc: (state.ui.docsCurrentKey in state.data.docs) ? state.data.docs[state.ui.docsCurrentKey] : null,
	};

	output.numDocs = output.docs.length;

	output.currentDocIdx = null;
	if(output.currentDoc) {
		for(let i = 0; i < output.numDocs; i++) {
			if(output.docs[i].getFilePath() === output.currentDoc.getFilePath()) {
				output.currentDocIdx = i;
				break;
			}
		}
	}

	return output;
};

const FinderWindowContainerDispatch = (dispatch) => {
	return {
		onClickDoc: (doc) => { dispatch(actionSelectDoc(doc.getFilePath())); },
	};
};


const KEYBOARD_LEFT  = 37;
const KEYBOARD_UP    = 38;
const KEYBOARD_RIGHT = 39;
const KEYBOARD_DOWN  = 40;

const FinderWindowContainer = exports.FinderWindowContainer = connect(FinderWindowContainerState, FinderWindowContainerDispatch)(class FinderWindowContainer extends Component {

	componentDidMount() {
		win.setTitle(this.props.windowTitle);
		this.context.store.dispatch(actionScanDir('/Users/luke/Downloads/test-docs/'));
		// this.context.store.dispatch(actionScanDir('/Users/luke/Dropbox (Personal)/iA Stories'));
		document.body.addEventListener('keydown', (e) => {
			this.handleKeyboardEvent(e.which);
		});
	}

	handleKeyboardEvent(keyCode) {
		switch(keyCode) {

			case KEYBOARD_DOWN:
				if(this.props.numDocs === 0) {
					return;
				}
				if(this.props.currentDocIdx === null) {
					return this.props.onClickDoc(this.props.docs[0]);
				}
				if(this.props.currentDocIdx < this.props.numDocs - 1) {
					return this.props.onClickDoc(this.props.docs[this.props.currentDocIdx + 1]);
				}
				break;

			case KEYBOARD_UP:
				if(this.props.numDocs === 0) {
					return;
				}
				if(this.props.currentDocIdx === null) {
					return this.props.onClickDoc(this.props.docs[this.props.numDocs - 1]);
				}
				if(this.props.currentDocIdx > 0) {
					return this.props.onClickDoc(this.props.docs[this.props.currentDocIdx - 1]);
				}
				break;

		}
	}

	render(props, state) {
		return h(FinderWindow, props);
	}

});

const FinderWindow = exports.FinderWindow = ({ docs, currentDoc, onClickDoc }) => {

	return h(Proton.Window, null, [
		h(Proton.WindowContent, null, [
			h(Proton.PaneGroup, null, [

				h(Proton.Pane, { isSidebar: true }, [
	// 				h(Proton.NavGroup, { title: 'Status', items: statuses }),
	// 				h(Proton.NavGroup, { title: 'Category', items: categories }),
				]),

				h(Proton.Pane, null, h(Proton.Table, { columns: ['Name', 'Status', 'Words', 'Categories', 'Date']},
					docs && docs.map(doc => {
						return h(DocRow, { doc, onClick: onClickDoc });
					})
				)),

				h(Proton.Pane, null, [
					h('h1', { class: 'title' }, 'Details'),
					currentDoc
						? h('h1', null, currentDoc.getTitle())
						: h('p', null, 'Pick a doc')
				]),

			])
		]),
		h(Proton.WindowFooter, null, h('h1', { class: 'title' }, `${docs.length} documents`)),
	]);

};


const DocRow = exports.DocRow = ({ doc, onClick }) => {

	return h('tr', { onClick: () => { onClick(doc); }, class: doc.isCurrent ? 'active' : '' }, [
		h('td', null, doc.getTitle()),
		h('td', null, doc.getStatus()),
		h('td', null, doc.getDocNumWords()),
		h('td', null, doc.getCategories().join(', ')),
		h('td', null, doc.getFileModified('D MMMM YYYY HH:mm')),
	]);

};
