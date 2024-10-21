import { registerBlockType } from '@wordpress/blocks';
import './lib/editor.css';
import edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit,
	save: () => null,
});