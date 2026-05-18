import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import {
	useBlockProps,
	BlockControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	ToolbarButton,
	ToolbarGroup,
	TextControl,
	Button,
	Flex,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { memoize } from 'lodash';
import './editor.scss';
import { plus, trash } from '@wordpress/icons';
import generateId from '../../utils/generate-id';
import { useSelect, dispatch } from '@wordpress/data';

export default function Edit( props ) {
	const { attributes, setAttributes, isSelected, clientId } = props;
	const { tabs, activeTabId } = attributes;
	const [ tabsLength, setTabsLength ] = useState( tabs.length );
	const blockProps = useBlockProps();
	const inputRef = useRef( null );

	const getTabsTemplate = memoize( ( tabs ) => {
		return tabs.reduce( ( carry, current, index ) => {
			carry.push( [
				'udec-blocks/content-tab-item',
				{
					tabId: current.tabId,
					label: current.label,
					index,
				},
			] );
			return carry;
		}, [] );
	} );

	const currentBlock = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlocksByClientId( clientId ),
		[ clientId ]
	);

	/**
	 * Al duplicar el bloque, generar nuevos IDs para las pestañas.
	 * Esto evita que existan dos pestañas con el mismo ID.
	 */
	useEffect( () => {
		const shouldUpdate = currentBlock?.[ 0 ]?.innerBlocks?.reduce(
			( carry, item ) => {
				const selector =
					'div[data-tabid="' + item.attributes.tabId + '"]';
				const findEls = document.querySelectorAll( selector );
				const wasCloned = findEls.length > 1;
				if ( wasCloned ) {
					carry = true;
				}
				return carry;
			},
			false
		);
		if ( ! shouldUpdate ) {
			return;
		}
		const theNewTabs = tabs.map( ( tab ) => {
			const newTab = { ...tab };
			newTab.tabId = generateId();
			return newTab;
		} );
		currentBlock?.[ 0 ]?.innerBlocks?.forEach( ( block, index ) => {
			const newAtts = {
				tabId: theNewTabs[ index ].tabId,
			};
			dispatch( 'core/block-editor' ).updateBlockAttributes(
				block.clientId,
				newAtts
			);
		} );

		setAttributes( {
			tabs: theNewTabs,
			activeTabId: theNewTabs[ 0 ].tabId,
		} );
	}, [] );

	/**
	 * Al inicializar el bloque, crear una pestaña por defecto.
	 */
	useEffect( () => {
		if ( tabsLength === 0 ) {
			const newId = generateId();
			const newTab = {
				label: __( 'Nueva pestaña' ),
				tabId: newId,
			};
			setAttributes( {
				tabs: [ newTab ],
				activeTabId: newId,
			} );
		}
	}, [ setAttributes, tabsLength ] );

	/**
	 * Otorgar foco al input de la pestaña activa.
	 */
	useEffect( () => {
		inputRef?.current?.focus();
	}, [ activeTabId ] );

	useEffect( () => {
		if ( tabs.length !== tabsLength ) {
			// Al crear una nueva pestaña, pasar el foco a su input.
			if ( tabsLength + 1 === tabs.length ) {
				const newActiveTabId = tabs[ tabs.length - 1 ].id;
				setAttributes( { activeTabId: newActiveTabId } );
			}
			setTabsLength( tabs.length );
		}
	}, [ tabs, tabsLength, setAttributes ] );
	const createTab = () => {
		const newTabs = [ ...attributes.tabs ];
		const newTabId = generateId();
		newTabs.push( {
			label: __( 'Nueva pestaña' ),
			tabId: newTabId,
		} );
		const newActiveTabId = newTabId;
		setAttributes( { tabs: newTabs, activeTabId: newActiveTabId } );
	};
	const editTab = ( index, field, newVal ) => {
		const newTabs = [ ...attributes.tabs ];
		newTabs[ index ][ field ] = newVal;
		setAttributes( { tabs: newTabs } );
	};
	const removeTab = ( index ) => {
		const newTabs = attributes.tabs.reduce( ( carry, current, idx ) => {
			if ( index !== idx ) {
				carry.push( current );
			}
			return carry;
		}, [] );
		const block = wp.data
			.select( 'core/block-editor' )
			.getBlock( clientId );
		const activeTabId = block.attributes.activeTabId;
		const activeTabContentId = block.innerBlocks.reduce(
			( carry, current, idx ) => {
				if ( current.attributes.tabId === activeTabId ) {
					carry[ 0 ] = current.clientId;
					carry[ 1 ] = idx;
				}
				return carry;
			},
			[]
		);
		const newInnerBlocks = currentBlock?.[ 0 ]?.innerBlocks?.reduce(
			( carry, current ) => {
				if ( current.attributes.tabId !== activeTabId ) {
					carry.push( current );
				}
				return carry;
			},
			[]
		);
		const newAttributes = {
			tabs: newTabs,
			activeTabId:
				newTabs?.[ 0 ]?.tabId ||
				attributes.tabs?.[ activeTabContentId[ 1 ] - 1 ]?.tabId ||
				attributes.tabs?.[ activeTabContentId[ 1 ] + 1 ]?.tabId ||
				newTabs?.[ 0 ]?.tabId,
		};
		console.log(
			activeTabContentId,
			attributes.tabs,
			newAttributes,
			attributes.tabs?.[ activeTabContentId[ 1 ] - 1 ]?.tabId,
			attributes.tabs?.[ activeTabContentId[ 1 ] + 1 ]?.tabId,
			newTabs?.[ 0 ]?.tabId
		);
		wp.data
			.dispatch( 'core/block-editor' )
			.updateBlock( currentBlock?.[ 0 ]?.clientId, {
				attributes: newAttributes,
				innerBlocks: newInnerBlocks,
			} );
		wp.data
			.dispatch( 'core/block-editor' )
			.removeBlock( activeTabContentId[ 0 ] );
	};

	/**
	 * TODO:
	 * - onClick cambiar tab activa
	 * - onClick agregar tab
	 * - Pestañas como innerBlocks
	 */

	return (
		<>
			<div { ...blockProps }>
				<BlockControls group="block">
					<ToolbarGroup>
						<ToolbarButton
							text={ __( 'Agregar pestaña' ) }
							icon={ plus }
							onClick={ () => createTab() }
						/>
					</ToolbarGroup>
				</BlockControls>
				<div className="tabs">
					<ul className="tabs-nav">
						{ attributes.tabs.map( ( tab, index ) => {
							return (
								<li
									className={
										activeTabId === tab.tabId
											? 'tab-active'
											: 'tab'
									}
									key={ index }
								>
									{ isSelected &&
									activeTabId === tab.tabId ? (
										<Flex>
											<FlexBlock>
												<TextControl
													onChange={ ( newVal ) =>
														editTab(
															index,
															'label',
															newVal
														)
													}
													ref={ inputRef }
													value={ tab.label }
												/>
											</FlexBlock>
											<FlexItem>
												<Button
													type="link"
													onClick={ () => {
														removeTab( index );
													} }
													label={ __(
														'Eliminar esta pestaña'
													) }
													icon={ trash }
													size="compact"
													isDestructive={ true }
												/>
											</FlexItem>
										</Flex>
									) : (
										<button
											type="button"
											style={ {
												border: 'none',
												background: 'none',
											} }
											onClick={ () =>
												setAttributes( {
													activeTabId: tab.tabId,
												} )
											}
										>
											{ tab.label }
										</button>
									) }
								</li>
							);
						} ) }
						<li className="tab-add">
							<Button
								icon={ plus }
								type="button"
								onClick={ () => {
									createTab();
								} }
								variant="link"
								label={ __( 'Agregar pestaña' ) }
							></Button>
						</li>
					</ul>
				</div>
				<div className="tabs-content">
					{ tabsLength > 0 && (
						<InnerBlocks
							template={ getTabsTemplate( tabs ) }
							templateLock="all"
							allowedBlocks={ [
								'udec-blocks/content-tab-item',
							] }
						/>
					) }
				</div>
			</div>
		</>
	);
}
