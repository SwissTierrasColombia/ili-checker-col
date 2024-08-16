import Editor, { OnChange, useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';

interface Props {
  defaultValue: string;
  value: string;
  onchange: OnChange;
  selectTheme?: 'light' | 'vs-dark';
}

const sqlKeywords = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'GROUP BY',
  'ORDER BY',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'ON',
  'AS',
  'DISTINCT',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'CREATE',
  'TABLE',
  'ALTER TABLE',
  'ADD COLUMN',
  'DROP COLUMN',
  'PRIMARY KEY',
  'FOREIGN KEY',
  'REFERENCES',
  'INDEX',
  'UNIQUE',
  'CASCADE',
  'DEFAULT',
];

const sqlFunctions = [
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'CONCAT',
  'SUBSTRING',
  'LENGTH',
  'UPPER',
  'LOWER',
  'TRIM',
  'ROUND',
];

// Combinar palabras clave y funciones
const sqlSuggestions = sqlKeywords.concat(sqlFunctions);

export default function EditorMonaco({
  defaultValue,
  value,
  onchange,
  selectTheme = 'light',
}: Props) {
  // const [isProviderRegistered, setIsProviderRegistered] = useState(false);
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    // Registrar el proveedor de autocompletado para SQL
    const register = monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: function (model, position) {
        const word = model.getWordUntilPosition(position);
        return {
          suggestions: sqlSuggestions.map(function (suggestion) {
            return {
              label: suggestion,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: suggestion,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
              },
            };
          }),
        };
      },
    });

    return () => {
      register.dispose(); // Elimina la instancia al desmontar el componente para no duplicar los registros de autocompletado.
    };
  }, [monaco]);

  return (
    <Editor
      options={{
        suggestOnTriggerCharacters: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        quickSuggestions: true,
      }}
      height="400px"
      defaultLanguage="sql"
      defaultValue={defaultValue}
      value={value}
      onChange={onchange}
      theme={selectTheme}
    />
  );
}
