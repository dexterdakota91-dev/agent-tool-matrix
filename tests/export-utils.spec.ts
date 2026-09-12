import { test, expect } from '@playwright/test';
import { exportToJson, exportToYaml, exportToMarkdown, WorkflowData } from '../src/lib/export-utils';

test.describe('Export Utilities', () => {
  test.describe('exportToJson', () => {
    test('should serialize a valid object with proper formatting and indentation', () => {
      const data = {
        name: 'Test Workflow',
        steps: [
          { name: 'Step 1', tool: 'Tool 1' },
          { name: 'Step 2', tool: 'Tool 2' }
        ]
      };
      const result = exportToJson(data);
      expect(result).toBe(JSON.stringify(data, null, 2));
      expect(result).toContain('  "name": "Test Workflow"');
    });

    test('should correctly serialize empty arrays and objects', () => {
      expect(exportToJson({})).toBe('{}');
      expect(exportToJson([])).toBe('[]');
    });

    test('should correctly serialize objects with special characters and missing optional fields', () => {
      const data = {
        'special chars: # " \n': 'value \n # :',
        missingField: null,
      };
      const result = exportToJson(data);
      expect(result).toContain('"special chars: # \\" \\n"');
      expect(result).toContain('"value \\n # :"');
      expect(result).toContain('"missingField": null');
    });

    test('should throw an error for undefined data', () => {
      expect(() => exportToJson(undefined)).toThrow('Cannot serialize undefined data to JSON.');
    });

    test('should throw an error for data with circular references', () => {
      const obj: any = {};
      obj.circular = obj;
      expect(() => exportToJson(obj)).toThrow('Failed to serialize data to JSON:');
    });
  });

  test.describe('exportToYaml', () => {
    test('should correctly serialize a valid object', () => {
      const data = {
        name: 'Test',
        active: true,
        count: 10,
        tags: ['a', 'b'],
        nested: { key: 'value' }
      };
      const result = exportToYaml(data);
      const expected = [
        'name: Test',
        'active: true',
        'count: 10',
        'tags:',
        '  - a',
        '  - b',
        'nested:',
        '  key: value'
      ].join('\n');
      expect(result).toBe(expected);
    });

    test('should handle string formatting edge cases (newlines, colons, hashes, start with "- ", empty strings)', () => {
      const data = {
        newline: 'line1\nline2',
        colon: 'key:value',
        hash: 'comment #',
        dash: '- item',
        empty: ''
      };
      const result = exportToYaml(data);
      expect(result).toContain('newline: "line1\\nline2"');
      expect(result).toContain('colon: "key:value"');
      expect(result).toContain('hash: "comment #"');
      expect(result).toContain('dash: "- item"');
      expect(result).toContain('empty: ""');
    });

    test('should handle object keys with special characters', () => {
      const data = {
        'key:with:colon': 'val1',
        'key with space': 'val2',
        'key#hash': 'val3',
        '': 'val4'
      };
      const result = exportToYaml(data);
      expect(result).toContain('"key:with:colon": val1');
      expect(result).toContain('"key with space": val2');
      expect(result).toContain('"key#hash": val3');
      expect(result).toContain('"": val4');
    });

    test('should serialize numbers and booleans correctly', () => {
      expect(exportToYaml(42)).toBe('42');
      expect(exportToYaml(false)).toBe('false');
    });

    test('should serialize empty arrays and objects correctly', () => {
      expect(exportToYaml([])).toBe('[]');
      expect(exportToYaml({})).toBe('{}');
    });

    test('should throw an error for undefined data', () => {
      expect(() => exportToYaml(undefined)).toThrow('Cannot serialize undefined data to YAML.');
    });

    test('should throw an error for unsupported data types', () => {
      expect(() => exportToYaml(() => {})).toThrow('Failed to serialize data to YAML: Unsupported data type: function');
    });
  });

  test.describe('exportToMarkdown', () => {
    test('should format a valid workflow with summary tables and headings', () => {
      const workflow: WorkflowData = {
        name: 'My Workflow',
        steps: [
          { name: 'Fetch Data', tool: 'fetch_tool' },
          { name: 'Process Data', tool: 'process_tool' }
        ]
      };
      const result = exportToMarkdown(workflow);
      const expected = [
        '# Workflow: My Workflow',
        '',
        '## Steps',
        '',
        '1. **Fetch Data**',
        '   - Tool: `fetch_tool`',
        '2. **Process Data**',
        '   - Tool: `process_tool`',
        ''
      ].join('\n');
      expect(result).toBe(expected);
    });

    test('should handle a workflow with an empty steps list', () => {
      const workflow: WorkflowData = {
        name: 'Empty Workflow',
        steps: []
      };
      const result = exportToMarkdown(workflow);
      const expected = [
        '# Workflow: Empty Workflow',
        '',
        '_No steps defined._',
        ''
      ].join('\n');
      expect(result).toBe(expected);
    });

    test('should handle special characters in workflow name and steps', () => {
      const workflow: WorkflowData = {
        name: 'Special # " \n Workflow',
        steps: [
          { name: 'Step 1 # \n', tool: 'tool 1 ` ' }
        ]
      };
      const result = exportToMarkdown(workflow);
      expect(result).toContain('# Workflow: Special # " \n Workflow');
      expect(result).toContain('1. **Step 1 # \n**');
      expect(result).toContain('   - Tool: `tool 1 ` `'); // markdown ticks inside tick, just checking if it stringifies it
    });

    test('should throw an error for invalid workflow data', () => {
      expect(() => exportToMarkdown(undefined as any)).toThrow('Invalid workflow data: must be an object.');
      expect(() => exportToMarkdown(null as any)).toThrow('Invalid workflow data: must be an object.');
      expect(() => exportToMarkdown('string' as any)).toThrow('Invalid workflow data: must be an object.');
    });

    test('should throw an error for missing or invalid name', () => {
      expect(() => exportToMarkdown({ steps: [] } as any)).toThrow("Invalid workflow data: 'name' must be a non-empty string.");
      expect(() => exportToMarkdown({ name: '', steps: [] } as any)).toThrow("Invalid workflow data: 'name' must be a non-empty string.");
      expect(() => exportToMarkdown({ name: '   ', steps: [] } as any)).toThrow("Invalid workflow data: 'name' must be a non-empty string.");
      expect(() => exportToMarkdown({ name: 123, steps: [] } as any)).toThrow("Invalid workflow data: 'name' must be a non-empty string.");
    });

    test('should throw an error for missing or invalid steps', () => {
      expect(() => exportToMarkdown({ name: 'Valid Name' } as any)).toThrow("Invalid workflow data: 'steps' must be an array.");
      expect(() => exportToMarkdown({ name: 'Valid Name', steps: 'not_an_array' } as any)).toThrow("Invalid workflow data: 'steps' must be an array.");
    });

    test('should throw an error for invalid step objects', () => {
      expect(() => exportToMarkdown({ name: 'Valid Name', steps: [null] } as any)).toThrow('Invalid workflow step at index 0: must be an object.');
      expect(() => exportToMarkdown({ name: 'Valid Name', steps: [{ tool: 'valid_tool' }] } as any)).toThrow("Invalid workflow step at index 0: 'name' must be a string.");
      expect(() => exportToMarkdown({ name: 'Valid Name', steps: [{ name: 'valid_name' }] } as any)).toThrow("Invalid workflow step at index 0: 'tool' must be a string.");
    });
  });
});
