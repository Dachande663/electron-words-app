'use strict';


const FrontMatter = require('front-matter');
const Fs = require('fs');
const Path = require('path');

const Document = require('./Document');


module.exports = class Scanner {


	static GetFilesInDirectory(rawDirPath) {

		return new Promise((resolve, reject) => {

			const dirPath = Path.resolve(rawDirPath);

			Fs.readdir(dirPath, (err, files) => {

				if(err) {
					return reject(err);
				}

				const output = [];

				files.forEach(file => {
					output.push(dirPath + '/' + file);
				});

				resolve(output);

			});

		});

	}


	static FilterFiletypes(files, rawAllowedTypes) {

		const allowedTypes = {};
		rawAllowedTypes.forEach(type => {
			allowedTypes['.' + type.toLowerCase()] = true;
		});

		const output = [];

		files.forEach(file => {

			if(Path.extname(file).toLowerCase() in allowedTypes) {
				output.push(file);
			}

		});

		return output;

	}


	static ConvertFilesIntoDocuments(files) {

		const promises = [];

		files.forEach(filePath => {

			promises.push(new Promise((resolve, reject) => {

				const doc = new Document();
				const fileInfo = Path.parse(filePath);

				doc.setFilePath(filePath);
				doc.setFileName(fileInfo.base);
				doc.setFileExt(fileInfo.ext.substr(1));
				doc.setTitle(fileInfo.name);

				Fs.stat(filePath, (err, stat) => {

					doc.setFileSizeBytes(stat.size);
					doc.setFileCreated(stat.birthtime);
					doc.setFileModified(stat.mtime);

					resolve(doc);

				});

			}));

		});

		return Promise.all(promises);

	}


	static LoadFrontMatter(docs) {

		const promises = [];

		docs.forEach(doc => {

			promises.push(new Promise((resolve, reject) => {

				Fs.readFile(doc.getFilePath(), 'utf8', (err, docStr) => {

					const docInfo = FrontMatter(docStr);

					doc.setDocBody(docInfo.body);
					doc.setDocFrontMatter(docInfo.attributes);

					resolve(doc);

				});

			}));

		});

		return Promise.all(promises);

	}


	static SortDocuments(docs) {

		docs.sort((a, b) => {
			return a.getTitle().localeCompare(b.getTitle());
		});

		return docs;

	}


	static DedupeDocuments(docs) {

		const output = [];
		const map = {};

		docs.forEach(doc => {

			// mac 1: source
			// mac 2: source copy
			// mac 3: source 3

			// win 1: source
			// win 2: source - copy
			// win 3: source - copy (3)

			const titleStem = doc.getTitle().toLowerCase().replace(/ copy( [1-9][0-9]*)?| - copy( \([1-9][0-9]*\))?$/i, '');

			if(titleStem in map) {
				map[titleStem].addVersion(doc);
			} else {
				output.push(doc);
				map[titleStem] = doc;
			}

		});

		return output;

	}


	static ScanDirectory(dirPath) {

		return Scanner.GetFilesInDirectory(dirPath)
			.then(files => Scanner.FilterFiletypes(files, ['markdown', 'md', 'txt']))
			.then(files => Scanner.ConvertFilesIntoDocuments(files))
			.then(docs => Scanner.LoadFrontMatter(docs))
			.then(docs => Scanner.SortDocuments(docs))
			.then(docs => Scanner.DedupeDocuments(docs))
		;

	}


	static ScanDirectoryDelayed(dirPath, delayMs) {

		return new Promise((resolve, reject) => {

			setTimeout(() => {
				Scanner.ScanDirectory(dirPath)
					.then(docs => resolve(docs))
				;
			}, delayMs);

		});

	}


	static WatchDirectory(dirPath, cb, rawDebounceDelayMs) {

		Scanner.ScanDirectory(dirPath).then(cb);

		const debounceDelay = rawDebounceDelayMs || 100;
		let _debounceWatch = null;

		Fs.watch(dirPath, null, (e, f) => {

			if(_debounceWatch !== null) {
				clearTimeout(_debounceWatch);
			}

			_debounceWatch = setTimeout(() => {
				Scanner.ScanDirectory(dirPath).then(cb);
			}, debounceDelay);

		});

	}

}
