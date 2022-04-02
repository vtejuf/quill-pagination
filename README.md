# Quill Pagination
> A CKEditor-like style component

Applicable version: Quill v1.3.7

![Example](./src/example.png "quill-pagination")

# Usage
```js
import 'quill-pagination';
import 'quill-pagination/lib/style.css';

new Quill('#container', {
    theme: 'snow',
    modules: {
        toolbar: ['pagination'],
        pagination: {
            userText: "第{page}页",
            autoText: '{page}',
            pageHeight: '140mm'
        }
    }
})

```