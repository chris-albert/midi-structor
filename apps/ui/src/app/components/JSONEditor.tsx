import React from 'react'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import {Box} from "@mui/material";

export type JSONEditorProps = {
  value: string
  onChange?: (s: string) => void
  height?: string
  width?: string
  readonly?: boolean
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value, onChange = () => {},
  height = '100px',
  width = '500px',
  readonly = true
}) => {

  return (
    <Box>
        <AceEditor
          readOnly={readonly}
          mode="json"
          height={height}
          width={width}
          theme="monokai"
          value={value}
          onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          setOptions={{
            useWorker: false
          }}
          editorProps={{
            $blockScrolling: true
        }}
        />
    </Box>
  )
}
