import Quill from 'quill';
import PageBreak from './format';

// ---
const icons = Quill.import('ui/icons');
icons['pagination'] = '<svg viewBox="0 0 1024 1024" width="18" height="18"><path class="ql-fill" d="M298.666667 170.666667v192h426.666666V170.666667h42.666667v234.666666H256V170.666667zM768 618.666667V853.333333h-42.666667v-192H298.666667V853.333333H256v-234.666666zM640 490.666667v42.666666h-42.666667v-42.666666zM426.666667 490.666667v42.666666H384v-42.666666zM341.333333 490.666667v42.666666H256v-42.666666zM554.666667 490.666667v42.666666h-85.333334v-42.666666zM768 490.666667v42.666666h-85.333333v-42.666666z" fill="#000000" p-id="2147"></path></svg>';

// ---
const Module = Quill.import('core/module');
const Page = {
    index: 0,
    top: 0,
    bottom: 0,
    number: 0,
    source: 'api',
    next: null,
};

function debounce(func, wait) {
    const context = this;
    const called = func;
    const waitTime = wait;
    let invoking = null;
    let time = null;

    return function invok(...args) {
        const now = Date.now();
        if (invoking)
            clearTimeout(invoking);
        if (time == null || time + waitTime > now) {
            time = now;
            invoking = setTimeout(() => {
                invok(...args);
            }, waitTime);
        } else {
            time = invoking = null;
            called.call(context, ...args);
        }
    }
}

class Pagination extends Module {
    root = null;

    static register() {
        Quill.register(PageBreak, true);
    }

    constructor(quill, options) {
        super(quill, options);
        this.options.userText = this.options.userText ?? '{page}';
        this.options.autoText = this.options.autoText ?? '{page}';
        this.root = Object.assign({}, Page);

        this.transOption();

        quill.on('text-change', debounce((delta, oldDelta, source) => {
            if (source === 'user') {
                this.mkPage();
                this.draw();
            }
        }, 200));

        let toolbar = quill.getModule('toolbar');
        toolbar.addHandler('pagination', function () {
            const range = this.quill.getSelection();
            const index = range ? range.index : this.quill.getLength();
            this.quill.insertEmbed(index, 'pagination', 'null', 'user');
            this.quill.setSelection(index + 1);
        });

        this.quill.pagination = this;
    }

    transOption() {
        // 页面高度转换
        const options = this.options;
        if (typeof options.pageHeight === 'string') {
            let div = document.createElement('div');
            div.style.height = options.pageHeight;
            div.style.position = 'absolute';
            div.style.zIndex = -9;
            document.body.appendChild(div);
            options._h = div.clientHeight;
            div.remove();
        } else if (typeof options.pageHeight === 'number') {
            options._h = options.pageHeight;
        } else {
            console.error('[Quill Pagination]:', 'options.pageHeight is required');
        }
    }

    mkPage() {
        let page = this.root;
        while (page.next) {
            if (page.source === 'api') {
                page.line.remove();
            }
            page = page.next;
        }
        this.root = page = Object.assign({}, Page);

        // 遇到分页符+1
        // 高度超过+1
        // 开始位置等于前1个分页的position
        const lines = this.quill.getLines(0);
        lines.forEach(line => {
            let bound = this.quill.getBounds(line.offset() + line.length() - 1, 1);
            // bound.top 超过后，精细计算
            let isPaging = false;
            if (line instanceof PageBreak && line.next) {
                let text = this.options.userText.replace(/\{page\}/g, page.number + 1);
                line.domNode.setAttribute('data-number', text);
                page.source = 'user';
                page.bottom = bound.bottom;
                isPaging = true;
            } else if ((bound.bottom - page.top) > this.options._h) {
                // 断行的位置
                const letterOffset = this.getLetterIndex(line.offset(), line.length(), this.options._h);
                bound = this.quill.getBounds(letterOffset - 1, 1);
                page.source = 'api';
                page.bottom = bound.bottom;
                isPaging = true;
            }
            if (isPaging) {
                // 分页
                page.next = Object.assign({}, Page);
                page.next.top = page.bottom;
                page.next.number = page.number + 1;
                page.next.index = line.offset() + line.length();
                page = page.next;
            }
        });
    }

    // 行内break位置
    getLetterIndex(offset, length, height) {
        if (length <= 2) {
            return offset;
        }
        let mid = Math.floor(length / 2);
        let { bottom } = this.quill.getBounds(offset + mid, 1);
        if (bottom > height) {
            return this.getLetterIndex(offset, mid, height);
        } else {
            return this.getLetterIndex(offset + mid, length - mid, height);
        }
    }

    draw() {
        let page = this.root;
        while (page.next) {
            if (page.source === 'api') {
                let line = document.createElement('PAGINATION');
                line.classList.add('ql-page-break-line');
                line.style.position = 'absolute';
                line.style.top = page.bottom + 'px';
                line.style.left = 0;
                line.style.right = 0;
                let text = this.options.autoText.replace(/\{page\}/g, page.number + 1);
                line.setAttribute('data-number', text);
                this.quill.container.appendChild(line);
                page.line = line;
            }
            page = page.next;
        }
    }

    getFromPosition(pos) {
        let page = this.root;
        let num = page.number;
        while (page) {
            if (page.top > pos) {
                break;
            }
            num = page.number;
            page = page.next;
        }
        return num;
    }

    resetPageHeight(height) {
        this.options.pageHeight = height;
        this.transOption();
        this.mkPage();
        this.draw();
    }
}

Quill.register('modules/pagination', Pagination);

export default Pagination;

