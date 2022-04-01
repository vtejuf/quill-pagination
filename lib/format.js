import Quill from 'quill';
const Embed = Quill.import('blots/block/embed');
class PageBreak extends Embed {}
PageBreak.blotName = 'pagination';
PageBreak.tagName = 'PAGINATION';
PageBreak.className = 'ql-page-break';

export default PageBreak;