'use strict';


const Scanner = require('../../src/Scanner');


const SCAN_DIR = exports.SCAN_DIR = 'SCAN_DIR';
const DIR_SCANNED = exports.DIR_SCANNED = 'DIR_SCANNED';
const SELECT_DOC = exports.SELECT_DOC = 'SELECT_DOC';


const actionScanDir = exports.actionScanDir = (dirPath) => {

	return (dispatch) => {

		dispatch({ type: SCAN_DIR, dirPath });

		// Scanner.ScanDirectoryDelayed(dirPath, 500)
		Scanner.ScanDirectory(dirPath)
			.then(docs => {
				dispatch({ type: DIR_SCANNED, docs: docs });
			})
		;

	};

};


const actionSelectDoc = exports.actionSelectDoc = (docFilePath) => {

	return {
		type: SELECT_DOC,
		doc: docFilePath,
	};

};
