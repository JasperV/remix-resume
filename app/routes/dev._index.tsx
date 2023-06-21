import type { Monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import type { V2_MetaFunction } from '@remix-run/cloudflare';
import type { editor } from 'monaco-editor';
import type { MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
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
    // TODO: ?
  }

  const editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null> = useRef(null)
  const monacoRef: MutableRefObject<Monaco | null> = useRef(null);

  const [ isValid, setIsValid ] = useState<boolean>(true)
  const [ isSaved, setIsSaved ] = useState<boolean>(false)
  const [ hasChanged, setHasChanged ] = useState<boolean>(false)
  const [ nrOfErrors, setNrOfErrors ] = useState<number>(0)
  const [ resumeData, setResumeData ] = useState<string | undefined>(jsonResume) // TODO: use typia for type validation and json functions

  // useEffect( () => {
  //   console.info( { isValid } )

  //   if ( isValid && resumeData ) {
  //     localStorage.setItem("resume", resumeData)

  //     setIsSaved(true)
  //   }

  // }, [ isValid, resumeData ])

  useEffect(() => {
    setHasChanged(false)
  }, [isSaved])

  useEffect(() => {
    if ( resumeData === jsonResume ) return setHasChanged(false)

    setHasChanged(true)
  }, [resumeData, jsonResume])

  useEffect(()=>{
    setIsValid(nrOfErrors === 0)
  },[nrOfErrors])

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
    monacoRef.current = monaco
  }

  function handleEditorChange(value: string | undefined, evt: editor.IModelContentChangedEvent) {
    console.info('contents changed')

    setResumeData( editorRef.current?.getValue())
  }

  function handleEditorValidation(markers: editor.IMarker[]) {
    console.info('handle validation')

    console.warn({
      isValid: markers?.length === 0,
      nrOfErrors: markers?.length
    })

    markers.forEach(marker =>
      console.error(marker.message)
    );

    setNrOfErrors(markers.length)
  }

  function showValue() {
    if ( resumeData ) console.log( JSON.parse(resumeData))
  }

  function validate() {
    const markers = monacoRef.current?.editor.getModelMarkers({owner:'json'})

    handleEditorValidation(markers || [])
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Development</h1>

      <button disabled onClick={showValue}>Load localStorage</button>&nbsp;
      <button disabled onClick={showValue}>Save localStorage</button>&nbsp;

      <button disabled onClick={showValue}>Load API</button>&nbsp;
      <button disabled onClick={showValue}>Save API</button><br/>

      <button disabled onClick={showValue}>Download Word</button>&nbsp;
      <button disabled onClick={showValue}>Download PDF</button><br/>

      <button onClick={validate}>Validate</button>&nbsp;
      <button onClick={showValue}>Log value</button><br/>

      # errors:     {nrOfErrors}<br/>
      is valid:     {isValid    === true ? '✅' : '❌'}&nbsp;
      has changed:  {hasChanged === true ? '✅' : '❌'}&nbsp;
      is saved:     {isSaved    === true ? '✅' : '❌'}

      <Editor
        height="70vh"
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
