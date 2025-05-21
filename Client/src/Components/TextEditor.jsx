import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';

const TextEditor = ({ onChange }) => {
  const { theme } = useSelector((state) => state.theme);
  const contentStyle =
    theme === 'dark'
      ? 'body { background-color: #18181b; color: #e5e7eb; }'
      : '';
  return (
    <Editor
      onEditorChange={onChange}
      apiKey="mww7qmvijb4577fjw6n4juy06lqaq06127q97xv1zd90s84r"
      init={{
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: theme === 'dark' ? 'dark' : 'default',
        content_style: contentStyle,
        menubar: false,
        plugins: ['lists', 'link', 'autolink', 'paste', 'anchor'],
        toolbar:
          'undo redo | bold italic underline | bullist numlist | link | blocks fontfamily fontsize',
        statusbar: false,
        height: 300,
      }}
      initialValue="Write Something..."
    />
  );
};
export default TextEditor;

{
  /* <Editor
      apiKey="mww7qmvijb4577fjw6n4juy06lqaq06127q97xv1zd90s84r"
      init={{
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: contentStyle,
        plugins: [
          // Core editing features
          'anchor',
          'autolink',
          'charmap',
          'codesample',
          'emoticons',
          'image',
          'link',
          'lists',
          'media',
          'searchreplace',
          'table',
          'visualblocks',
          'wordcount',
          // Your account includes a free trial of TinyMCE premium features
          // Try the most popular premium features until Jun 4, 2025:
        ],
        // toolbar:
        //   'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | help',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) =>
          respondWith.string(() =>
            Promise.reject('See docs to implement AI Assistant')
          ),
      }}
      initialValue="Write Something..."
    /> */
}
