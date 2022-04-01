# Quill Pagination
> A CKEditor-like style component


Applicable version: Quill v1.3.7

```js
import 'quill-pagination';
import 'quill-pagination/lib/style.css';

new Quill('#container', {
    theme: 'snow',
    modules: {
        toolbar: {
            container: '#toolbar'
        },
        pagination: {
            userText: "{page} One", // {page} will replaced by Page Number
            autoText: '{page}',
            pageHeight: '297mm'
        }
    }
})

```