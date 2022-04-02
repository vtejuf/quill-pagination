import Quill from "quill";
import 'quill/dist/quill.snow.css';
import "../lib";
import '../lib/style.css';

new Quill('#container', {
    theme: 'snow',
    modules: {
        toolbar: ['pagination'],
        pagination: {
            userText: "第{page}页",
            autoText: '{page}',
            pageHeight: '80mm'
        }
    }
})