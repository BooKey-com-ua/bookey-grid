import { useBlockProps } from '@wordpress/block-editor';

const dictionary = {
	en: 'Hourly booking BooKey grid block',
	ru: 'Блок таблицы почасовой аренды BooKey',
	uk: 'Блок таблицi погодинноi аренди BooKey',
}

export default function Edit({attributes}) {
	const blockProps = useBlockProps({
		style: {
			'border' : '1px solid #ccc',
			'display' : 'flex',
			'justify-content' : 'center',
		}
	});

	return (
		<div id="bookey-root" {...blockProps}>
			{dictionary[attributes.language]}
		</div>
	);
}
