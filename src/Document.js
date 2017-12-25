'use strict';


const Fecha = require('fecha');


module.exports = class Document {

	constructor() {

		this.title      = null;
		this.status     = null;
		this.categories = [];

		this.filePath = null;
		this.fileName = null;
		this.fileExt  = null;

		this.fileSizeBytes = null;
		this.fileCreated   = null;
		this.fileModified  = null;

		this.docNumWords    = 0;
		this.docBody        = null;
		this.docFrontMatter = {};

		this.versions = [];

	}

	setTitle(title) {
		this.title = title;
	}

	getTitle() {
		return this.title;
	}

	setStatus(status) {
		this.status = status.toLowerCase().replace(/[ _]/g, '-');
	}

	getStatus() {
		return this.status;
	}

	setCategories(categories) {
		categories.sort();
		this.categories = categories;
	}

	getCategories() {
		return this.categories;
	}

	setFilePath(filePath) {
		this.filePath = filePath;
	}

	getFilePath() {
		return this.filePath;
	}

	setFileName(fileName) {
		this.fileName = fileName;
	}

	getFileName() {
		return this.fileName;
	}

	setFileExt(fileExt) {
		this.fileExt = fileExt.toLowerCase();
	}

	getFileExt() {
		return this.fileExt;
	}

	setFileSizeBytes(fileSizeBytes) {
		this.fileSizeBytes = parseInt(fileSizeBytes, 10);
	}

	getFileSizeBytes() {
		return this.fileSizeBytes;
	}

	setFileCreated(fileCreated) {
		this.fileCreated = fileCreated;
	}

	getFileCreated(format) {
		return format ? Fecha.format(this.fileCreated, format) : this.fileCreated;
	}

	setFileModified(fileModified) {
		this.fileModified = fileModified;
	}

	getFileModified(format) {
		return format ? Fecha.format(this.fileModified, format) : this.fileModified;
	}

	setDocBody(docBody) {
		this.docBody = docBody.trim();
		this.docNumWords = this.docBody.match(/\S+/g).length;
	}

	getDocBody() {
		return this.docBody;
	}

	getDocNumWords() {
		return this.docNumWords;
	}

	setDocFrontMatter(fm) {
		this.docFrontMatter = fm;
		if('title' in fm) {
			this.setTitle(fm.title);
		}
		if('status' in fm) {
			this.setStatus(fm.status);
		}
		if('categories' in fm) {
			this.setCategories(fm.categories);
		}
	}

	getDocFrontMatter() {
		return this.docFrontMatter;
	}

	addVersion(doc) {
		this.versions.push(doc);
	}

	getVersions() {
		return this.versions;
	}

}
