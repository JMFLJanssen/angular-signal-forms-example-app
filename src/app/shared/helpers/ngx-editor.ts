import { Toolbar } from 'ngx-editor';

// Toolbar settings for the ngx-editor used throughout this application
export const editorToolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['subscript', 'superscript'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['undo', 'redo', 'format_clear'],
];

// Color selector: allowing all online style colors of the Dutch Goverment online styleguide.
export const editorColorPresets = [
    '#42145f',
    '#a90061',
    '#ca005d',
    '#f092cd',
    '#d52b1e',
    '#e17000',
    '#ffb612',
    '#f9e11e',
    '#673327',
    '#94710a',
    '#275937',
    '#39870c',
    '#777b00',
    '#76d2b6',
    '#01689b',
    '#007bc7',
    '#8fcae7',
    '#000000',
    '#ffffff',
    '#0e61aa',
    '#00423c',
    '#005187',
    '#0e3d6e',
];
