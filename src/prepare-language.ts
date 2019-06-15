/**
 * Load grammars and scopeMappings from atom language packages
 */
import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import * as cson from 'season';

const exists = promisify(fs.exists);
const readdir = promisify(fs.readdir);
const loadCson = promisify(cson.readFile);

type ScopeMappings = {[selector: string]: string};

const TREE_SITTER_SPEC_FILENAME = /^tree-sitter-(.*)\.cson$/;

export interface PreparedLanguage {
  /**
   * The tree-sitter grammar
   */
  grammar: any;
  /**
   * Mapping from css selectors to classes,
   * describing which classes should be applied to which syntax nodes.
   *
   * e.g: {"class > identifier": "entity.name.type.class"}
   *
   * @see https://flight-manual.atom.io/hacking-atom/sections/creating-a-grammar/#syntax-highlighting
   */
  scopeMappings?: ScopeMappings;
}

export type PreparedLanguages = Map<string, PreparedLanguage>;

interface TreeSitterAtomSpec {
  parser: string;
  scopes: any;
}

function isTreeSitterAtomSpec(value: unknown): value is TreeSitterAtomSpec {
  return (
    typeof (value as TreeSitterAtomSpec).parser === 'string' &&
    !!(value as TreeSitterAtomSpec).scopes
  );
}

/**
 * Load the grammar and scope mappings from an APM (atom) package like "language-javascript"
 * @param packageName
 */
export async function loadLanguagesFromPackage(packageName: string): Promise<PreparedLanguages> {
  const langs = new Map<string, PreparedLanguage>();

  // Determine the location of the language package
  const lookup_paths = require.resolve.paths(`${packageName}/grammars/`);
  if (!lookup_paths) throw new Error('error resolving paths');
  // Add the lookup paths of the main module too
  // Required for when package symlinks are used
  // (add these to the start though so they are used first)
  if (require.main) {
    for (let i = require.main.paths.length - 1; i > 0; i--) {
      const path = require.main.paths[i];
      if (lookup_paths.indexOf(path) === -1)
        lookup_paths.unshift(path);
    }
  }
  let packageDir: string | null = null;
  for (const lookup of lookup_paths) {
    const p = path.join(lookup, packageName);
    if (await exists(p)) {
      packageDir = p;
      break;
    }
  }
  if (!packageDir) throw new Error(`could not find package: ${packageName}`);

  // Get list of grammars
  const grammarsDir = path.join(packageDir, 'grammars');
  const files = await readdir(grammarsDir).catch(() =>
    Promise.reject(new Error(`Package ${packageName} is not a valid atom language package`)));
  for (const filename of files) {
    const match = TREE_SITTER_SPEC_FILENAME.exec(filename);
    if (match) {
      const lang = match[1];
      const spec = await loadCson(path.join(grammarsDir, filename));
      if (isTreeSitterAtomSpec(spec)) {
        const grammarPath = require.resolve(spec.parser, {paths: lookup_paths});
        const grammar = require(grammarPath);
        langs.set(lang, {
          grammar, scopeMappings: spec.scopes
        });
      } else {
        throw new Error(`Invalid language specification for ${lang} in ${packageName}`);
      }
    }
  }

  return langs;
}
