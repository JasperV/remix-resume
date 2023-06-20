import Editor, { useMonaco } from '@monaco-editor/react';
import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import * as resume from '../johndoe.json';
import * as resumeSchema from 'resume-schema';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dev Page" },
    { name: "description", content: "Remix Resume!" },
  ];
};

export const loader = async () => {
  // return json(resume);
  return resume
};

export default function Index() {
  const resume  = JSON.stringify(useLoaderData<typeof loader>(),undefined,2);
  const monaco = useMonaco();
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    console.info('editor did mount')

    editorRef.current = editor;
  }

  function showValue() {
    console.log(JSON.parse(editorRef.current.getValue()));
  }

  function handleEditorChange(value, evt) {
    console.info('contents changed')
  }

  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: "http://json-resume-schema",
            fileMatch: ["*"],
            schema: resumeSchema.schema
          }
        ]
      });
    }
  }, [monaco]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Development</h1>

      <button disabled onClick={showValue}>Load localStorage</button>&nbsp;
      <button disabled onClick={showValue}>Load API</button>&nbsp;
      <button disabled onClick={showValue}>Save localStorage</button>&nbsp;
      <button disabled onClick={showValue}>Save API</button>&nbsp;
      <button disabled onClick={showValue}>Validate</button>&nbsp;
      <button onClick={showValue}>Log value</button>&nbsp;

      <Editor
        height="80vh"
        language="json"
        theme="vs-dark"
        value={resume}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />

    </div>
  );
}
