import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCE(props) {
  const editorRef = useRef<any>(null);
  return (
    <>
      <Editor
        onChange={(e) => {
          props.onChange(editorRef.current.getContent());
        }}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={props.value || ""}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </>
  );
}
