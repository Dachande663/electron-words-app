'use strict';


const { combineReducers } = require('redux');


const { SCAN_DIR, DIR_SCANNED, SELECT_DOC } = require('./actions');


const FILTER_ALL = 'all';
const SORT_ASC = 'asc';
const SORT_DESC = 'desc';


const initialStateData = {
	dir: {
		dirPath: null,
		dirName: null,
	},
	docs: {},
	docSorts: {
		dateCreated: [],
		dateModified: [],
		fileName: [],
		filePath: [],
		fileSize: [],
		numWords: [],
		status: [],
		title: [],
	},
	docFilters: {
		status: {
			published: [],
			inProgress: [],
			archived: [],
		},
		category: {
			hfy: [],
			military: [],
			scifi: [],
		},
	},
};


const initialStateUi = {
	docsCurrentKey: null,
	columns: {
		title:        { width: 20, title: 'Title' },
		status:       { width: 20, title: 'Status' },
		numWords:     { width: 20, title: 'Words' },
		categories:   { width: 20, title: 'Categories' },
		dateModified: { width: 20, title: 'Date' },
	},
	columnsOrder: ['title', 'status', 'numWords', 'categories', 'dateModified'],
	currentSort: 'title',
	currentSortDir: SORT_ASC,
	filters: {
		status: {
			title: 'Status',
			options: {
				FILTER_ALL: { title: 'All' },
				archived: { title: 'Archived' },
				inProgress: { title: 'In Progress' },
				published: { title: 'Published' },
			},
			optionsOrder: [FILTER_ALL, 'published', 'inProgress', 'archived'],
		},
		category: {
			title: 'Category',
			options: {
				FILTER_ALL: { title: 'All' },
				hfy: { title: 'HFY' },
				military: { title: 'Military' },
				scifi: { title: 'Sci-fi' },
			},
			optionsOrder: [FILTER_ALL, 'hfy', 'military', 'scifi'],
		},
	},
	filtersOrder: ['status', 'category'],
	activeFilters: {
		status: FILTER_ALL,
		category: FILTER_ALL,
	},
	detailView: {
		hasDocument: false,
	},
	window: {
		title: 'Words',
	},
};


const reduceData = (state = initialStateData, action) => {

	switch(action.type) {

		case SCAN_DIR:
			return Object.assign({}, state, {
				dir: {
					dirPath: action.dirPath,
					dirName: action.dirPath, // @todo
				},
			});

		case DIR_SCANNED:

			const docs = {};
			const sorts = [];
			action.docs.forEach(doc => {
				docs[doc.getFilePath()] = doc;
				sorts.push(doc.getFilePath());
				// @todo proper
			});

			return Object.assign({}, state, {
				docs: docs,
				docSorts: {
					dateCreated: sorts,
					dateModified: sorts,
					fileName: sorts,
					filePath: sorts,
					fileSize: sorts,
					numWords: sorts,
					status: sorts,
					title: sorts,
				},
			});

		default:
			return state;

	}

};


const reduceUi = (state = initialStateUi, action) => {

	switch(action.type) {

		case SELECT_DOC:
			return Object.assign({}, state, {
				docsCurrentKey: (action.doc !== state.docsCurrentKey) ? action.doc : null,
			});

		default:
			return state;

	}

};

exports.test = () => { console.log('Testing'); }


exports.reducers = combineReducers({
	data: reduceData,
	ui: reduceUi,
});
