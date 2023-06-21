import type { Monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import type { V2_MetaFunction } from '@remix-run/cloudflare';
import type { editor } from 'monaco-editor';
import type { MutableRefObject } from 'react';
import { useRef, useState } from 'react';
import resumeSchema from 'resume-schema';
import resume from '../johndoe.json';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Dev Page' },
    { name: 'description', content: 'Remix Resume!' },
  ]
}

export default function Index() {
  const jsonResume = JSON.stringify(resume, undefined, 2)
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {

  }

  const editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null> = useRef(null)
  const monacoRef: MutableRefObject<Monaco | null> = useRef(null);

  const [ isValid, setIsValid ] = useState<boolean>(true)
  const [ nrOfErrors, setNrOfErrors ] = useState<number>(0)

  function handleEditorWillMount(monaco: Monaco) {
    console.info('editor will mount')

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'http://json-resume-schema',
          fileMatch: ['*'],
          schema: resumeSchema.schema,
        },
      ],
    })
  }

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    console.info('editor did mount')

    editorRef.current = editor
    monacoRef.current = monaco;
  }

  function handleEditorChange(value: string | undefined, evt: editor.IModelContentChangedEvent) {
    console.info('contents changed')
  }

  function handleEditorValidation(markers: editor.IMarker[]) {
    console.warn(`${markers.length} marker(s) for validation`)

    markers.forEach(marker =>
      console.error(marker.message)
    );

    setIsValid(markers.length === 0)
    setNrOfErrors(markers.length)
  }


  function showValue() {
    if ( editorRef.current === null ) return

    console.log( JSON.parse(editorRef.current.getValue()))
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Development</h1>

      <button disabled onClick={showValue}>Load localStorage</button>&nbsp;
      <button disabled onClick={showValue}>Save localStorage</button>&nbsp;

      <button disabled onClick={showValue}>Load API</button>&nbsp;
      <button disabled onClick={showValue}>Save API</button>&nbsp;

      <button disabled onClick={showValue}>Download Word</button>&nbsp;
      <button disabled onClick={showValue}>Download PDF</button>&nbsp;

      <button onClick={showValue}>Log value</button><br/>


      is valid: {isValid ? 'Yes' : 'No'} &nbsp;
      # of errors: {nrOfErrors}<br/>

      <Editor
        height="80vh"
        width="50vw"
        language="json"
        theme="vs-dark"
        options={editorOptions}
        value={jsonResume}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        onValidate={handleEditorValidation}
      />

    </div>
  )
}
