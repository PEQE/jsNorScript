var ItemType = Object.freeze({
	"UNKNOW"	: 0x000000,

	"NEW"			: 0x000001,
	"OPEN"		: 0x000002,
	"UPLOAD"	: 0x000003,
	"SAVE"		: 0x000004,
	"DELETE"	: 0x000005,
	"ZOOMIN"	: 0x000006,
	"ZOOMOUT"	: 0x000007,

	"IMAGE"							: 0x000110 ,
	"GRID"							: 0x000111 ,
	"LISTVIEW"					: 0x000112 ,
	"ITEM"							: 0x000113 ,
	"LINE"							: 0x000114 ,
	"LABEL"							: 0x000115 ,

	"PANEL"							: 0x000117 ,
	"VIDEO"							: 0x000118 ,
	"AUDIO"							: 0x000119 ,
	"UPLOADFILE"				: 0x000120 ,
	"COMBOBOX"					: 0x000121 ,
	"TEXTBOX"						: 0x000122 ,
	"BUTTON"						: 0x000123 ,
	"CHECKBOX"					: 0x000124 ,
	"RADIOBUTTON"				: 0x000125 ,
	"FORM"							: 0x000126 ,
	"CALENDAR"					: 0x000127 ,
	"PROGRESS"					: 0x000128 ,
	"DATEPICKER"				: 0x000129 ,
	"SLIDER"						: 0x000130 ,
	"TABS"							: 0x000131 ,
	"TEMPLATE"					: 0x000132 ,
	"SUBMIT"						: 0x000133 ,

	"TABPAGECONTROLLER"	: 0x000134 ,
	"TABCONTROLLER"			: 0x000135 ,
	"TABPAGE"						: 0x000136 ,
	"TAB"								: 0x000137 ,

	"THEAD"							: 0x000138 ,
	"TBODY"							: 0x000139 ,
	"TFOOTER"						: 0x000140 ,
	"TABLEROW"					: 0x000141 ,
	"TABLECELL"					: 0x000142 ,

	"LISTITEM"					: 0x000147 ,

	"SLIDERCONTROLLER"	: 0x000150 ,
	"SLIDERCAPTION"			: 0x000151 ,

	"CODE"		: 0x100020 ,
	"VIEW"		: 0x100021 ,
	"EDITOR"  : 0x100022 ,
	"LANGUAGE": 0x100023
});

function hasChilds( elementDOM ){
	var counter = 0;
	for( var index = 0; index < elementDOM.childNodes.length ; index++ ){
		if( elementDOM.childNodes[index].nodeName == "#text"
				&& elementDOM.childNodes[index].nodeValue.trim().length == 0 ){
					continue;
		}
		if( elementDOM.childNodes[index].nodeName != "#text" ){
			counter++;
		}
	}
	return counter != 0;
}
function GetOneElement( elementDOM , _Etiqueta ){
	for( var index = 0; index < elementDOM.childNodes.length ; index++ ){
		if( elementDOM.childNodes[index].nodeName == "#text"
				&& elementDOM.childNodes[index].nodeValue.trim().length == 0 ){
					continue;
		}
		if( elementDOM.childNodes[index].tagName == _Etiqueta ){
			return elementDOM.childNodes[index];
		}
	}
	return null;
}
function hasElementOne( elementDOM , _Etiqueta ){
	var counter = 0;
	for( var index = 0; index < elementDOM.childNodes.length ; index++ ){
		if( elementDOM.childNodes[index].nodeName == "#text"
				&& elementDOM.childNodes[index].nodeValue.trim().length == 0 ){
					continue;
		}
		if( elementDOM.childNodes[index].tagName == _Etiqueta ){
			counter++;
		}
	}
	return counter == 1;
}

function UploadResources( pFilename , pFiletype , pFiledata , pCallBack){
	var Parametos = {};
	Parametos["CommandType"] = "CARGAR_RECURSO";
	Parametos["Filename"] = pFilename ;
	Parametos["Filetype"] = pFiletype ;
	Parametos["Filedata"] = pFiledata ;
	Ajax_ServerRequest( "../lib/php/editorPlantilla.php",  "POST" , Parametos , pCallBack );
}
//	=========================================================================
// 		Codigo de Control de Evento para los widgets de JQuery
//	=========================================================================

function configurationSortable( m_currentItem , m_classOwer , m_cursorAt ){
	return {
			appendTo	 	: document.body,
			cursor			: "move",
			cursorAt		: m_cursorAt,
			connectWith	:  "."+m_classOwer ,
			handle 			: ".editor-HandlerController",
			stop : function( event, ui ){
				//debugger;
			},
			update : function ( event, ui ){ eventsSortable_Update( event , ui , m_currentItem ); },
			beforeStop: function( event, ui ) {
				//debugger;
			},
			deactivate: function( event, ui ) {
				//debugger;
			},
			receive: function( event, ui ) { eventsSortable_Receive( event , ui , m_currentItem ); },
			remove: function( event , ui ) { eventsSortable_Remove( event , ui , m_currentItem ); }
	};
};
function eventsSortable_Update( event , ui , m_currentItem ){
	var SaveItemHTML = null;
	var Manager_items = m_currentItem.referenceDOM ? m_currentItem.referenceDOM : m_currentItem.ElementDOM ;
	for( var index = 0 ; index < Manager_items.childNodes.length ; index++){
		var id_childHTML = Manager_items.childNodes[ index ].id;
		if( id_childHTML == m_currentItem.Items[ index ].ID ){
			continue;
		}
		else if( SaveItemHTML == null ){
			SaveItemHTML = m_currentItem.Items[ index ];
			m_currentItem.Items[ index ] = m_currentItem.FindChild( id_childHTML );
		}
		else{
			m_currentItem.Items[ index ] = SaveItemHTML;
			SaveItemHTML= null;
		}
		for( var  i = 0; i < m_currentItem.OnReOrden.length ; i++){
			m_currentItem.OnReOrden[i]( entryItemHTML , this );
		}
	}
};
function eventsSortable_Remove( event , ui , m_currentItem ){
	var entryID = $(ui.item[0]).attr("id");
	var entryItemHTML = m_currentItem.FindChild( ui.item[0].id );
	if( entryItemHTML ){
		if( !m_currentItem.RemoveItem( entryItemHTML ) ){
			if( $(m_currentItem.ElementDOM).sortable("instance")){
				$( m_currentItem.ElementDOM ).sortable( "cancel" );
			}
			return false;
		}
	}
	else{
		if( $(m_currentItem.ElementDOM).sortable("instance")){
			$( m_currentItem.ElementDOM ).sortable( "cancel" );
		}
		return false;
	}
};
function eventsSortable_Receive( event , ui , m_currentItem ){
	var entryID = $(ui.item[0]).attr("id");
	if( !entryID ){
		entryID = $(ui.item[0]).find(".imageContainer").get(0).id;
	}
	var entryItemHTML = m_currentItem.FindEntry( entryID );
	if( entryItemHTML ){
		m_currentItem.AddItem( entryItemHTML );
		m_currentItem.Refresh();
	}
};

function configurationDroppable( m_currentItem , m_classOwer ){
	return {
		accept: "[data-role=toolBoxItem]" ,
		drop: function( event, ui ) { eventsDroppable_Drop( event , ui , m_currentItem ); }
	};
};
function eventsDroppable_Drop( event , ui , m_currentItem ){
	var entryItemHTML = ui.draggable[0];
	var pItemHTML = BuilderItemHTML( parseInt( $(entryItemHTML ).attr("data-itemType") ));
	if( !pItemHTML )
		return ;

	if( m_currentItem.Parent && m_currentItem.Parent.LastInsert ){
		m_currentItem.Parent.LastInsert.Dispose();
		m_currentItem.Parent.LastInsert = null;
	}
	else if( m_currentItem.GranParent && m_currentItem.GranParent.LastInsert ){
		m_currentItem.GranParent.LastInsert.Dispose();
		m_currentItem.GranParent.LastInsert = null;
	}
	pItemHTML.ClassOwer = $(entryItemHTML).attr("data-Ower");
	m_currentItem.LastInsert = pItemHTML;
	m_currentItem.AddItem( pItemHTML );
};

function BuilderNorItemHTMLByDom( pElementDOM_HTML , pParentHTML ){
	//Si el nodo es un comentario lo excuimos de la conversion
	if ( pElementDOM_HTML.nodeName == "#comment" ) {
		return null;
	}
	if ( pElementDOM_HTML.nodeName == "#text" ) {
		return null;
	}

	var ObjectItemHTML		= new Object();
	var ArgumentItemHTML 	= new Object();
	for( ItemType_Key in ItemType ){
	 if( ItemType_Key == $( pElementDOM_HTML ).attr("html-type") ){
		 ArgumentItemHTML.ConfigHTML = pElementDOM_HTML ;
		ObjectItemHTML = BuilderItemHTML( ItemType[ ItemType_Key ] ,  ArgumentItemHTML );
		return ObjectItemHTML;
	 }
	}
	return null;
};
function BuilderItemHTMLByDOM( elementDOM , parentHTML , justy ){
	//Si el nodo es un comentario lo excuimos de la conversion
	if ( elementDOM.nodeName == "#comment" ) {
		return null;
	}
	// Si el nodo es un Texto, lo regresamos como propiedad
	else if ( elementDOM.nodeName == "#text" ) {
		if( elementDOM.nodeValue.trim().length == 0)
			return null;

		var LabelArgumentItemHTML 		= new Object();
		LabelArgumentItemHTML.Text 		= elementDOM.nodeValue;
		LabelArgumentItemHTML.Size		= { Width : null , Height : null  };
		LabelArgumentItemHTML.Font 		= { Family : null, Size : null , Color : null};
		LabelArgumentItemHTML.Border	= { Style : null , Width : null  ,Color: null, Radius: null};
		LabelArgumentItemHTML.Label 	= "TEXTNODE";
		return BuilderItemHTML( ItemType.LABEL , LabelArgumentItemHTML );
	}
	var _Etiqueta = elementDOM.tagName.toUpperCase();
	var ArgumentItemHTML = new Object();
	var ObjectItemHTML= new Object();

	ArgumentItemHTML.Properties 	= elementDOM.attributes;
	ArgumentItemHTML.Size					= { Width 	: null , Height : null };
	ArgumentItemHTML.Font 				= { Family 	: null , Size 	: null , Color 	: null	};
	ArgumentItemHTML.Border				= { Style 	: null , Width 	: null , Color	: null	, Radius: null};
	ArgumentItemHTML.Link 		  	= $(elementDOM).attr("dataurl") 		|| $(elementDOM).attr("href") || null;
	ArgumentItemHTML.Font.Family	= $(elementDOM).css("font-family") 	|| $(elementDOM).attr("font")		? $(elementDOM).css("font-family") 	|| $(elementDOM).attr("font") : null;
	ArgumentItemHTML.Font.Size		= $(elementDOM).css("font-size")				? $(elementDOM).css("font-size")						: null;
	ArgumentItemHTML.Font.Color		= $(elementDOM).css("color") 				|| $(elementDOM).attr("color")	? $(elementDOM).css("color") 				|| $(elementDOM).attr("color"): null;
	ArgumentItemHTML.BackColor 		= $(elementDOM).css("background-color") ? $(elementDOM).css("background-color")   	: null;
	ArgumentItemHTML.Size.Width   = $(elementDOM).css("width") 						? $(elementDOM).css("width") 							  : null;
	ArgumentItemHTML.Size.Height	= $(elementDOM).css("height")						? $(elementDOM).css("height")	 							: null;
	ArgumentItemHTML.Float 				= $(elementDOM).css("float") 						? $(elementDOM).css("float")								: null;
	ArgumentItemHTML.Border.Style = $(elementDOM).css("border-style")   	? $(elementDOM).css("border-style")    			: null;
	ArgumentItemHTML.Border.Width = $(elementDOM).css("border-style")   	? $(elementDOM).css("border-width")    			: null;
	ArgumentItemHTML.Border.Color = $(elementDOM).css("border-color")   	? $(elementDOM).css("border-color")    			: null;
	ArgumentItemHTML.Border.Radius= $(elementDOM).css("border-radius")  	? $(elementDOM).css("border-radius")   			: null;
	ArgumentItemHTML.Image 			  = $(elementDOM).attr("src") 			    	? $(elementDOM).attr("src") 			     			: null;
	ArgumentItemHTML.ImageMode 	  = $(elementDOM).css("background-size")	? $(elementDOM).css("background-size") 			: null;
	ArgumentItemHTML.Decoration 	= $(elementDOM).css("text-decoration")	? $(elementDOM).css("text-decoration") 			: null;
	ArgumentItemHTML.Class				= $(elementDOM).attr("class") 			  	? $(elementDOM).attr("class").split(" ") 	: [];
	ArgumentItemHTML.Label 				= _Etiqueta;

	if (( _Etiqueta == "SPAN" || _Etiqueta =="P" ) && elementDOM.childNodes.length <= 1 ) {
		ObjectItemHTML = BuilderItemHTML( ItemType.LABEL , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="SELECT" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.SELECT , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="INPUT" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.INPUT , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="FORM" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.FORM , ArgumentItemHTML );
	}
	else if( _Etiqueta == "OPTION" ){
		parentHTML.AddOption( elementDOM );
		return null;
	}
	else if ( _Etiqueta=="IMG" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.IMAGE , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="UL" || _Etiqueta=="OL") {
		ObjectItemHTML = BuilderItemHTML( ItemType.LIST , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="HR" || _Etiqueta == "BR" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.LINE , ArgumentItemHTML );
	}
	else if (
		_Etiqueta=="H1" || _Etiqueta=="H2" || _Etiqueta=="H3" || _Etiqueta=="H4" ||
		_Etiqueta=="H5"	|| _Etiqueta=="H6" || _Etiqueta == "A"
	) {
		ObjectItemHTML = BuilderItemHTML( ItemType.HEADER , ArgumentItemHTML );
	}
	else if( _Etiqueta == "TBODY"){
		parentHTML.SetBody( elementDOM );
		return null;
	}
	else if ( _Etiqueta=="TABLE") {
		ObjectItemHTML = BuilderItemHTML( ItemType.TABLE , ArgumentItemHTML );
	}
	else if ( (_Etiqueta == "LI" || _Etiqueta == "I" ) && elementDOM.childNodes.length <= 1){
		ObjectItemHTML = BuilderItemHTML( ItemType.ITEM , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="DIV" || ( elementDOM.childNodes && elementDOM.childNodes.length > 0 )){
		ObjectItemHTML = BuilderItemHTML( ItemType.PANEL , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="AUDIO" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.SONIDO , ArgumentItemHTML );
	}
	else if ( _Etiqueta=="VIDEO" ){
		ObjectItemHTML = BuilderItemHTML( ItemType.VIDEO , ArgumentItemHTML );
	}
	else if ( _Etiqueta == "STRONG" || _Etiqueta == "B" ){
		var array_LabelChilds = elementDOM.childNodes;
		for( var i = 0; i < array_LabelChilds.length; i++){
			var LabelArgumentItemHTML = BuilderItemHTMLByDOM(  elementDOM.firstChild , parentHTML , justy+"-");
			LabelArgumentItemHTML.Font.Bold = 700;
			parentHTML.AddItem( LabelArgumentItemHTML );
		}
		return null;
	}
	else{
		return null;
	}
	ObjectItemHTML.Parent = parentHTML;
	var array_Childs = elementDOM.childNodes;
	for( var i = 0; i < array_Childs.length ; i++){
			var pItemHTML = BuilderItemHTMLByDOM( array_Childs[ i ] , ObjectItemHTML , justy+"-");
		if( !pItemHTML )
			continue;
			ObjectItemHTML.AddItem( pItemHTML );
	}
	return ObjectItemHTML;
}

function BuilderItemHTML( pItemType , configuration ) {
	configuration = configuration ? configuration : {};
	configuration.ItemType = pItemType ;
	switch (pItemType) {
		case ItemType.IMAGE:
			return new norImage( configuration );

		case ItemType.GRID:
			return new norGrid( configuration );
		case ItemType.TABLEROW:
			return new norTableRow( configuration );
		case ItemType.TABLECELL:
			return new norTableCell( configuration );

		case ItemType.LISTVIEW:
			return new norListView( configuration );
		case ItemType.LISTITEM:
			return new norListItem( configuration );

		case ItemType.LINE:
			return new norLine( configuration );
		case ItemType.LABEL:
			return new norLabel( configuration );
		case ItemType.PANEL:
			return new norPanel( configuration );
		case ItemType.VIDEO:
			return new norVideo( configuration );
		case ItemType.AUDIO:
			return new norAudio( configuration );
		case ItemType.UPLOADFILE:
			return new norUpload( configuration );
		case ItemType.COMBOBOX:
			return new norComboBox( configuration );
		case ItemType.TEXTBOX:
			return new norTextBox( configuration );
		case ItemType.BUTTON:
			return new norButton( configuration );
		case ItemType.CHECKBOX:
			return new norCheckBox( configuration );
		case ItemType.RADIOBUTTON:
			return new norRadioButton( configuration );
		case ItemType.FORM:
			return new norForm( configuration );
		case ItemType.CALENDAR:
			return new norCalendar( configuration );
		case ItemType.PROGRESS:
			return new norProgress( configuration );
		case ItemType.DATEPICKER:
			return new norDatePicker( configuration );

		case ItemType.SLIDER:
			return new norSlider( configuration );
		case ItemType.SLIDERCONTROLLER:
			return new norSliderController( configuration );
		case ItemType.SLIDERCAPTION:
			return new norSliderCaption( configuration );

		case ItemType.TABS:
			return new norTabs( configuration );
		case ItemType.TABCONTROLLER:
			return new norTabController( configuration );
		case ItemType.TABPAGECONTROLLER:
			return new norTabPageController( configuration );
		case ItemType.TAB:
			return new norTab( configuration );
		case ItemType.TABPAGE:
			return new norTabPage( configuration );

		case ItemType.TEMPLATE:
			return new norTemple( configuration );
		case ItemType.SUBMIT:
			return new norSubmit( configuration );
	}
	return null;
}

function BaseItemHTML(  ){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration 	= arguments[0] ? arguments[0] : {}, //Configuracion
		m_elementDOM 		= {}, // Elementos que relaciona la clase con la interfaz
		m_elementSyntax = {}, // Elemento que contiene el objeto
		m_id						= "", // ID del elemento y del objeto DOM
		m_accessName		= "", // Nombre con cual se identifica el elemento
		m_active				= false, // Define si el Articulo esta artivo o Seleccionado
		m_align					= "" , // Alinea el Contenido del Elemento
		m_autoWidth 		= false , //Define si los elementos tomaran la dimension asignada en ancho
		m_autoHeight		= true , //Define si los elementos tomaran la dimension asignada en alto
		m_backColor			= "" , // Color de fondo
		m_border				= {} , // Borde del elemento
		m_class					= [] , // Clase Css
		m_classOwer			= "" , // Clase de conexion con Panel
		m_color					= "" , // Color de fuente
		m_data 				= {} , //Propiedades de Template
		m_decoration 		= "" , // Decoracion del texto
		m_enabled				= true, // Habilitao o deshabilita al elemento
		m_enabledSortable= true , //Habilitao la conexion de contros elementos
		m_fillParent		= false, // Empleado para indicar si el elemento ocupa todo el contenedor
		m_float					= "" , // Propiedad que indica si es float
		m_font					= {} , // Caracteristica de tipo de fuente
		m_image 				= "" , // Imagen de fondo del elemento
		m_imagePosition = "" , // Indica la posicion de la imagen
		m_imageRepeat		= "" , // Indica la cantidad de veces que se repite la imagen
		m_imageSize			= "" , // Tamaño de la Imagen de fonto
		m_isSelected		= false, // Indica si el elemento esta seleccionado
		m_items				= [] , // Elementos que contiene el objeto actual
		m_itemType			= ItemType.UNKNOW, // Tipo de elemento del objeto
		m_label				= "" , //Etiqueta de la que fue tomado
		m_lastInsert		= null, // Ultimo elemento que se inserto a elemento
		m_link				= {} , // Link que lleva el objeto
		m_location			= {}	, // Posicion del elemento
		m_lock				= false, // Indica si el objecto esta bloquedo
		m_maxHeight			= null, // Altura maximo que puede tomar el elemento
		m_maxWidth			= null, // Ancho maximo que puede tomar el elemento
		m_margin			= {}	, //
		m_minHeight			= null, // Altura minima que puede tomar el elemento
		m_minWidth			= null, // Ancho minimo que puede tomar el elemento
		m_padding			= {}	, // Define el Borde interno que puede tener el componente
		m_parent			= {}	, // Elemento contenedor del objecto
		m_properties		= {}	, // Lista de Propiedades que contiene el elemento Inicial
		m_responsive		= {}	, // Ajuste de Responsivo en Dispositivos
		m_scroll			= {}	, // Muestra el Scroll en el Elemento
		m_size				= {}	, // Tamaño del elemento
		m_textAlign 		= ""	, // Alineamiento del texto
		m_visible 			= true, // Indica si el elemento es visible
		m_zIndex			= 0 ; // Indica la posicion de los elementos en capas

	var m_borderStyle 	, m_borderWidth , m_borderColor , m_borderRadius;
	var m_dataAttribute = [] , m_dataName 	= [] , m_dataType = [];
	var m_fontSize 		, m_fontFamily 	, m_fontBold;
	var m_linkText		, m_linkData ;
	var m_locationX 	, m_locationY ;
	var m_marginLEFT 	, m_marginRIGHT 	, m_marginTOP , m_marginBOTTOM ;
	var m_paddingLEFT , m_paddingRIGHT 	, m_paddingTOP , m_paddingBOTTOM ;
	var m_responsivePHONES = 0 , m_responsiveTABLES = 0, m_responsiveNOTEBOOK = 0,  m_responsiveDESKTOPS = 0;
	var m_scrollHorizontal = false , m_scrollVertical = false ;
	var m_sizeWidth 	, m_sizeHeight ;
	//	=========================================================================
	// 		Events
	//	=========================================================================
	var
	  e_OnBeforeAddItem 		= [] , // Evento que se ejecuta antes de agregar un articulo
		e_OnBeforeDispose 		= [] , // Evento que se ejecuta antes de eliminar el elemento
		e_OnBeforeRemoveItem	= [] , // Evento que se ejecuta antes de eliminar un item
		e_OnBeforeReSize		= [] , // Evento que se ejecuta antes de redimencionar el elemento

		e_OnAddItem 		  	= [] , // Evento que se ejecuta cuando se agrega un item
		e_OnClick 			  	= [] , // Evento que se ejecuta cuando hace click el elemento
		e_OnDispose			  	= [] , // Evento que se ejecuta cuando se elimina el elemnento
		e_OnInit				= [] , // Evento que se ejecuta antes de Renderizarce
		e_OnInstance			= [] , // Evento que se ejucuta una sola vez, cuando el objeto se crea
		e_OnMouseEnter	  		= [] , // Evento que se ejecuta cuando el mouse entra al objeto
		e_OnMouseOut		  	= [] , // Evento que se ejecuta cuando el mouse se retira del objeto
		e_OnMove 				= [] , // Evento que se ejecuta cuando el objeto se ha movido
		e_OnRemoveItem 	  		= [] , // Evento que se ejecuta cuando se elimina un item
		e_OnReOrden				= [] , // Evento que se ejecuta cuando reordean el elemento
		e_OnReSize			  	= [] ; // Evento que se ejecuta cuando cambia de tamaño

	Object.defineProperties( m_border , {
		'Style' : { get: function() { return m_borderStyle; 							},
								set : function( p_value ) {
									m_borderStyle = p_value ;
									$(m_elementDOM).css("border-style", m_borderStyle );
								}
							},
		'Width' : { get: function() { return m_borderWidth; 							},
								set : function( p_value ) {
									m_borderWidth = p_value ;
									$(m_elementDOM).css("border-width", m_borderWidth );
								}
							},
		'Color' : { get: function() { return m_borderColor; 							},
								set : function( p_value ) {
									m_borderColor = p_value ;
									$(m_elementDOM).css("border-color", m_borderColor );
								}
							},
		'Radius' : { get: function() { return m_borderRadius; 							},
								set : function( p_value ) {
									m_borderRadius = p_value ;
									$(m_elementDOM).css("border-radius", m_borderRadius );
								}
							}
	});
	Object.defineProperties( m_data , {
		'Attribute' : { get: function() { return m_dataAttribute; 							},
								set : function( pAttributeValue ) {
									for( i = 0; i < m_dataAttribute.length ; i++){
										if( m_dataAttribute[i] == pAttributeValue ){
											m_dataAttribute = m_dataAttribute.splice( i , -1);
											break;
										}
									}
									m_dataAttribute.push( pAttributeValue );
								}
							},
		'Name' : { get: function() { return m_dataName; 							},
								set : function( pAttributeValue ) {
									for( i = 0; i < m_dataName.length ; i++){
										if( m_dataName[i] == pAttributeValue ){
											m_dataName = m_dataName.splice( i , -1);
											break;
										}
									}
									m_dataName.push( pAttributeValue );
								}
							},
		'DataType' : { get: function() { return m_dataType; 							},
								set : function( pAttributeValue ) {
									for( i = 0; i < m_dataType.length ; i++){
										if( m_dataType[i] == pAttributeValue ){
											m_dataType = m_dataType.splice( i , -1);
											break;
										}
									}
									m_dataType.push( pAttributeValue );
								}
							}
	});
	Object.defineProperties( m_font , {
		'Size' : { get: function() { return m_fontSize; 							},
								set : function( p_value ) {
									m_fontSize = p_value ;
									$(m_elementDOM).css("font-size", m_fontSize );
								}
							},
		'Family' : { get: function() { return m_fontFamily; 							},
								set : function( p_value ) {
									m_fontFamily = p_value ;
									$(m_elementDOM).css("font-family", m_fontFamily );
								}
							},
		'Bold' : { get: function() { return m_fontBold; 							},
								set : function( p_value ) {
									m_fontBold = p_value ;
									$(m_currentItem.ElementDOM)
										.find("[data-role=textContainer]")
										.css("font-weight", m_fontBold );
								}
							}
	});
	Object.defineProperties( m_margin , {
		'TOP' : { get: function() { return m_marginTOP; 							},
						set : function( p_value ) {
							m_marginTOP = p_value ;
							$(m_elementDOM).css("margin-top", m_marginTOP );
						}
					},
		'BOTTOM' : { get: function() { return m_marginBOTTOM; 							},
						set : function( p_value ) {
							m_marginBOTTOM = p_value ;
							$(m_elementDOM).css("margin-bottom", m_marginBOTTOM );
						}
					},
		'LEFT' : { get: function() { return m_marginLEFT; 							},
						set : function( p_value ) {
							m_marginLEFT = p_value ;
							$(m_elementDOM).css("margin-left", m_marginLEFT );
						}
					},
		'RIGHT' : { get: function() { return m_locationY; 							},
						set : function( p_value ) {
							m_locationY = p_value ;
							$(m_elementDOM).css("margin-left", m_marginRIGHT );
						}
					}
	});
	Object.defineProperties( m_link , {
		'Data' : { get: function() { return m_linkData; 							},
						set : function( pAttributeValue ) {
							m_linkData = p_value ;
						}
					},
		'Text' : { get: function() { return m_linkText; 							},
						set : function( pAttributeValue ) {
							m_linkText = pAttributeValue ;
						}
					}
	});
	Object.defineProperties( m_location , {
		'X' : { get: function() { return m_locationX; 							},
						set : function( p_value ) {
							m_locationX = p_value ;
							$(m_elementDOM).css("left", m_locationX );
						}
					},
		'Y' : { get: function() { return m_locationY; 							},
						set : function( p_value ) {
							m_locationY = p_value ;
							$(m_elementDOM).css("top", m_locationY );
						}
					}
	});
	Object.defineProperties( m_padding , {
		'TOP' : { get: function() { return m_paddingTOP; 							},
						set : function( p_value ) {
							m_paddingTOP = p_value ;
							$(m_elementDOM).css("padding-top", m_paddingTOP );
						}
					},
		'BOTTOM' : { get: function() { return m_paddingBOTTOM; 							},
						set : function( p_value ) {
							m_paddingBOTTOM = p_value ;
							$(m_elementDOM).css("padding-bottom", m_paddingBOTTOM );
						}
					},
		'LEFT' : { get: function() { return m_paddingLEFT; 							},
						set : function( p_value ) {
							m_paddingLEFT = p_value ;
							$(m_elementDOM).css("padding-left", m_paddingLEFT );
						}
					},
		'RIGHT' : { get: function() { return m_paddingRIGHT; 							},
						set : function( p_value ) {
							m_paddingRIGHT = p_value ;
							$(m_elementDOM).css("padding-right", m_paddingRIGHT );
						}
					}
	});
	Object.defineProperties( m_responsive , {
		'PHONES' : {
				get: function() { return m_responsivePHONES; 							},
				set : function( pAttributeValue ) {
					$( m_elementDOM ).removeClass("col-xs-" + m_responsivePHONES );
					m_responsivePHONES = pAttributeValue ;
					$( m_elementDOM ).addClass( "col-xs-" + m_responsivePHONES  );
				}
			},
		'TABLES' : {
				get: function() { return m_responsiveTABLES; 							},
				set : function( pAttributeValue ) {
					$( m_elementDOM ).removeClass("col-sm-" + m_responsiveTABLES );
					m_responsiveTABLES = pAttributeValue ;
					$( m_elementDOM ).addClass( "col-sm-" + m_responsiveTABLES  );
				}
			},
		'NOTEBOOK' : {
				get: function() { return m_responsiveNOTEBOOK; 							},
				set : function( pAttributeValue ) {
					$( m_elementDOM ).removeClass("col-md-" + m_responsiveNOTEBOOK );
					m_responsiveNOTEBOOK = pAttributeValue ;
					$( m_elementDOM ).addClass( "col-md-" + m_responsiveNOTEBOOK  );
				}
			},
		'DESKTOPS' : {
				get: function() { return m_responsiveDESKTOPS; 							},
				set : function( pAttributeValue ) {
					$( m_elementDOM ).removeClass("col-lg-" + m_responsiveDESKTOPS );
					m_responsiveDESKTOPS = pAttributeValue ;
					$( m_elementDOM ).addClass( "col-lg-" + m_responsiveDESKTOPS  );
					if( m_parent.Size.Width.toString().indexOf("%") != -1 ){
						m_size.Width = $(m_parent.ElementDOM).width() * ( m_responsiveDESKTOPS / 12);
						$( m_elementSyntax ).css("width" , m_size.Width );
					}
					else {
						m_size.Width = m_parent.Size.Width * ( m_responsiveDESKTOPS / 12);
						$( m_elementSyntax ).css("width" , m_size.Width );
					}
				}
			}
	});
	Object.defineProperties( m_scroll , {
		'Horizontal' : { get: function() { return m_scrollHorizontal; 							},
						set : function( pAttributeValue ) {
							m_scrollHorizontal = pAttributeValue ;
							if( m_scrollHorizontal ){
								$(m_elementDOM).css("overflow-x", "auto" );
							}
							else{
								$(m_elementDOM).css("overflow-x", "visible" );
							}
						}
					},
		'Vertical' : { get: function() { return m_scrollVertical; 							},
						set : function( pAttributeValue ) {
							m_scrollVertical = pAttributeValue ;
							return;
							if( m_scrollVertical ){
								$(m_elementDOM).css("overflow-y", "auto" );
							}
							else{
								$(m_elementDOM).css("overflow-y", "visible" );
								var itemSize = 0;
								for( var i = 0 ; i < m_items.length ; i++){
									itemSize += $( m_items[i].ElementDOM ).height() + 20;
								}
								m_currentItem.Size.Height = itemSize;
							}
						}
					}
	});
	Object.defineProperties( m_size , {
		'Width' : { get: function() { return m_sizeWidth; 							},
								set : function( p_whidth ) {
									if( parseFloat( p_whidth) > 0 ){
										m_sizeWidth = p_whidth ;
										$(m_elementDOM).css("width"   , m_sizeWidth );
										$(m_elementSyntax).css("width"   , m_sizeWidth );
										for( var i = 0; i < e_OnReSize.length ; i++ ){
											e_OnReSize[i]( m_currentItem , this );
										}
									}
								}
						},
		'Height' : { get: function() { return m_sizeHeight; 							},
								 set : function( pAttributeValue ) {
									if( parseFloat( pAttributeValue) > 0 && ( parseFloat( pAttributeValue) < m_maxHeight || !m_maxHeight)){
										m_sizeHeight = pAttributeValue ;
										$(m_elementDOM).css("height", m_sizeHeight );
										$(m_elementSyntax).css("height"   , m_sizeHeight );
										if( m_sizeHeight == "100%" && parseInt( $(m_elementSyntax).css("padding-top") ) == 20 ){
											$(m_elementDOM).css("height"		, ( m_parent.Size.Height - 20)+"px" );
											$(m_elementSyntax).css("height" , ( m_parent.Size.Height - 20)+"px" );
										}
										for( var i = 0; i < e_OnReSize.length ; i++ ){
											e_OnReSize[i]( m_currentItem , this );
										}
 									}
								}
						}
	});

	Object.defineProperties( m_currentItem , {
		'referenceDOM' : { get: function() { return m_elementDOM; 						} },
		'ElementDOM' : { get: function() { return m_elementSyntax; 						} },
		'ID'				 : { get: function() { return m_id; 											} },
		'AccessName' : { get: function() { return m_accessName; 							}  ,
										set : function( p_value ) {
												m_accessName = p_value ;
												$(m_elementSyntax).find(".access-propertiesController[data-element="+m_id+"]").html(m_accessName);
											}
									},
		'Active' : { get: function() { return m_active; 										 	}  ,
										set : function( p_value ) {
												m_active = p_value ;
												if( m_active ){
													$(m_elementDOM).addClass("active");
												}
												else{
													$(m_elementDOM).removeClass("active");
												}
											}
									},
		'Align' : { get: function() { return m_align; 								}  ,
										set : function( pAttributeValue ) {
											m_align = pAttributeValue ;
											$(m_elementDOM).attr("align", m_align );
											for( var i = 0 ; i < m_items.length ; i++){
												if( m_align == "center"){
													m_items[i].Float = "none" ;
												}
												else if( m_align == "none" ){
													m_items[i].Float = null ;
												}
												else{
													m_items[i].Float = m_align ;
												}
											}
										}
									},
		'AutoWidth' : { get: function() { return m_autoWidth; 								}  ,
										set : function( p_value ) {
											m_autoWidth = p_value ;
										}
									},
		'AutoHeight' : { get: function() { return m_autoHeight; 								}  ,
										set : function( p_value ) {
											m_autoHeight = p_value ;
										}
									},
		'BackColor' : { get: function() { return m_backColor; 								}  ,
										set : function( p_value ) {
											m_backColor = p_value ;
											$(m_elementDOM).css("background-color", m_backColor );
										}
									},
		'BackgroundImage': { get: function() { return m_image; 										}  ,
										set : function( pAttributeValue ) {
											if( pAttributeValue ){
												if( m_image == "" ){
													m_image = "BG" + m_currentItem.ID +".png";
												}
												UploadResources( m_image , "IMAGE" , pAttributeValue  , function( data ){
													var jsonData = JSON.parse( data );
													setTimeout(function(){
														$( m_elementDOM ).css( "background-image", "url(" + jsonData.TOKEN +")" );
													},200);
												});
											}
											else{
												$( m_elementDOM ).css( "background-image", "");
												m_image = "";
											}
										}
									},
		'BackgroundPosition': { get: function() { return m_imagePosition; 										}  ,
										set : function( pAttributeValue ) {
											m_imagePosition = pAttributeValue;
											$( m_elementDOM ).css( "background-position", m_imagePosition );
										}
									},
		'BackgroundRepeat': { get: function() { return m_imageRepeat; 										}  ,
										set : function( pAttributeValue ) {
											m_imageRepeat = pAttributeValue;
											$( m_elementDOM ).css( "background-repeat", m_imageRepeat );
										}
									},
		'BackgroundSize': { get: function() { return m_imageSize; 										}  ,
										set : function( pAttributeValue ) {
											m_imageSize = pAttributeValue;
											$( m_elementDOM ).css( "background-size", m_imageSize );
										}
									},
		'Border' 		: { get: function() { return m_border; 										}  ,
										set : function( p_value ) {
											m_border.Width = p_value.Width ;
											m_border.Style = p_value.Style ;
											m_border.Color = p_value.Color ;
											m_border.Radius= p_value.Radius;
										}
									},
		'Class' 		: { get: function() { return m_class; 										}  ,
										set : function( p_Class ) {
											//m_class = $(m_elementDOM).attr("class") ? $(m_elementDOM).attr("class").split(/\s+/) : [];
											if( Object.prototype.toString.call( p_Class ) === '[object Array]' ) {
											    m_class = m_class.concat(p_Class).unique();
											}
											else{
												m_class.push( p_value );
											}
											//$(m_elementDOM).attr("class","").addClass( m_class.join(" ") );
										}
									},
		'ClassOwer': { get: function() { return m_classOwer; 								}  ,
										set : function( p_value ) {
											if( m_classOwer != null ){
												var last_Ower = $(m_elementDOM).attr("data-Ower");
												m_classOwer = p_value ;
												$(m_elementDOM)
													.removeClass(last_Ower )
													.addClass( m_classOwer )
													.attr("data-Ower" , m_classOwer );
												m_currentItem.Refresh();
											}
										}
									},
		'Color' 		: { get: function() { return m_color; 										}  ,
										set : function( p_value ) {
											m_color = p_value ;
											$(m_elementDOM).css("color", m_color );
										}
									},
		'DataTemple'		: { get: function() { return m_data; 									}  ,
										set : function( pAttributeValue ) {	m_data = pAttributeValue ; 		}
									},
		'DecorationText': { get: function() { return m_decoration; 								}  ,
										set : function( p_value ) {
											m_decoration = p_value ;
											$(m_elementDOM).css("text-decoration",m_decoration);
										}
									},
		'Enabled'		: { get: function() { return m_enabled; 									}  ,
										set : function( p_value ) {	m_enabled = p_value ; 		}
									},
		'EnabledSortable': { get: function() { return m_enabledSortable; 									}  ,
										set : function( pAttributeValue ) {	m_enabledSortable = pAttributeValue ; 		}
									},
		'FillParent': { get: function() { return m_fillParent; 								}  ,
										set : function( p_value ) {	m_fillParent = p_value ;	}
									},
		'Float'			: { get: function() { return m_float; 										}  ,
										set : function( pAttributeValue ) {
											m_float = pAttributeValue ;
											if( pAttributeValue == null){
												m_elementDOM.style.float = null;
												m_elementSyntax.style.float = null;
											}
											else{
												$(m_elementDOM).css("float", m_float );
												$(m_elementSyntax).css("float", m_float );
											}
										}
									},
		'Font'			: { get: function() { return m_font; 											}  ,
										set : function( p_value ) {
											m_font.Family = p_value.Family ;
											m_font.Size   = p_value.Size ;
											m_font.Bold   = p_value.Bold ;
										}
									},
		'GranParent': { get: function() {
											var _Parent = m_parent;
											while( _Parent && !_Parent.Entrys ){
												_Parent = _Parent.Parent;
											}
											return _Parent;
										}
									},
		'IsSelected': { get: function() { return m_isSelected; 								} ,
										set : function( p_value ) {	m_isSelected = p_value ;	}
									},
		'Items'			: { get: function() { return m_items; 										}  ,
										set : function( p_value ) {	m_items = p_value ;				}
									},
		'ItemType'	: { get: function() { return m_itemType; 									}  ,
									},
		'Label'			: { get: function() { return m_label; 											}  ,
										set : function( p_value ) {	m_label = p_value ;				}
									},
		'LastInsert': { get: function() { return m_lastInsert; 											}  ,
										set : function( p_value ) {	m_lastInsert = p_value ;				}
									},
		'Link'			: { get: function() { return m_link; 											}  ,
										set : function( pAttributeValue ) {
											m_link = pAttributeValue ;
										}
									},
		'Location'	: { get: function() { return m_location; 									}  ,
										set : function( p_value ) {
											m_location.X = p_value.X ;
											m_location.Y = p_value.Y ;
										}
									},
		'Lock'				: { get: function() { return m_lock; 											}  ,
										set : function( p_value ) {	m_lock = p_value ;				}
									},
		'Marggin'			: { get: function() { return m_margin; 											}  ,
										set : function( p_value ) {	m_margin = p_value ;				}
									},
		'MaxHeight'		: { get: function() { return m_maxHeight; 											}  ,
										set : function( p_value ) {
												m_maxHeight = p_value ;
												$(m_elementDOM).css("max-height", m_maxHeight );
												$(m_elementSyntax).css("max-height", m_maxHeight );
												if( $( m_elementSyntax ).resizable( "instance" ) ){
													$( m_elementSyntax ).resizable( "option", "maxHeight",  m_maxHeight  );
												}
											}
									},
		'MaxWidth'		: { get: function() { return m_maxWidth; 											}  ,
										set : function( p_value ) {
												m_maxWidth = p_value ;
												$(m_elementDOM).css("max-width", m_maxWidth );
												$(m_elementSyntax).css("max-width", m_maxWidth );
												if( $( m_elementSyntax ).resizable( "instance" ) ){
													$( m_elementSyntax ).resizable( "option", "maxWidth",  m_maxWidth  );
												}
											}
									},
		'MinHeight'		: { get: function() { return m_minHeight; 											}  ,
										set : function( p_value ) {
												m_minHeight = p_value ;
												$(m_elementDOM).css("min-height", m_minHeight );
												$(m_elementSyntax).css("min-height", m_minHeight );
												if( $( m_elementSyntax ).resizable( "instance" ) ){
													$( m_elementSyntax ).resizable( "option", "minHeight",  m_minHeight  );
												}
											}
									},
		'MinWidth'		: { get: function() { return m_minWidth; 											}  ,
										set : function( p_value ) {
												m_minWidth = p_value ;
												$(m_elementDOM).css("min-width", m_minWidth );
												$(m_elementSyntax).css("min-width", m_minWidth );
												if( $( m_elementSyntax ).resizable( "instance" ) ){
													$( m_elementSyntax ).resizable( "option", "minWidth",  m_minWidth  );
												}
											}
									},
		'Padding'			: { get: function() { return m_padding; 											}  ,
										set : function( p_value ) {	m_padding = p_value ;				}
									},
		'Parent'		: { get: function() { return m_parent; 										}  ,
										set : function( p_value ) {
											var flag = ( m_parent.ID == null );
											m_parent = p_value ;
											m_parent.OnReSize = _ResponsiveLoad;
											if( p_value.referenceDOM ){
												$( p_value.referenceDOM ).append( m_elementSyntax );
											}
											else{
												$( p_value.ElementDOM ).append( m_elementSyntax );
											}
											if( flag ){
												for( var i = 0 ; i < e_OnInstance.length ; i++){
													e_OnInstance[ i ]( m_currentItem , this );
												}
											}
										}
									},
		'Properties': { get: function() { return m_properties; 											}  ,
										set : function( p_value ) {
												m_properties = p_value ;
									}
								},
		'Responsive' : { get: function() { return m_responsive; 							},
									set : function( pAttributeValue ) {
										m_responsive = pAttributeValue ;
									}
								},
		'Scroll'			: { get: function() { return m_scroll; 											}  ,
										set : function( pAttributeValue ) {
											m_scroll = pAttributeValue ;
										}
									},
		'Size'			: { get: function() { return m_size; 											}  ,
										set : function( p_value ) {
											m_size.Width = p_value.Width ;
											m_size.Height = p_value.Height ;
										}
									},
		'TextAlign'	: { get: function() { return m_textAlign; 								}  ,
										set : function( p_value ) {
											m_textAlign = p_value ;
											$(m_elementDOM).css("text-align",m_textAlign);
										}
									},
		'Visible'		: { get: function() { return m_visible; 									}  ,
										set : function( p_value ) {
												m_visible = p_value ;
												if( m_visible ){
													$(m_currentItem.ElementDOM).css("display","block");
												}
												else{
													$(m_currentItem.ElementDOM).css("display","none");
												}
										}
									},
		'zIndex'		: { get: function() { return m_zIndex; 										}  ,
										set : function( p_value ) {	m_zIndex = p_value ;			}
									}
		});
	//	=========================================================================
	// 		Asignacion de los eventos
	//	=========================================================================
	Object.defineProperties( m_currentItem , {
		'OnAddItem': {
			get: function() { return e_OnAddItem; 					},
			set: function( eValue ) { e_OnAddItem.push( eValue ) ; }
		},
		'OnClick' : {
			get: function() { return e_OnClick; 					},
			set: function( eValue ) { e_OnClick.push( eValue ) ;}
		},
		'OnDispose' : {
			get: function() { return e_OnDispose; 					},
			set: function( eValue ) { e_OnDispose.push(eValue) ;}
		},
		'OnInit' : {
			get: function() { return e_OnInit; 					},
			set: function( eValue ) { e_OnInit.push(eValue) ;}
		},
		'OnInstance' : {
			get: function() { return e_OnInstance; 					},
			set: function( eValue ) { e_OnInstance.push(eValue) ;}
		},
		'OnMouseEnter': {
			get: function() { return e_OnMouseEnter; 					},
			set: function( eValue ) { e_OnMouseEnter.push( eValue ) ; }
		},
		'OnMouseOut': {
			get: function() { return e_OnMouseOut; 					},
			set: function( eValue ) { e_OnMouseOut.push( eValue ) ; }
		},
		'OnMove': {
			get: function() { return e_OnMove; 					},
			set: function( eValue ) { e_OnMove.push( eValue ) ; }
		},
		'OnRemoveItem': {
			get: function() { return e_OnRemoveItem; 					},
			set: function( eValue ) { e_OnRemoveItem.push( eValue ) ; }
		},
		'OnReOrden': {
			get: function() { return e_OnReOrden; 					},
			set: function( eValue ) { e_OnReOrden.push( eValue ) ; }
		},
		'OnReSize': {
			get: function() { return e_OnReSize; 					},
			set: function( eValue ) { e_OnReSize.push( eValue ) ; }
		}
	});
	var _EventKeyPress = function( args ){
			switch( args.keyCode){
				case 46:{
					if ( m_currentItem.IsSelected ) {
						m_currentItem.Dispose();
					}
				}break;
				case 27:{
					m_currentItem.IsSelected = false;
				}break;
			}
	};
	var _ResponsiveLoad = function(){
		if( m_responsiveDESKTOPS > 0 ){
			m_size.Width = m_parent.Size.Width * ( m_responsiveDESKTOPS / 12);
			$( m_elementSyntax ).css("width" , m_size.Width );
		}
	};
	var __Refresh = function(){
		// Elemento Base
		if( $( m_elementDOM ).sortable( "instance" ) ){
			$( m_elementDOM ).sortable( "destroy" );
		}
		if( m_enabledSortable ){
			$(m_elementDOM).sortable( configurationSortable( m_currentItem , m_classOwer , { left : 0 ,  top: 0 }) );
		}
	};
	this.ClearDataSource = function(){
		for( i = 0; i < m_items.length ; i++ ){
			m_items[i].ClearDataSource();
		}
		m_dataName 		= [];
		m_dataType 		= [];
		m_dataAttribute = [];
	}
	var __Init = function(){
		m_elementSyntax 		= document.createElement("div");
		Configuration = Configuration ? Configuration : {};
		m_classOwer = "TEMP";
		m_elementDOM = Configuration.Container ? $(Configuration.Container).get(0) : document.createElement("div");
		m_itemType = Configuration.ItemType ? Configuration.ItemType : ItemType.UNKNOW ;
		m_label = Configuration.Label ? Configuration.Label : "" ;
		m_id = __GetKey( 5 , "itemGenericHTML");
		m_image = "BG" + m_currentItem.ID +".png";
		for( keyType in ItemType ){
			if( ItemType[ keyType] == m_itemType){
				m_id = __GetKey( 5 , keyType.toLowerCase()+"HTML");
			}
		}
		for( propertyKey in Configuration ){
			if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
				m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
			}
		}
		$(m_elementDOM)
			.addClass( m_classOwer )
			.attr("data-reference", m_id)
			.attr("data-Ower", m_classOwer );
		$(m_elementSyntax)
			.append(function(){
				var elementDIV_Commands = document.createElement("div");
				$(elementDIV_Commands)
					.attr("role","group")
					.attr("command-group" , m_id )
					.addClass("btn-group")
					.css({ "position":"absolute" , "top":"0px" , "z-index":"5"})
					.append("<div data-element='"+m_id+"' class='btn btn-default btn-xs editor-Controller editor-HandlerController' 	 style='padding: 4px 5px;' ><span class='glyphicon glyphicon-move '	 /></span></div>")
					.append("<div data-element='"+m_id+"' class='btn btn-default btn-xs editor-Controller editor-removeController'		 style='padding: 4px 5px;' ><span class='glyphicon glyphicon-remove' /></span></div>")
					.append("<div data-element='"+m_id+"' class='btn btn-default btn-xs editor-Controller editor-propertiesController' style='padding: 4px 5px;' ><span class='glyphicon glyphicon-cog' 	 /></span></div>")
					.append("<div data-element='"+m_id+"' class='btn btn-default btn-xs editor-Controller access-propertiesController '>"+m_accessName+"</div>");
				return elementDIV_Commands;
			})
			.append(m_elementDOM)
			.addClass("imageContainer")
			.attr("id", m_id )
			.resizable({
				autoHide: true ,
				handles  : "se , s, e",
				containment : "parent",
				resize: function( event , ui){
					m_currentItem.Size.Width = ui.size.width;
					m_currentItem.Size.Height = ui.size.height ;
				}
			})
			.droppable( configurationDroppable( m_currentItem , m_classOwer ) )
			.click( function( event ){
				if( event.toElement.id && event.toElement.id == m_currentItem.ID  ||
					( event.toElement.parentNode &&  event.toElement.parentNode.id == m_currentItem.ID)
				){
					m_currentItem.GranParent.Manager.PanelProperties.ReadProperties( m_currentItem );
					for( var  i = 0; i < m_currentItem.OnClick.length ; i++){
						m_currentItem.OnClick[i]( m_currentItem , event );
					}
				}
			})
			.mouseenter(function( args ) {
			  $( m_elementSyntax ).addClass("editor-activeController");
				for( var  i = 0; i < m_currentItem.OnMouseEnter.length ; i++){
					m_currentItem.OnMouseEnter[i]( m_currentItem , args );
				}
			})
			.mouseleave(function( args ) {
			  $( m_elementSyntax ).removeClass("editor-activeController");
				for( var  i = 0; i < m_currentItem.OnMouseOut.length ; i++){
					m_currentItem.OnMouseOut[i]( m_currentItem , args );
				}
			});

		$(m_elementSyntax).find(".editor-removeController").click(function(){ m_currentItem.Dispose(); });
		$(m_elementSyntax).find(".editor-propertiesController").click(function(){
			m_currentItem.GranParent.Manager.PanelProperties.ReadProperties( m_currentItem );
			m_currentItem.GranParent.Manager.PanelProperties.Visible = true;
		});
		$("html").keyup( _EventKeyPress );
		m_currentItem.OnInstance = function(){
			if( Configuration.ConfigHTML ){
				m_currentItem.SetHTML( Configuration.ConfigHTML );
				if( Configuration.ConfigHTML.tagName == "A" || Configuration.ConfigHTML.tagName == "TBODY" ){
					Configuration.ConfigHTML = Configuration.ConfigHTML.firstChild;
				}
				for (var i = 0; i < Configuration.ConfigHTML.childNodes.length; i++ ) {
					var childNode = Configuration.ConfigHTML.childNodes[ i ];
					var pItemHTML = BuilderNorItemHTMLByDom( Configuration.ConfigHTML.childNodes[ i ] , m_currentItem );
					if( !pItemHTML ){
						if( childNode.tagName == "TBODY" || $(childNode).hasClass("carousel-inner") ){
							for( i_c = 0 ; i_c < childNode.childNodes.length ; i_c++){
								var pItemHTMLChildv2 = BuilderNorItemHTMLByDom( childNode.childNodes[ i ] , m_currentItem );
								if( !pItemHTMLChildv2 ){
									continue;
								}
								m_currentItem.AddItem( pItemHTMLChildv2 );
							}
						}
						continue;
					}
					m_currentItem.AddItem( pItemHTML );
				}
			}
		};
		__Refresh();
	}
	this.Refresh = function(){
		__Refresh();
	};
	this.RefreshLabel = function( ){
		var T_referenceDOM = m_currentItem.GetBaseHTML( document.createElement( m_label ) , true);
		$(m_elementDOM).remove();
		$(m_elementSyntax).append( T_referenceDOM );
		m_elementDOM = T_referenceDOM;
		m_size.Width = $(T_referenceDOM).attr("data-width");
	};
	this.GetBaseHTML = function( elementHTML , withOutLink ){
		var array_properties = m_currentItem.GetPropertyToHTML();
		var codeHTML = "";
		for( var index = 0; index < m_currentItem.Items.length ; index++){
			codeHTML+= m_currentItem.Items[ index ].ToHTML();
		}

		for(var i = 0 ; i < m_currentItem.Properties.length ; i++ ){
			var NodeAttribute = m_currentItem.Properties.item( i );
				$(elementHTML).attr( NodeAttribute.name , NodeAttribute.value ? NodeAttribute.value.encodeURI() :"" );
		}
		for(var i = 0 ; i < m_elementDOM.attributes.length ; i++ ){
			var NodeAttribute = m_elementDOM.attributes.item( i );
			$(elementHTML).attr( NodeAttribute.name , NodeAttribute.value );
		}

		for( key  in array_properties ){
			if( array_properties[ key ].PropertyType == "css"){
				$(elementHTML).css( array_properties[ key ].Property , array_properties[ key ].Value);
			}
			else if( array_properties[ key ].PropertyType == "attribute"){
				$(elementHTML).attr( array_properties[ key ].Property , array_properties[ key ].Value);
			}
		}

		if( m_responsivePHONES == 0){
			$(elementHTML).removeClass("col-xs-"+m_responsivePHONES );
		}
		if( m_responsiveTABLES == 0){
			$(elementHTML).removeClass("col-sm-"+m_responsiveTABLES );
		}
		if( m_responsiveNOTEBOOK == 0){
			$(elementHTML).removeClass("col-md-"+m_responsiveNOTEBOOK );
		}
		if( m_responsiveDESKTOPS == 0){
			$(elementHTML).removeClass("col-lg-"+m_responsiveDESKTOPS );
		}
		if( m_responsivePHONES + m_responsiveTABLES + m_responsiveNOTEBOOK + m_responsiveDESKTOPS > 0 || m_autoWidth){
			$(elementHTML).get(0).style.width = null;
		}
		if( m_autoHeight ){
				$(elementHTML).get(0).style.height = null;
		}
		$(elementHTML)
			.attr("data-width",  m_sizeWidth )
			.attr("data-height",  m_sizeHeight )
			.removeClass("ui-sortable")
			.removeAttr("data-Ower")
			.attr("content-html","html_" + m_id )
			.append( codeHTML );

		if( m_currentItem.Link && !withOutLink ){
			var elementLink = document.createElement("a");
			$(elementHTML).removeAttr("href");
			if( m_currentItem.Link.Data ){
				$(elementLink)
					.attr("page-name", m_currentItem.Link.Text )
					.attr("href", m_currentItem.Link.Data )
					.append( elementHTML );
				return elementLink ;
			}
			$(elementLink)
				.attr("page-name", m_currentItem.Link.Text )
				.attr("href", m_currentItem.Link.Text )
				.append( elementHTML );
			return elementLink;
		}
		return elementHTML;
	};
	this.GetPropertyToHTML = function(){
		var array_Properties = [];
		if( m_link != null && m_link != undefined && m_link.length > 0){
			if( m_link.Data ){
				array_Properties.push( { "PropertyType":"attribute" , "Property" :"page-name" , "Value" :  m_link.Text.encodeURI() 	} );
				array_Properties.push( { "PropertyType":"attribute" , "Property" :"href"	  , "Value" :  m_link.Data.encodeURI() } );
			}
			else{
				array_Properties.push( { "PropertyType":"attribute" , "Property" :"page-name" , "Value" :  m_link.Text.encodeURI() 	} );
				array_Properties.push( { "PropertyType":"attribute" , "Property" :"href"	  , "Value" :  m_link.Text.encodeURI() } );
			}
		}
		return array_Properties;
	};
	this.AddItem = function( pItemHTML ){
		pItemHTML.Parent = m_currentItem ;
		m_items.push( pItemHTML );
		m_currentItem.Refresh();
		m_currentItem.GranParent.Entrys = pItemHTML;
		m_currentItem.Align = m_currentItem.Align;
		m_currentItem.Scroll.Vertical = m_currentItem.Scroll.Vertical;
		for( var  i = 0; i < m_currentItem.OnAddItem.length ; i++){
			m_currentItem.OnAddItem[i]( pItemHTML , this );
		}
	};
	this.GetFiles = function(){
		var array_imagesFiles = [];
		if( m_image.length > 0){
		 array_imagesFiles.push( { ID : m_id , SOURCE : m_image });
	 }
		var array_soundFiles 	= [];
		var array_videoFiles 	= [];
		for (var i = 0; i < m_items.length; i++) {
			var array_files = m_items[ i ].GetFiles();
			if( array_files.Images ){
				array_imagesFiles = array_imagesFiles.concat( array_files.Images );
			}
			if( array_files.Sounds ){
				array_soundFiles = array_soundFiles.concat( array_files.Sounds );
			}
			if( array_files.Video ){
				array_videoFiles = array_videoFiles.concat( array_files.Video );
			}
		}
		return { Images: array_imagesFiles , Sounds : array_soundFiles , Video: array_videoFiles }
	};
	this.Dispose = function(){
		$("html").unbind("keyup", _EventKeyPress );
		while( m_items.length > 0){
			m_items[ 0 ].Dispose();
		}
		m_parent.RemoveItem( m_currentItem );
		m_parent.RemoveEntry( m_currentItem );
		$(m_elementSyntax).remove();
		for( var  i = 0; i < m_currentItem.OnDispose.length ; i++){
			m_currentItem.OnDispose[i]( m_currentItem , this );
		}
	};
	this.FindChild = function( pChildID ){
		if( m_id == pChildID || pChildID.ID == m_id ){
			return m_currentItem ;
		}
		for (var index = 0; index < m_items.length; index++) {
			if( m_items[ index ].FindChild( pChildID ) ){
				return m_items[ index ];
			}
		}
		return null;
	};
	this.FindEntry = function( pEntryID ){
		return m_currentItem.GranParent.FindEntry( pEntryID );
	}
	this.hasTemple = function( ){
		if( m_itemType == ItemType.TEMPLATE )
			return m_currentItem;
		if( m_currentItem.Parent.ItemType ){
			return m_currentItem.Parent.hasTemple();
		}
		return null;
	};
	this.RemoveEntry = function( pEntryHTML ){
		m_currentItem.GranParent.RemoveEntry( pEntryHTML );
	};
	this.Show = function(){
		m_currentItem.Visible = true;
	};
	this.Hide = function(){
		m_currentItem.Visible = false;
	};
	this.RemoveItem = function( pItemHTML ){
		for( var index = 0; index < m_items.length ; index++){
			if ( pItemHTML.ID == m_items[ index].ID ) {
	    	m_items.splice(index, 1);
				m_currentItem.Scroll.Vertical = m_currentItem.Scroll.Vertical;
				for( var  i = 0; i < m_currentItem.OnRemoveItem.length ; i++){
					m_currentItem.OnRemoveItem[i]( pItemHTML , this );
				}
				return true;
			}
		}
		return false;
	};
	this.SetHTML = function( pElementDOM_HTML ){
		var Label_HTML =  pElementDOM_HTML.tagName;
		var flagLink = false;
		var Link_HTML = {};
		if( Label_HTML == "A" ){
			if( $( pElementDOM_HTML ).attr("page-name") ){
				Link_HTML.Text 	= $( pElementDOM_HTML ).attr("page-name");
				Link_HTML.Value = $( pElementDOM_HTML ).attr("href");
			}
			else{
				Link_HTML.Text 	= $( pElementDOM_HTML ).attr("href");
				Link_HTML.Value = $( pElementDOM_HTML ).attr("href");
			}
			flagLink = true;
			pElementDOM_HTML = pElementDOM_HTML.firstChild ;
		}
		//==========================================================================
		// 																AccessName Property
		//==========================================================================
		if( $(pElementDOM_HTML).attr("data-accessName") ){
			m_currentItem.AccessName = $(pElementDOM_HTML).attr("data-accessName");
		}
		//==========================================================================
		// 																Active Property
		//==========================================================================
		if( $(pElementDOM_HTML).hasClass("active") ){
			m_currentItem.Active = true;
		}
		//==========================================================================
		// 																Align Property
		//==========================================================================
		if( $(pElementDOM_HTML).attr("align") ){
			m_currentItem.Align = $(pElementDOM_HTML).attr("align");
		}
		//==========================================================================
		// 																AutoWidth Property
		//==========================================================================
		if( $(pElementDOM_HTML).attr("data-autowidth") ){
			m_currentItem.AutoWidth = true;
		}
		//==========================================================================
		// 																AutoHeight Property
		//==========================================================================
		if( $(pElementDOM_HTML).attr("data-autoheight") ){
			m_currentItem.AutoHeight = true;
		}
		//==========================================================================
		// 																BackColor Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("background-color") ){
			m_currentItem.BackColor = $(pElementDOM_HTML).css("background-color");
		}
		//==========================================================================
		// 																BackgroundImage Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("background-image") ){
			var attrImage = $(pElementDOM_HTML).css("background-image");
			m_image = attrImage.substring( 5 , attrImage.length - 2 );
		}
		//==========================================================================
		// 																BackgroundPosicion Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("background-position") ){
			m_currentItem.BackgroundPosicion = $(pElementDOM_HTML).css("background-position");
		}
		//==========================================================================
		// 																BackgroundRepeat Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("background-repeat") ){
			m_currentItem.BackgroundRepeat = $(pElementDOM_HTML).css("background-repeat");
		}
		//==========================================================================
		// 																Border Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("border-color") ){
			m_currentItem.Border.Color = $(pElementDOM_HTML).css("border-color");
		}
		if( $(pElementDOM_HTML).css("border-width") ){
			m_currentItem.Border.Width = $(pElementDOM_HTML).css("border-width");
		}
		if( $(pElementDOM_HTML).css("border-style") ){
			m_currentItem.Border.Style = $(pElementDOM_HTML).css("border-style");
		}
		if( $(pElementDOM_HTML).css("border-radius") ){
			m_currentItem.Border.Radius = $(pElementDOM_HTML).css("border-radius");
		}
		//==========================================================================
		// 																Color Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("color") ){
			m_currentItem.Color = $(pElementDOM_HTML).css("color");
		}
		//==========================================================================
		// 																DecorationText Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("text-decoration") ){
			m_currentItem.DecorationText = $(pElementDOM_HTML).css("text-decoration");
		}
		//==========================================================================
		// 																Enabled Property
		//==========================================================================
		if( $(pElementDOM_HTML).attr("data-enabled") ){
			m_currentItem.Enabled = $(pElementDOM_HTML).attr("data-enabled");
		}
		//==========================================================================
		// 																Float Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("float") ){
			m_currentItem.Float = $(pElementDOM_HTML).css("float");
		}
		//==========================================================================
		// 																Font Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("font-family") ){
			m_currentItem.Font.Family = $(pElementDOM_HTML).css("font-family");
		}
		if( $(pElementDOM_HTML).css("font-size") ){
			m_currentItem.Font.Size = $(pElementDOM_HTML).css("font-size");
		}
		if( $(pElementDOM_HTML).css("font-weight") ){
			m_currentItem.Font.Width = $(pElementDOM_HTML).css("font-weight");
		}
		//==========================================================================
		// 																Label Property
		//==========================================================================
		if( pElementDOM_HTML.tagName ){
			m_currentItem.Label = pElementDOM_HTML.tagName;
		}
		//==========================================================================
		// 																Link Property
		//==========================================================================
		if( flagLink ){
			m_currentItem.Link = Link_HTML ;
		}
		//==========================================================================
		// 																Margin Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("margin-top")  ){
			if(!m_currentItem.Margin){
				m_currentItem.Margin= {};
			}
			m_currentItem.Margin.TOP = $(pElementDOM_HTML).css("margin-top")  ;
		}
		if( $(pElementDOM_HTML).css("margin-left")  ){
			if(!m_currentItem.Margin){
				m_currentItem.Margin= {};
			}
			m_currentItem.Margin.LEFT = $(pElementDOM_HTML).css("margin-left")  ;
		}
		if( $(pElementDOM_HTML).css("margin-right")  ){
			if(!m_currentItem.Margin){
				m_currentItem.Margin= {};
			}
			m_currentItem.Margin.RIGHT = $(pElementDOM_HTML).css("margin-right")  ;
		}
		if( $(pElementDOM_HTML).css("margin-bottom")  ){
			if(!m_currentItem.Margin){
				m_currentItem.Margin= {};
			}
			m_currentItem.Margin.BOTTOM = $(pElementDOM_HTML).css("margin-bottom")  ;
		}
		//==========================================================================
		// 																MaxHeight Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("max-height")  ){
			m_currentItem.MaxHeight = $(pElementDOM_HTML).css("max-height")  ;
		}
		//==========================================================================
		// 																MaxWidth Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("max-width")  ){
			m_currentItem.MaxWidth = $(pElementDOM_HTML).css("max-width")  ;
		}
		//==========================================================================
		// 																MinHeight Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("min-height")  ){
			m_currentItem.MinHeight = $(pElementDOM_HTML).css("min-height")  ;
		}
		//==========================================================================
		// 																MinHeight Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("min-width")  ){
			m_currentItem.MinWidth = $(pElementDOM_HTML).css("min-width")  ;
		}
		//==========================================================================
		// 																Padding Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("padding-top")  ){
			m_currentItem.Padding.TOP = $(pElementDOM_HTML).css("padding-top")  ;
		}
		if( $(pElementDOM_HTML).css("padding-right")  ){
			m_currentItem.Padding.RIGHT = $(pElementDOM_HTML).css("padding-right")  ;
		}
		if( $(pElementDOM_HTML).css("padding-left")  ){
			m_currentItem.Padding.LEFT = $(pElementDOM_HTML).css("padding-left")  ;
		}
		if( $(pElementDOM_HTML).css("padding-bottom")  ){
			m_currentItem.Padding.BOTTOM = $(pElementDOM_HTML).css("padding-bottom")  ;
		}
		//==========================================================================
		// 																Responsive Property
		//==========================================================================
		var type_class = "col-xs-";
		if( $(pElementDOM_HTML).attr("class").indexOf( type_class ) != -1  ){
			var array_class = $(pElementDOM_HTML).attr("class").split(" ");
			for( var i = 0 ; i < array_class.length ; i++ ){
				if( array_class[ i ].indexOf( type_class ) != -1 ){
					m_currentItem.Responsive.PHONES = parseInt( array_class[ i ].replace(type_class ,"") );
					break;
				}
			}
		}
		type_class = "col-sm-";
		if( $(pElementDOM_HTML).attr("class").indexOf( type_class ) != -1  ){
			var array_class = $(pElementDOM_HTML).attr("class").split(" ");
			for( var i = 0 ; i < array_class.length ; i++ ){
				if( array_class[ i ].indexOf( type_class ) != -1 ){
					m_currentItem.Responsive.TABLES = parseInt( array_class[ i ].replace(type_class ,"") );
					break;
				}
			}
		}
		type_class = "col-md-";
		if( $(pElementDOM_HTML).attr("class").indexOf( type_class ) != -1  ){
			var array_class = $(pElementDOM_HTML).attr("class").split(" ");
			for( var i = 0 ; i < array_class.length ; i++ ){
				if( array_class[ i ].indexOf( type_class ) != -1 ){
					m_currentItem.Responsive.NOTEBOOK = parseInt( array_class[ i ].replace(type_class ,"") );
					break;
				}
			}
		}
		type_class = "col-lg-";
		if( $(pElementDOM_HTML).attr("class").indexOf( type_class ) != -1  ){
			var array_class = $(pElementDOM_HTML).attr("class").split(" ");
			for( var i = 0 ; i < array_class.length ; i++ ){
				if( array_class[ i ].indexOf( type_class ) != -1 ){
					m_currentItem.Responsive.DESKTOPS = parseInt( array_class[ i ].replace(type_class ,"") );
					break;
				}
			}
		}
		//==========================================================================
		// 																Size Property
		//==========================================================================
		if( $(pElementDOM_HTML).attr("data-height") ){
			m_currentItem.Size.Height = $(pElementDOM_HTML).attr("data-height")   ;
		}
		if( $(pElementDOM_HTML).attr("data-width") ){
			m_currentItem.Size.Width = $(pElementDOM_HTML).attr("data-width");
		}
		//==========================================================================
		// 																TextAlign Property
		//==========================================================================
		if( $(pElementDOM_HTML).css("text-align") ){
			m_currentItem.TextAlign = $(pElementDOM_HTML).css("text-align") ;
		}
	};
	this.ToHTML = function(){
		return "";
	};
	var _OnClick = function( senderHTML , args ){
		senderHTML.IsSelected = !senderHTML.IsSelected;
		senderHTML.Parent.SelectedItem 			= senderHTML; //Seleccionado en el parent
		senderHTML.GranParent.SelectedItem 	= senderHTML; //Seleccionado en el editor
		for( var  i = 0; i < senderHTML.OnClick.length ; i++){
			senderHTML.OnClick[i]( senderHTML , args );
		}
	};
	__Init();
}

//
//	=========================================================================
// 		Control de Imagen
//	=========================================================================
function norImage(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_autoSize 	= false ,
		m_src 			= "" ;
	Configuration.ItemType = ItemType.IMAGE;
	Configuration.Container = document.createElement("img");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'AutoSize' : { get: function() { return m_autoSize; 							},
						set : function( pAttributeValue ) {
							m_autoSize = pAttributeValue;
							if( m_autoSize ){
								$(m_currentItem).addClass("img-responsive");
							}
							else{
								$(m_currentItem).addClass("img-responsive");
							}
						}
				},
		'Image' : { get: function() { return m_src; 							},
								set : function( pAttributeValue ) {
									if( pAttributeValue ){
										if( m_src == ""){
											m_src = m_currentItem.ID + ".png";
										}
										UploadResources( m_src , "IMAGE" , pAttributeValue  , function( data ){
											var jsonData = JSON.parse( data );
											$(m_currentItem.Container).attr( "src", jsonData.TOKEN +"?"+ new Date().getTime());
										});
									}
									else{
										$(m_currentItem.Container).attr( "src", "");
										m_src = "";
									}
								}
						}

	});
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("img") );
		var l_elementContent = null;
		if( $(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").length == 0 ){
			l_elementContent = elementHTML;
		}
		else{
			l_elementContent = $(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").get(0);
		}
		$(l_elementContent).attr("html-type","IMAGE");
		$(l_elementContent).attr("src","../../lib/images/" + m_src );
		$(l_elementContent).attr( "data-src",  m_src);
		if( m_autoSize ){
			l_elementContent.style.width  = null;
			l_elementContent.style.height = null;
		}

		return l_elementContent.outerHTML;
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_src = m_currentItem.ID + ".png";
				m_currentItem.Size.Width  = 150;
				m_currentItem.Size.Height = 100;
			}
			else{
				if( Configuration.ConfigHTML.tagName == "A" ){
					Configuration.ConfigHTML = Configuration.ConfigHTML.firstChild;
				}
				if( $(Configuration.ConfigHTML).hasClass("img-responsive") ){
					m_autoSize = true;
				}
				if( $(Configuration.ConfigHTML).attr("data-src") ){
					$(m_currentItem.Container).attr( "src", "../../"+$(Configuration.ConfigHTML).attr("src")+"?"+ new Date().getTime());
					m_src = $( Configuration.ConfigHTML).attr("data-src");
				}
			}
		};
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM ).droppable( "destroy" );
		m_currentItem.EnabledSortable = false;
		m_currentItem.OnReSize = function( sender , args ){
		};
	};
	__Init();
};
//	=========================================================================
// 		Control de Grid o Tabla
//	=========================================================================
function norTableCell(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {};
	Configuration.ItemType = ItemType.TABLECELL;
	Configuration.Container = document.createElement( Configuration.Label ? Configuration.Label : "tr");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	this.AddCell = function(){
		var itemList = BuilderItemHTML( ItemType.TABLECELL , { Label : "td" });
		m_currentItem.AddItem( itemList );
		itemList.ClassOwer = m_currentItem.ClassOwer ;
	};
	this.RemoveCell = function(){
		if( m_currentItem.Items.length > 0 ){
			m_currentItem.Items[ m_currentItem.Items.length - 1 ].Dispose();
		}
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = 50;
				m_currentItem.Size.Height = "100%";
			}
		};
		$( m_currentItem.ElementDOM ).resizable("destroy");
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.resizable({
				handles : "e",
				stop: function( event , ui){
					m_currentItem.Size.Width = ui.size.width ;
				}
			});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("td") );
		$(elementHTML)
			.attr("html-type","TABLECELL");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norTableRow(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ;
	Configuration.ItemType = ItemType.TABLEROW;
	Configuration.Container = document.createElement( Configuration.Label ? Configuration.Label : "tr");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Cells': {
			get: function() { return m_currentItem.Items.length; 							},
			set : function( pAttributeValue ) {
				while( m_currentItem.Items.length < pAttributeValue ){
						m_currentItem.AddCell();
				}
				while( m_tabController.Items.length > pAttributeValue ){
						m_currentItem.RemoveCell();
				}
			}
		}
	});
	this.AddCell = function(){
		var itemList = BuilderItemHTML( ItemType.TABLECELL , { Label : "td" });
		m_currentItem.AddItem( itemList );
		itemList.ClassOwer = m_currentItem.ClassOwer ;
	};
	this.RemoveCell = function(){
		if( m_currentItem.Items.length > 0 ){
			m_currentItem.Items[ m_currentItem.Items.length - 1 ].Dispose();
		}
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = "100%";
				m_currentItem.Size.Height = 50;
			}
		};
		m_currentItem.OnAddItem = function( pItemHtml ){
			for( var i = 0;  i< m_currentItem.Items.length ; i++){
				m_currentItem.Items[ i ].Size.Width = $(m_currentItem.ElementDOM).width() / m_currentItem.Items.length ;
				m_currentItem.Items[ i ].Size.Height = m_currentItem.Size.Height  -20;
			}
		};
		m_currentItem.OnReSize = function(){
			$(m_currentItem.referenceDOM).css("height", ( $(m_currentItem.ElementDOM).height()) + "px"  );
			for( var i = 0;  i< m_currentItem.Items.length ; i++){
				m_currentItem.Items[ i ].Size.Width = $(m_currentItem.ElementDOM).width() / m_currentItem.Items.length ;
				m_currentItem.Items[ i ].Size.Height = m_currentItem.Size.Height  -20;
			}
		};
		$( m_currentItem.ElementDOM ).resizable("destroy");

		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.droppable( "destroy" )
			.resizable({
				handles : "s",
				stop: function( event , ui){
					m_currentItem.Size.Height = ui.size.height ;
				}
			})
			.find("[command-group="+m_currentItem.ID+"]")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller addItem-propertiesController 	'><i class='glyphicon glyphicon-plus' /></i></div>")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller removeItem-propertiesController'><i class='glyphicon glyphicon-minus' /></i></div>");

			$( m_currentItem.ElementDOM ).find(".addItem-propertiesController").click(function(){
				m_currentItem.AddCell();
			});
			$( m_currentItem.ElementDOM ).find(".removeItem-propertiesController").click(function(){
				m_currentItem.RemoveCell();
			});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("tr") );
		$(elementHTML)
			.attr("html-type","TABLEROW");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norGrid(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_borderTable				= false,
		m_columns 					= []	 ,
		m_bodyController		= null ,
		m_footerController 	= null ,
		m_headerController 	= null ;
	Configuration.ItemType = ItemType.GRID;
	Configuration.Container = document.createElement("table");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'BorderTable': {
			get: function() { return m_borderTable; 							},
			set : function( pAttributeValue ) {
				m_borderTable = pAttributeValue;
				$(m_currentItem.referenceDOM).attr("border", m_borderTable ? 1:0);
			}
		},
		'Rows': {
			get: function() { return m_currentItem.Items.length; 							},
			set : function( pAttributeValue ) {
				while( m_currentItem.Items.length < pAttributeValue ){
						m_currentItem.AddRow();
				}
				while( m_tabController.Items.length > pAttributeValue ){
						m_currentItem.RemoveRow();
				}
			}
		}
	});

	this.AddRow = function(){
		var itemList = BuilderItemHTML( ItemType.TABLEROW , { Label : "tr" });
		m_currentItem.AddItem( itemList );
		itemList.ClassOwer = m_currentItem.ClassOwer ;
	};
	this.RemoveRow = function(){
		if( m_currentItem.Items.length > 0 ){
			m_currentItem.Items[ m_currentItem.Items.length - 1 ].Dispose();
		}
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = 250;
				m_currentItem.Size.Height = 300;
				m_currentItem.Scroll.Vertical = false;
			}
		};
		m_currentItem.OnReSize = function(){
			for( var i = 0 ; i < m_currentItem.Items.length ;  i++){
				m_currentItem.Items[i].Size.Width = "100%";
			}
		};

		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.droppable( "destroy" )
			.find("[command-group="+m_currentItem.ID+"]")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller addItem-propertiesController 	'><i class='glyphicon glyphicon-plus' /></i></div>")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller removeItem-propertiesController'><i class='glyphicon glyphicon-minus' /></i></div>");

		$( m_currentItem.ElementDOM ).find(".addItem-propertiesController").click(function(){
			m_currentItem.AddRow();
		});
		$( m_currentItem.ElementDOM ).find(".removeItem-propertiesController").click(function(){
			m_currentItem.RemoveRow();
		});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("table") );
		$(elementHTML)
			.attr("html-type","GRID");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Lista Simple
//	=========================================================================
function norListItem(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ;
	Configuration.ItemType = ItemType.LISTITEM;
	Configuration.Container = document.createElement( Configuration.Label ? Configuration.Label : "li");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = "100%";
				m_currentItem.Size.Height = 50;
			}
		};
		m_currentItem.OnReSize = function(){
			$(m_currentItem.referenceDOM).css("height", ( $(m_currentItem.ElementDOM).height()) + "px"  );
		};
		$( m_currentItem.ElementDOM ).resizable("destroy");

		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.resizable({
				handles : "s",
				stop: function( event , ui){
					m_currentItem.Size.Height = ui.size.height ;
				}
			});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("li") );
		$(elementHTML)
			.addClass("lead")
			.attr("html-type","LISTITEM");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norListView(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_listStyle = "none" ;
	Configuration.ItemType = ItemType.LISTVIEW;
	Configuration.Container = document.createElement("ul");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'ListStyle' : {
			get: function() { return m_listStyle; 							},
			set : function( pAttributeValue ) {
				if( pAttributeValue == null){
					$(m_currentItem.Container).css("list-style-image","");
					m_listStyle = "";
					return;
				}
				if( pAttributeValue.IMAGE ){
					if( m_listStyle.indexOf(".") == -1 || m_listStyle == "" ){
						m_listStyle = "BL"+m_currentItem.ID+".png";
					}
					UploadResources( m_listStyle , "IMAGE" , pAttributeValue.IMAGE  , function( data ){
						var jsonData = JSON.parse( data );
						$(m_currentItem.Container).css( "list-style-image","url('" +jsonData.TOKEN +"?"+ new Date().getTime() +"')");
					});
				}
				else{
					m_listStyle = pAttributeValue;
					$( m_currentItem.referenceDOM ).css( "list-style", m_listStyle );
				}
			}
		}
	});
	this.AddItemList = function(){
		var itemList = BuilderItemHTML( ItemType.LISTITEM , { Label : "li" });
		m_currentItem.AddItem( itemList );
		itemList.ClassOwer = m_currentItem.ClassOwer ;
	};
	this.RemoveItemList = function(){
		if( m_currentItem.Items.length > 0 ){
			m_currentItem.Items[ m_currentItem.Items.length - 1 ].Dispose();
		}
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = 250;
				m_currentItem.Size.Height = 300;
			}
			else{
				if( $(Configuration.ConfigHTML).css("list-style") ){
					m_listStyle = $(Configuration.ConfigHTML).css("list-style");
				}
				if( $(Configuration.ConfigHTML).attr("data-styleImage") ){
					m_listStyle = $(Configuration.ConfigHTML).attr("data-styleImage");
					$(m_currentItem.Container).css( "list-style-image","url('../../lib/images/" + m_listStyle + "')");
				}
			}
		};
		m_currentItem.OnReSize = function(){
			for( var i = 0 ; i < m_currentItem.Items.length ;  i++){
				m_currentItem.Items[i].Size.Width = "100%";
			}
		};

		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.droppable( "destroy" )
			.find("[command-group="+m_currentItem.ID+"]")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller addItem-propertiesController 	'><i class='glyphicon glyphicon-plus' /></i></div>")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller removeItem-propertiesController'><i class='glyphicon glyphicon-minus' /></i></div>");

		$( m_currentItem.ElementDOM ).find(".addItem-propertiesController").click(function(){
			m_currentItem.AddItemList();
		});
		$( m_currentItem.ElementDOM ).find(".removeItem-propertiesController").click(function(){
			m_currentItem.RemoveItemList();
		});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("ul") );
		$(elementHTML)
			.attr("html-type","LISTVIEW");
		if( m_listStyle.indexOf(".") == -1 ){
			$(elementHTML)
			.css( {
				"list-style" : m_listStyle,
				"list-style-image" : ""
			});
		}
		else{
			$(elementHTML)
			.attr("data-styleImage" , m_listStyle)
			.css( {
				"list-style" : "",
				"list-style-image" : "url('lib/images/" + m_listStyle +"')"
			});
		}
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Linea
//	=========================================================================
function norLine(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ;
	Configuration.ItemType = ItemType.LINE;
	Configuration.Container = document.createElement("hr");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
			m_currentItem.Size.Width  = "100%";
			m_currentItem.Size.Height = 30;
			m_currentItem.MaxHeight = 30;
			m_currentItem.MinHeight = 30;
			}
		};
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("HR") , true );
		$(elementHTML)
			.attr("html-type","LINE");
		return elementHTML.outerHTML;
	};
	__Init();
};
//	=========================================================================
// 		Control de Label
//	=========================================================================
function norLabel(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_text 			= "",
		m_textType 	= "Texto" ;
	Configuration.ItemType = ItemType.LABEL;
	Configuration.Container = document.createElement("span");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Text' : {
			get: function() { return m_text; 							},
			set : function( pAttributeValue ) {
				m_text = pAttributeValue;
				$( m_currentItem.referenceDOM ).html( m_text );
			}
		},
		'TextType' : {
			get: function() { return m_textType; 							},
			set : function( pAttributeValue ) {
				m_textType = pAttributeValue;
				m_currentItem.Label = "span";
				if( m_textType == "Title 1" ){
					m_currentItem.Label = "h1";
				}
				else if( m_textType == "Title 2" ){
					m_currentItem.Label = "h2";
				}
				else if( m_textType == "Title 3" ){
					m_currentItem.Label = "h3";
				}
				else if( m_textType == "Title 4" ){
					m_currentItem.Label = "h4";
				}
				else if( m_textType == "Title 5" ){
					m_currentItem.Label = "h5";
				}
				else if( m_textType == "Title 6" ){
					m_currentItem.Label = "h6";
				}
				else if( m_textType == "Parrafo" ){
					m_currentItem.Label = "p";
				}
				m_currentItem.RefreshLabel();
				$( m_currentItem.referenceDOM )
					.html( m_text );
			}
		}
	});
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Label = "span";
				m_currentItem.Size.Width  = 150;
				m_currentItem.Size.Height = 50;
			}
			else{

				if( Configuration.ConfigHTML.tagName == "A" ){
					Configuration.ConfigHTML = Configuration.ConfigHTML.firstChild;
				}

				if( Configuration.ConfigHTML.tagName == "H1" ){
					m_currentItem.TextType = "Title 1";
				}
				else if( Configuration.ConfigHTML.tagName == "H2" ){
					m_currentItem.TextType = "Title 2";
				}
				else if( Configuration.ConfigHTML.tagName == "H3" ){
					m_currentItem.TextType = "Title 3";
				}
				else if( Configuration.ConfigHTML.tagName == "H4" ){
					m_currentItem.TextType = "Title 4";
				}
				else if( Configuration.ConfigHTML.tagName == "H5" ){
					m_currentItem.TextType = "Title 5";
				}
				else if( Configuration.ConfigHTML.tagName == "H6" ){
					m_currentItem.TextType = "Title 6";
				}
				else if( Configuration.ConfigHTML.tagName == "P" ){
					m_currentItem.TextType = "Parrafo";
				}
				else{
					m_currentItem.TextType = "Texto";
				}
				if( Configuration.ConfigHTML.firstChild ){
					m_currentItem.Text = Configuration.ConfigHTML.firstChild.nodeValue;
				}
			}
		};
		m_currentItem.OnReSize = function(){
			$( m_currentItem.referenceDOM ).css("height", m_currentItem.Size.Height - 20 );
		};
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement( m_currentItem.Label ) );
		if( $(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").length == 0 ){
			$(elementHTML)
				.attr("html-type","LABEL")
				.html( m_text );
		}
		else{
			$(elementHTML)
				.attr("html-type","LABEL")
				.find("[content-html=html_"+m_currentItem.ID +"]")
				.html( m_text );
		}
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Label
//	=========================================================================
function norPanel(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_container = false;

	Configuration.ItemType = ItemType.PANEL;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Container' : {
			get: function() { return m_container; 							},
			set : function( pAttributeValue ) {
				m_container = pAttributeValue;
				if( m_container ){
					$(elementDOM).addClass("row");
				}
				else{
					$(elementDOM).removeClass("row");
				}
			}
		},
	});
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = 350;
				m_currentItem.Size.Height = 250;
			}
		};
		m_currentItem.OnReSize = function(){
			$(m_currentItem.referenceDOM ).css("height", $(m_currentItem.ElementDOM).height() + 20);
		};
		$( m_currentItem.ElementDOM ).css({"padding":"20px 0px 20px 0px"});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") );
		$(elementHTML)
			.attr("html-type","PANEL");
		return elementHTML.outerHTML;
	};
	__Init();
};
//	=========================================================================
// 		Control de Video
//	=========================================================================
function norVideo(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_type		= "",
		m_video		= "";
	Configuration.ItemType = ItemType.VIDEO;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Video' : {
			get: function() { return m_video; 							},
			set : function( pAttributeValue ) {
				if( pAttributeValue.VIDEO ){
					UploadResources( m_video , "VIDEO" , pAttributeValue  , function( data ){
						var jsonData = JSON.parse( data );
						$(m_currentItem.Container).attr( "src", jsonData.TOKEN );
					});
				}
				else{
					m_video = pAttributeValue;
					m_currentItem.Label = "iframe";
				}
			}
		},
		'Format' :{
			get: function() { return m_type; 							},
			set : function( pAttributeValue ) {
				m_type = pAttributeValue;
				$(m_currentItem.Container).attr( "type", "video/" + m_type );
			}
		}
	});
	var __Init = function(){
		if( !Configuration.ConfigHTML ){
				m_video = m_currentItem.ID + ".mp4";
				m_currentItem.Size.Width  = 350;
				m_currentItem.Size.Height = 250;
		}
		else{
			m_currentItem.Size.Width  = 350;
			m_currentItem.Size.Height = 250;
			if( Configuration.ConfigHTML.tagName == "A" ){
				Configuration.ConfigHTML = Configuration.ConfigHTML.firstChild;
			}
			if( $(Configuration.ConfigHTML).attr("data-src") ){
				m_video = $( Configuration.ConfigHTML).attr("data-src");
			}
		}
		m_currentItem.ClassOwer = null;
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.droppable( "destroy" )
			.append(function(){
				var elementoDIV = document.createElement("div");
				$(elementoDIV)
					.css({
						"position":"absolute",
						"bottom":"0px",
						"width" : "100%",
						"background-color":"rgb(15, 18, 19)"
					})
					.append(function(){
						var elementButtonPlay = document.createElement("button");
						$(elementButtonPlay)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-play'></i>")
						return elementButtonPlay;
					})
					.append(function(){
						var elementButtonForward = document.createElement("button");
						$(elementButtonForward)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-fast-forward'></i>")
						return elementButtonForward;
					})
					.append(function(){
						var elementButtonSound = document.createElement("button");
						$(elementButtonSound)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-volume-up'></i>")
						return elementButtonSound;
					});
				return elementoDIV;
			});

	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("video") );

		if( $(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").length == 0 ){
			$(elementHTML).attr("html-type","VIDEO");
			$(elementHTML).attr("src","lib/video/" + m_video )
				.attr( "data-src",  m_video)
				.append("<source src='"+m_video+"' type='video/mp4'>");
		}
		else{
			$(elementHTML).attr("html-type","VIDEO");
			$(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").attr("src","lib/video/" + m_video );
			$(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]")
				.attr( "data-src",  m_video)
				.append("<source src='"+m_video+"' type='video/mp4'>");
		}
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Audio
//	=========================================================================
function norAudio(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_audio = "" ,
		m_autoPlay = "",
		m_type  = "" ;
	Configuration.ItemType = ItemType.AUDIO;
	Configuration.Container = document.createElement("div");
	Object.defineProperties( m_currentItem , {
		'Audio' : {
			get: function() { return m_audio; 							},
			set : function( pAttributeValue ) {
				UploadResources( m_audio , "AUDIO" , pAttributeValue  , function( data ){
					var jsonData = JSON.parse( data );
					$(m_currentItem.Container).attr( "src", jsonData.TOKEN );
				});
			}
		},
		'AutoPlay' : {
			get: function() { return m_autoPlay; 							},
			set : function( pAttributeValue ) {
				m_autoPlay = pAttributeValue;
			}
		},
		'Format' :{
			get: function() { return m_type; 							},
			set : function( pAttributeValue ) {
				m_type = pAttributeValue;
				$(m_currentItem.Container).attr( "type", "audio/" + m_type );
			}
		}
	});
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		if( !Configuration.ConfigHTML ){
				m_audio = m_currentItem.ID + ".mp3";
				m_currentItem.Size.Width  = 200;
				m_currentItem.Size.Height = 50;
				m_currentItem.MaxHeight 	= 50;
				m_currentItem.MinHeight 	= 50;
		}
		else{
			if( Configuration.ConfigHTML.tagName == "A" ){
				Configuration.ConfigHTML = Configuration.ConfigHTML.firstChild;
			}
			if( $(Configuration.ConfigHTML).attr("data-src") ){
				m_audio = $( Configuration.ConfigHTML).attr("data-src");
			}
		}
		m_currentItem.ClassOwer = null;
		m_audio = m_currentItem.ID + ".mp3";
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.resizable("destroy")
			.droppable( "destroy" )
			.append(function(){
				var elementoDIV = document.createElement("div");
				$(elementoDIV)
					.css({
						"margin-top":"-27px",
						"background-color":"rgb(15, 18, 19)"
					})
					.append(function(){
						var elementButtonBack= document.createElement("button");
						$(elementButtonBack)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-fast-backward'></i>")
						return elementButtonBack;
					})
					.append(function(){
						var elementButtonStop = document.createElement("button");
						$(elementButtonStop)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-stop'></i>")
						return elementButtonStop;
					})
					.append(function(){
						var elementButtonPlay = document.createElement("button");
						$(elementButtonPlay)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-play'></i>")
						return elementButtonPlay;
					})
					.append(function(){
						var elementButtonForward = document.createElement("button");
						$(elementButtonForward)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-fast-forward'></i>")
						return elementButtonForward;
					})
					.append(function(){
						var elementButtonSound = document.createElement("button");
						$(elementButtonSound)
							.attr("type","button")
							.addClass("btn btn-default btn-sm")
							.css({
								"color":"white",
								"background-color":"rgb(15, 18, 19)"
							})
							.append("<i class='glyphicon glyphicon-volume-up'></i>")
						return elementButtonSound;
					});
				return elementoDIV;
			});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("audio") );
		if( $(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").length == 0 ){
			$(elementHTML).attr("html-type","AUDIO");
			$(elementHTML).attr( "data-src",  m_audio);
			$(elementHTML).attr("autoplay", m_autoPlay );
			$(elementHTML).append("<source src='lib/audio/" + m_audio+"' type='audio/mpeg'>");
		}
		else{
			$(elementHTML).attr("html-type","AUDIO");
			$(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").attr( "data-src",  m_audio);
			$(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").attr("autoplay", m_autoPlay );
			$(elementHTML).find("[content-html=html_"+m_currentItem.ID +"]").append("<source src='lib/audio/" + m_audio+"' type='audio/mpeg'>");
		}
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Upload
//	=========================================================================
function norUpload(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ;
	Configuration.ItemType = ItemType.UPLOADFILE;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.Size.Width  = 250;
		m_currentItem.Size.Height = 40;

		m_currentItem.MaxHeight = 40;
		m_currentItem.MinHeight = 40;

		m_currentItem.MaxWidth = 250;
		m_currentItem.MinWidth = 250;
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("input") );
		m_currentItem.ClassOwer = null;
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$(elementHTML)
			.attr("html-type","UPLOADFILE");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de ComboBox
//	=========================================================================
function norComboBox(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_itemsList = [];
	Configuration.ItemType = ItemType.COMBOBOX;
	Configuration.Container = document.createElement("select");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Audio' : {
			get: function() { return m_itemsList; 							},
			set : function( pAttributeValue ) {
				m_itemsList = pAttributeValue;
			}
		}
	});
	var __Init = function(){
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		m_currentItem.EnabledSortable = false;
		m_currentItem.Size.Width = 175;
		m_currentItem.Size.Height = 40;

		m_currentItem.MaxHeight = 40;
		m_currentItem.MinHeight = 40;
		$(m_currentItem.ElementDOM).css({"width":"175","height":"40"});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("select") );
		$(elementHTML)
			.attr("html-type","COMBOBOX");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de ComboBox
//	=========================================================================
function norTextBox(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_text = "";
	Configuration.ItemType = ItemType.TEXTBOX;
	Configuration.Container = document.createElement("input");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Text' : {
			get: function() { return m_text; 							},
				set : function( pAttributeValue ) {
					m_text = pAttributeValue;
					$( m_currentItem.referenceDOM ).val( m_text );
				}
		}
	});
	var __Init = function(){
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		m_currentItem.EnabledSortable = false;
		m_currentItem.Size.Width = 175;
		m_currentItem.Size.Height = 30;
		$(m_currentItem.ElementDOM).css({"width":"175","height":"30"});

	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("input") );
		$(elementHTML)
			.attr("html-type","TEXTBOX");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Button
//	=========================================================================
function norButton(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_text = "" ,
		m_value = "";
	Configuration.ItemType = ItemType.BUTTON;
	Configuration.Container = document.createElement("button");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Text' : {
			get: function() { return m_text; 							},
				set : function( pAttributeValue ) {
					m_text = pAttributeValue;
					$( m_currentItem.referenceDOM ).html( m_text );
				}
		}
	});
	var __Init = function(){
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		m_currentItem.EnabledSortable = false;
		m_currentItem.Size.Width = 175;
		m_currentItem.Size.Height = 40;
		$(m_currentItem.ElementDOM).css({"width":"175","height":"40"});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("button") );
		$(elementHTML)
			.attr("html-type","BUTTON");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de CheckBox
//	=========================================================================
function norCheckBox(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_value = "";
	Configuration.ItemType = ItemType.CHECKBOX;
	Configuration.Container = document.createElement("input");
	BaseItemHTML.apply( m_currentItem, [Configuration] );


	var __Init = function(){
		$(Configuration.Container).attr("type","checkBox");
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		m_currentItem.EnabledSortable = false;
		m_currentItem.Size.Width = 20;
		m_currentItem.Size.Height = 20;
		$(m_currentItem.ElementDOM).css({"width":"20","height":"20"});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("input") );
		$(elementHTML)
			.attr("html-type","CHECKBOX");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de RadioButton
//	=========================================================================
function norRadioButton(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_value = "";
	Configuration.ItemType = ItemType.RADIOBUTTON;
	Configuration.Container = document.createElement("input");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		$(Configuration.Container).attr("type","radio");
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM ).droppable( "destroy" );
		m_currentItem.EnabledSortable = false;
		m_currentItem.Size.Width = 20;
		m_currentItem.Size.Height = 20;
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("input") );
		$(elementHTML)
			.attr("html-type","RADIOBUTTON");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de RadioButton
//	=========================================================================
function norForm(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_method = "",
		m_action = "";
	Configuration.ItemType = ItemType.FORM;
	Configuration.Container = document.createElement("form");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Method' : {
			get: function() { return m_method; 							},
				set : function( pAttributeValue ) {
					m_method = pAttributeValue;
					$( m_currentItem.referenceDOM ).attr("method" , m_method );
				}
		},
		'Action' : {
			get: function() { return m_action; 							},
				set : function( pAttributeValue ) {
					m_action = pAttributeValue;
					$( m_currentItem.referenceDOM ).attr("action" , m_action );
				}
		}
	});
	var __Init = function(){
		$( m_currentItem.ElementDOM ).css({"padding":"20px 0px 20px 0px"});
		m_currentItem.Size.Width  = 350;
		m_currentItem.Size.Height = 500;
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("form") );
		$(elementHTML)
			.attr("html-type","FORM");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Calendario
//	=========================================================================
function norCalendar(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_src;
	Configuration.ItemType = ItemType.CALENDAR;
	Configuration.Container = document.createElement("table");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.Size.Width  = 250;
		m_currentItem.Size.Height = 200;
	};
	__Init();

};
//	=========================================================================
// 		Control de Progress
//	=========================================================================
function norProgress(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_src;
	Configuration.ItemType = ItemType.PROGRESS;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.Size.Width  = 250;
		m_currentItem.Size.Height = 75;
	};
	__Init();

};
//	=========================================================================
// 		Control de Progress
//	=========================================================================
function norDatePicker(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_src;
	Configuration.ItemType = ItemType.DATEPICKER;
	Configuration.Container = document.createElement("input");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.Size.Width = 175;
		m_currentItem.Size.Height = 30;

		m_currentItem.MaxHeight = 30;
		m_currentItem.MinHeight = 30;
	};
	__Init();

};
//	=========================================================================
// 		Control de Slider
//	=========================================================================
function norSliderCaption(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {};
	Configuration.ItemType = ItemType.SLIDERCAPTION;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width 	= "100%";
				m_currentItem.Size.Height = 50;
			}
		}
		$( m_currentItem.ElementDOM )
			.css({
				"padding":"20px 0px 0px 0px",
		    "position": "absolute",
		    "bottom": "0px",
		    "left": "0px"
			})
			.resizable( "destroy" )
			.find(".editor-HandlerController").remove();

		$( m_currentItem.ElementDOM )
			.resizable({
				handles : "n",
    		helper: "ui-resizable-helper",
				resize: function( event , ui){
					m_currentItem.Size.Height = ui.size.height ;
					m_currentItem.ElementDOM.style.top = null;
				}
			});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") , true);
		$(elementHTML)
			.addClass("carousel-caption")
			.attr("html-type","SLIDERCAPTION");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norSliderController(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_caption = true;
		Configuration.ItemType = ItemType.SLIDERCONTROLLER;
		Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Caption' :{
			get: function() { return m_caption; },
			set : function( pAttributeValue ) {
				m_caption = pAttributeValue;
				if( m_caption ){
					_AddCaption();
				}
				else{
					_RemoveCaption();
				}
			}
		}
	});
	var _RemoveCaption = function(){
		for( var i = 0 ; i < m_currentItem.Items.length ; i++){
			if( m_currentItem.Items[ i ].ItemType == ItemType.SLIDERCAPTION ){
				m_currentItem.Items[ i ].Dispose();
			}
		}
	};
	var _AddCaption = function(){
		var itemCaption = BuilderItemHTML( ItemType.SLIDERCAPTION , { Label : "div" });
		m_currentItem.AddItem( itemCaption );
		itemCaption.ClassOwer = m_currentItem.ClassOwer ;
		itemCaption.OnDispose = function(){
			m_caption = false;
		};
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				_AddCaption();
				m_currentItem.Size.Width 	= "100%";
				m_currentItem.Size.Height = "100%";
			}
		}
		m_currentItem.OnReSize = function( sender, args ){
			for( var i = 0 ; i < m_currentItem.Items.length ; i++){
				if( m_currentItem.Items[ i ].ItemType == ItemType.SLIDERCAPTION ){
					m_currentItem.Items[ i ].Size.Width = "100%";
				}
			}
		}
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.resizable( "destroy" )
			.find(".editor-HandlerController").remove();
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") );
		$(elementHTML)
			.addClass("item")
			.attr("html-type","SLIDERCONTROLLER");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norSlider(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_controllerLeft 	 = null ,
		m_controllerRight  = null ,
		m_indicator				 = null ,
		m_lastItem				 = null	,
		m_selectedIndex 	 = -1   ,
		m_slideCalled			 = false;

	var e_OnSelectChanged = [] ;
	Configuration.ItemType = ItemType.SLIDER;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'SelectedIndex' :{
			get: function() { return m_selectedIndex; 	},
			set : function( pAttributeValue ) {
				m_selectedIndex = pAttributeValue;
				$(m_indicator).find("li").removeClass("active");
				for( var i = 0 ; i < m_currentItem.Items.length ; i++){
					if( m_selectedIndex == i ){
						m_currentItem.Items[ i ].Show();
						m_currentItem.Items[ i ].Size.Width = m_currentItem.Items[ i ].Size.Width;
						$(m_indicator).find("[data-element=" + m_currentItem.Items[ i ].ID + "]").addClass("active");
					}
					else{
						m_currentItem.Items[ i ].Hide();
					}
				}
				for( var i = 0 ; i < e_OnSelectChanged.length ; i++){
					e_OnSelectChanged[ i ]( m_currentItem , m_currentItem.Items[ m_selectedIndex ] );
				}
			}
		},
		'Slides' : {
			get: function() { return m_currentItem.Items.length; 	},
			set : function( pAttributeValue ) {
				while( m_currentItem.Items.length < pAttributeValue ){
					m_currentItem.AddSlide();
				}
				while ( m_currentItem.Items.length >= pAttributeValue ) {
					m_currentItem.RemoveSlide();
				}
			}
		}
	});
	this.AddSlide = function(){
		var itemSlider = BuilderItemHTML( ItemType.SLIDERCONTROLLER , { Label : "div" });
		m_currentItem.AddItem( itemSlider );
		itemSlider.ClassOwer = m_currentItem.ClassOwer ;
		$( m_indicator ).append( _CreateSliderIndicatorItem( itemSlider.ID ));
		if( m_currentItem.Items.length == 1 ){
			itemSlider.Show();
		}
		else{
			itemSlider.Hide();
		}
	};
	this.RemoveSlide = function(){
		if( m_currentItem.Items.length > 0 ){
			m_currentItem.Items[ m_currentItem.Items.length - 1 ].Dispose();
		}
	};
	var _CreateSliderIndicatorItem = function( pItemHTML_id ){
		var elementLI = document.createElement("li");
		$( elementLI )
			.css({
				"border-color":"navy",
				"border-width":"2px"
			})
			.attr("data-element" , pItemHTML_id )
			.click(function(){
				for( var i = 0 ; i < m_currentItem.Items.length ; i++ ){
					if(  m_currentItem.Items[ i ].ID == $(this).attr("data-element") ){
						m_currentItem.SelectedIndex = i ;
						break;
					}
				}
			});
		if( m_currentItem.Items.length == 1 ){
			$( elementLI ).addClass("active");
		}
		return elementLI;
	};
	var _CreateSliderIndicator = function(){
		var elementIndicator = document.createElement("div");
		$(elementIndicator)
			.addClass("carousel-indicators");
		return elementIndicator;
	};
	var _CreateSliderController = function( direction ){
		var elementController = document.createElement("div");
		$(elementController)
			.addClass( direction )
			.css("z-index","1")
			.addClass("carousel-control")
			.append(function(){
				var elementA = document.createElement("span");
				$(elementA)
					.attr("data-SliderDirection", direction )
					.addClass("glyphicon glyphicon-chevron-" + direction);
				return elementA;
			});
		return elementController;
	};
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = 250;
				m_currentItem.Size.Height = 100;
			}
			else{
				m_selectedIndex = 0;
				for( i = 0 ; i < m_currentItem.Items.length ; i++){
					m_currentItem.Items[i].ClassOwer = m_currentItem.ClassOwer ;
					$( m_indicator ).append( _CreateSliderIndicatorItem( m_currentItem.Items[i].ID ));
					if( $( m_currentItem.Items[i].referenceDOM ).hasClass("active") ){
						m_selectedIndex = i;
						m_currentItem.Items[i].Show();
					}
					else{
						m_currentItem.Items[i].Hide();
					}
				}
			}
		}
		m_currentItem.OnReSize = function( sender, args ){
			for( var i = 0 ; i < m_currentItem.Items.length ; i++){
				m_currentItem.Items[ i ].Size.Height = "100%";
				m_currentItem.Items[ i ].Size.Width = "100%";
			}
		}
		m_currentItem.OnRemoveItem = function( pItemHTML ){
			$( m_indicator ).find("[data-element=" + pItemHTML.ID + "]").remove();
			if( m_currentItem.Items.length == 0)
				return;
			if( m_selectedIndex >= m_currentItem.Items.length ){
				m_currentItem.SelectedIndex = m_currentItem.Items.length - 1;
			}
			else{
				m_currentItem.SelectedIndex = m_currentItem.SelectedIndex;
			}
		};
		m_indicator = _CreateSliderIndicator( );
		m_controllerLeft = _CreateSliderController("left");
		m_controllerRight = _CreateSliderController("right");
		//$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.append( m_controllerLeft )
			.append( m_controllerRight )
			.append( m_indicator )
			.droppable( "destroy" )
			.find("[command-group="+m_currentItem.ID+"]")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller addItem-propertiesController 	'><i class='glyphicon glyphicon-plus' /></i></div>")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller removeItem-propertiesController'><i class='glyphicon glyphicon-minus' /></i></div>");
		$( m_currentItem.ElementDOM ).find(".addItem-propertiesController").click(function(){
			m_currentItem.AddSlide();
		});
		$( m_currentItem.ElementDOM ).find(".removeItem-propertiesController").click(function(){
			m_currentItem.RemoveSlide();
		});
		m_currentItem.EnabledSortable = false;
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") );
		var array_childs =  $(elementHTML).children();
		$(elementHTML)
			.attr("id",m_currentItem.ID)
			.prepend(function(){
				var elementOL = document.createElement("ol");
				$(elementOL).addClass("carousel-indicators");
				for( i = 0 ; i < m_currentItem.Items.length ; i++){
					var targetID = m_currentItem.Items[ i ].ID ;
					if( i == m_selectedIndex ){
						$(elementOL).append("<li data-target='#"+m_currentItem.ID+"' class='active' data-slide-to='"+i+"'></li>");
						$( array_childs[i] ).addClass("active");
					}
					else{
						$(elementOL).append("<li data-target='#"+m_currentItem.ID+"' data-slide-to='"+i+"'></li>");
					}
				}
				return elementOL;
			})
			.append("<div parent-id='pnl_"+m_currentItem.ID+"' class='carousel-inner' role='listbox'></div>")
			.addClass("carousel")
			.addClass("slide")
			.attr("data-ride","carousel")
			.attr("html-type","SLIDER")
			.append(function(){
				var elementA = document.createElement("a");
				$(elementA)
					.attr("href","#"+m_currentItem.ID)
					.attr("role","button")
					.attr("data-slide","prev")
					.addClass("left")
					.addClass("left carousel-control")
					.append("<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>")
					.append("<span class='sr-only'>Previous</span>");
				return elementA;
			})
			.append(function(){
				var elementA = document.createElement("a");
				$(elementA)
					.attr("href","#"+m_currentItem.ID)
					.attr("role","button")
					.attr("data-slide","prev")
					.addClass("next")
					.addClass("right  carousel-control")
					.append("<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>")
					.append("<span class='sr-only'>Next</span>");
				return elementA;
			})

		$(array_childs).appendTo( $(elementHTML).find("[parent-id=pnl_"+m_currentItem.ID+"]"));
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Tabs
//	=========================================================================
function norTabPage(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_tabIndex = -1;
	Configuration.ItemType = ItemType.TABPAGE;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'TabIndex' :{
			get: function() { return m_tabIndex; 							},
			set : function( pAttributeValue ) {
				m_tabIndex = pAttributeValue;
			}
		}
	});
	var __Init = function(){
		m_currentItem.OnInstance = function( sender, args ){
			m_currentItem.Size.Width 	= "100%";
			m_currentItem.Size.Height = "100%";
		};
		$( m_currentItem.ElementDOM )
			.attr("role","tabpanel")
			.addClass("tab-panel")
			.css({
				"padding"	: "20px 0px 0px 0px" ,
				"width"		: "100%",
				"height"	: "100%"
			})
			.resizable( "destroy" );
		$(m_currentItem.ElementDOM).css({ });
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") );
		$(elementHTML)
			.addClass("tab-pane")
			.attr("id", m_currentItem.ID )
			.attr("role","tabpanel")
			.attr("html-type","TABPAGE");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norTabPageController(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ;
	Configuration.ItemType = ItemType.TABPAGECONTROLLER;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		m_currentItem.OnInstance = function( sender, args ){
			m_currentItem.Size.Width  = "100%";
			m_currentItem.Size.Height = m_currentItem.Parent.Size.Height - 50;
		};
		m_currentItem.OnReSize = function( sender, args  ){
			for( var i = 0 ; i < m_currentItem.Items.length ; i++){
				m_currentItem.Items[ i ].Size.Height = "100%";
			}
		};
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM )
			.addClass("tab-content")
			.css({
				"padding"	:	"0px 0px 0px 0px" ,
				"width"		: "100%"
			})
			.resizable( "destroy" )
			.droppable( "destroy" )
			.find(".editor-Controller")
				.remove();

		m_currentItem.OnClick = [];
		m_currentItem.EnabledSortable = false;
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") );
		$(elementHTML)
			.addClass("tab-content")
			.attr("html-type","TABPAGECONTROLLER");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norTabController(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {};
	Configuration.ItemType = ItemType.TABCONTROLLER;
	Configuration.Container = document.createElement("ul");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var _Update = function(){
		for( var i = 0 ; i < m_currentItem.Items.length ; i++){
			m_currentItem.Items[ i ].Size.Height = "100%";
			m_currentItem.Items[ i ].Size.Width = $(m_currentItem.ElementDOM).width() / m_currentItem.Items.length ;
		}
	};
	var __Init = function(){
		m_currentItem.OnInstance = function( sender, args ){
			m_currentItem.Size.Width  = "100%";
			m_currentItem.Size.Height = 30;
		};
		m_currentItem.OnReSize = function( sender, args  ){
			_Update();
		};
		m_currentItem.OnAddItem = function( sender, args  ){
			_Update();
		};
		m_currentItem.OnRemoveItem = function( sender, args  ){
			_Update();
		};
		$( m_currentItem.ElementDOM )
			.resizable( "destroy" );

		$( m_currentItem.ElementDOM )
			.resizable({
				handles : "s",
				containment : "parent",
				stop: function( event , ui){
					m_currentItem.Size.Height = ui.size.height ;
				}
			})
			.addClass("nav nav-tabs")
			.attr("role","tablist")
			.css({
				"padding"	:	"0px 0px 0px 0px" ,
				"width"		: "100%"
			})
			.droppable( "destroy" )
			.find(".editor-Controller")
				.remove();

		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		m_currentItem.OnClick = [];

	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("ul") );
		$(elementHTML)
			.addClass("nav")
			.addClass("nav-tabs")
			.attr("role","tablist")
			.attr("html-type","TABCONTROLLER");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norTab(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {},
		m_tabIndex = -1;
	Configuration.ItemType = ItemType.TAB;
	Configuration.Container = document.createElement("li");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'TabIndex' :{
			get: function() { return m_tabIndex; 							},
			set : function( pAttributeValue ) {
				m_tabIndex = pAttributeValue;
			}
		}
	});

	var __Init = function(){
		m_currentItem.OnInstance = function( sender, args ){
			m_currentItem.Size.Width  = "100%";
			m_currentItem.Size.Height = "100%";
		};
		$( m_currentItem.ElementDOM )
			.attr("role","presentation")
			.resizable( "destroy" )
			.css({
				"padding":"20px 0px 0px 0px",
				"list-style": "none"});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("li") );
		$(elementHTML)
			.attr("role","presentation")
			.attr("html-type","TAB");
		return elementHTML.outerHTML;
	};
	__Init();
};
function norTabs(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_pageController 		= {} 	 ,
		m_selectedIndex			= -1 	 ,
		m_tabController  		= {} 	 ;

	var e_OnSelectChanged = [];
	Configuration.ItemType = ItemType.TABS;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'PageController' :{
			get: function() { return m_pageController; 							},
			set : function( pAttributeValue ) {
				m_pageController = pAttributeValue;
			}
		},
		'SelectedIndex' : {
			get: function() { return m_selectedIndex; 							},
			set : function( pAttributeValue ) {
				m_selectedIndex = pAttributeValue;
				for( var i = 0 ; i < m_pageController.Items.length ; i++){
					if( m_selectedIndex == i ){
						m_pageController.Items[ i ].Show();
						m_tabController.Items[ i ].Active = true;
					}
					else{
						m_pageController.Items[ i ].Hide();
						m_tabController.Items[ i ].Active = false;
					}
				}
				for( var i = 0 ; i < e_OnSelectChanged.length ; i++){
					e_OnSelectChanged[ i ]( m_currentItem , {
						"Tab" : m_tabController.Items[ m_selectedIndex ] ,
						"Page" : m_pageController.Items[ m_selectedIndex ] });
				}
			}
		},
		'SelectedItem' : {
			get: function() {
				if( m_selectedIndex == -1)
					return null;
				return  { Tab : m_tabController.Items[ m_selectedIndex ] , Page : m_pageController.Items[ m_selectedIndex ] };
			}
		},
		'Tabs': {
			get: function() { return m_tabController.Items.length; 							},
			set : function( pAttributeValue ) {
				while( m_tabController.Items.length < pAttributeValue ){
						m_currentItem.AddTab();
				}
				while( m_tabController.Items.length > pAttributeValue ){
						m_currentItem.RemoveTab();
				}
			}
		},
		'TabController' : {
			get: function() { return m_tabController; 							},
			set : function( pAttributeValue ) {
				m_tabController = pAttributeValue;
			}
		}
	});
	this.RemoveTab = function(){
		if( m_tabController.Items.length > 0){
			m_tabController.Items[ m_tabController.Items.length -1 ].Dispose();
			m_pageController.Items[ m_tabController.Items.length -1 ].Dispose();
		}
	};
	this.Update = function(){
		for( var i = 0; i < m_tabController.Items.length ; i++ ){
			m_tabController.Items[ i ].TabIndex = i;
			m_pageController.Items[ i ].TabIndex = i;
		}
		if( m_currentItem.SelectedIndex  < m_tabController.Items.length ){
			m_currentItem.SelectedIndex = m_currentItem.SelectedIndex;
		}
		else if( m_tabController.Items.length > 0){
			m_currentItem.SelectedIndex = m_tabController.Items.length - 1;
		}
		else{
			m_currentItem.SelectedIndex = -1;
		}
	};
	this.RemoveTabAtIndex = function( pIndexDelete ){
		// Eliminno una Pagina
		for( var i = 0; i < m_tabController.Items.length ; i++ ){
			if( m_tabController.Items[ i ].TabIndex == pIndexDelete ){
				m_tabController.Items[ i ].Dispose();
				m_currentItem.Update();
			}
		}
		// Eliminno un Tab
		for( var i = 0; i < m_pageController.Items.length ; i++ ){
			if( m_pageController.Items[ i ].TabIndex == pIndexDelete ){
				m_pageController.Items[ i ].Dispose();
				m_currentItem.Update();
			}
		}
	};
	this.AddTab = function( ){
		var itemTabHTML = BuilderItemHTML( ItemType.TAB 			, { Label :"li" });
		var itemPageHTML = BuilderItemHTML( ItemType.TABPAGE , { Label :"div" });
		m_tabController.AddItem( itemTabHTML );
		m_pageController.AddItem( itemPageHTML );

		itemPageHTML.ClassOwer = m_currentItem.ClassOwer;
		itemPageHTML.TabIndex = m_tabController.Items.length - 1;
		itemPageHTML.OnDispose = function( sender ){
			m_currentItem.RemoveTabAtIndex( sender.TabIndex );
		};
		itemTabHTML.TabIndex = m_tabController.Items.length - 1;
		itemTabHTML.OnDispose = function( sender ){
			m_currentItem.RemoveTabAtIndex( sender.TabIndex );
		};
		itemTabHTML.OnClick = function( sender, args ){
			m_currentItem.SelectedIndex = sender.TabIndex;
		};
		if( itemTabHTML.TabIndex > 0){
			itemPageHTML.Hide();
		}
		itemTabHTML.ClassOwer = m_currentItem.ClassOwer;
	};
	var __Init = function(){
		m_currentItem.OnReSize = function( sender, args ){
			if( m_currentItem.TabController.Size ){
				m_currentItem.TabController.Size.Width = "100%";
				m_currentItem.PageController.Size.Width = m_currentItem.Size.Width;
				m_currentItem.PageController.Size.Height = m_currentItem.Size.Height - m_currentItem.TabController.Size.Height - 20;
			}
		};
		m_currentItem.OnAddItem = function( pItemHTML ){
			if( pItemHTML.ItemType == ItemType.TABCONTROLLER ){
				m_tabController = pItemHTML;
				$( m_tabController.referenceDOM )
					.css({
						"margin":"0px",
						"padding":"0px"});

				m_tabController.ClassOwer 	= m_currentItem.ClassOwer;
				m_tabController.OnReSize 		= function(){
					m_currentItem.PageController.Size.Height = m_currentItem.Size.Height - m_currentItem.TabController.Size.Height - 20;
				};
				m_tabController.AccessName = "Tab";
				while( m_tabController.OnClick.length > 0){
					m_tabController.OnClick.pop();
				}
				for( i = 0; i < m_tabController.Items.length ; i++){
					m_tabController.Items[i].TabIndex = i;
					m_tabController.Items[i].OnDispose = function( sender ){
						m_currentItem.RemoveTabAtIndex( sender.TabIndex );
					};
					m_tabController.Items[i].OnClick = function( sender, args ){
						m_currentItem.SelectedIndex = sender.TabIndex;
					};
					m_tabController.Items[i].ClassOwer = m_currentItem.ClassOwer;
				}
			}
			else if( pItemHTML.ItemType == ItemType.TABPAGECONTROLLER ){
				m_pageController = pItemHTML;

				$( m_pageController.referenceDOM )
					.addClass("tab-content");

				m_pageController.ClassOwer 	= m_currentItem.ClassOwer;
				m_pageController.AccessName = "Pages";
				while( m_pageController.OnClick.length > 0){
					m_pageController.OnClick.pop();
				}

				for( i = 0; i < m_pageController.Items.length ; i++){
					m_pageController.Items[i].ClassOwer = m_currentItem.ClassOwer;
					m_pageController.Items[i].TabIndex = i;
					m_pageController.Items[i].OnDispose = function( sender ){
						m_currentItem.RemoveTabAtIndex( sender.TabIndex );
					};
					if( m_pageController.Items[i].TabIndex > 0){
						m_pageController.Items[i].Hide();
					}
				}
			}
		};
		m_currentItem.OnInstance = function( sender, args ){
			if( !Configuration.ConfigHTML ){
				m_tabController = BuilderItemHTML( ItemType.TABCONTROLLER , { Label : "ul" });
				m_pageController = BuilderItemHTML( ItemType.TABPAGECONTROLLER , { Label : "div"  });

				$( m_tabController.referenceDOM )
					.css({
						"margin":"0px",
						"padding":"0px"});

				$( m_pageController.referenceDOM )
					.addClass("tab-content");
				m_currentItem.AddItem( m_tabController );
				m_currentItem.AddItem( m_pageController );

				m_tabController.ClassOwer 	= m_currentItem.ClassOwer;
				m_tabController.OnReSize 		= function(){
					m_currentItem.PageController.Size.Height = m_currentItem.Size.Height - m_currentItem.TabController.Size.Height - 20;
				};
				m_pageController.ClassOwer 	= m_currentItem.ClassOwer;

				m_tabController.AccessName = "Tab";
				while( m_tabController.OnClick.length > 0){
					m_tabController.OnClick.pop();
				}
				m_pageController.AccessName = "Pages";
				while( m_pageController.OnClick.length > 0){
					m_pageController.OnClick.pop();
				}
			}

		};
		$( m_currentItem.referenceDOM ).sortable( "option", "connectWith", false);
		$( m_currentItem.ElementDOM );
		m_currentItem.EnabledSortable = false;
		$( m_currentItem.ElementDOM )
			.css({"padding":"20px 0px 0px 0px"})
			.droppable( "destroy" )
			.find("[command-group="+m_currentItem.ID+"]")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller addItem-propertiesController 	'><i class='glyphicon glyphicon-plus' /></i></div>")
				.append("<div style='padding: 4px 5px;' data-element='"+m_currentItem.ID+"' class='btn btn-default btn-xs editor-Controller removeItem-propertiesController'><i class='glyphicon glyphicon-minus' /></i></div>");

		m_currentItem.Size.Width  = 350;
		m_currentItem.Size.Height = 200;

		$( m_currentItem.ElementDOM ).find(".addItem-propertiesController").click(function(){
			m_currentItem.AddTab();
		});
		$( m_currentItem.ElementDOM ).find(".removeItem-propertiesController").click(function(){
			m_currentItem.RemoveTab();
		});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div") , true );
		$(elementHTML)
			.attr("html-type","TABS");
		return elementHTML.outerHTML;
	};
	__Init();
};
//	=========================================================================
// 		Control de Template
//	=========================================================================
function norTemple(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem 	= this,
		Configuration 	= arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_columns		= 1    	,
		m_content 		= ""  	,
		m_fields  		= [] 	,
		m_filters 		= "" 	,
		m_pager  		= false	,
		m_rowsview		= -1 	,
		m_source 		= "" 	;
	Configuration.ItemType = ItemType.TEMPLATE;
	Configuration.Container = document.createElement("div");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	Object.defineProperties( m_currentItem , {
		'Columns' :{
			get: function() { return m_columns; 							},
			set : function( pAttributeValue ) {
				m_columns = pAttributeValue;
			}
		},
		'Filters' :{
			get: function() { return m_filters; 							},
			set : function( pAttributeValue ) {
				m_filters = pAttributeValue;
			}
		},
		'Fields' :{
			get: function() { return m_fields; 							}
		},
		'RowView' :{
			get: function() { return m_rowsview; 							},
			set : function( pAttributeValue ) {
				m_rowsview = pAttributeValue ;
			}
		},
		'Source' :{
			get: function() { return m_source; 							},
			set : function( pAttributeValue ) {
				m_source = pAttributeValue.Text ;
				m_fields = pAttributeValue.Data ;
				m_currentItem.ClearDataSource();
			}
		},
		'Pager' :{
			get: function() { return m_pager; 							},
			set : function( pAttributeValue ) {
				m_pager = pAttributeValue ;
			}
		}
	});
	var __Init = function(){
		m_currentItem.OnInstance = function(){
			if( !Configuration.ConfigHTML ){
				m_currentItem.Size.Width  = 350;
				m_currentItem.Size.Height = 400;
			}
		};
		m_currentItem.OnReSize = function(){
			$(m_currentItem.referenceDOM ).css("height", $(m_currentItem.ElementDOM).height() + 20);
		};
		$( m_currentItem.ElementDOM ).css({"padding":"20px 0px 20px 0px"});
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("div")  , true );
		$(elementHTML)
			.attr("html-type","TEMPLE");
		return elementHTML.outerHTML;
	};
	__Init();

};
//	=========================================================================
// 		Control de Template
//	=========================================================================
function norSubmit(){
	//	=========================================================================
	// 		Properties
	//	=========================================================================
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}? arguments[0] : {} ,
		m_src;
	Configuration.ItemType = ItemType.SUBMIT;
	Configuration.Container = document.createElement("input");
	BaseItemHTML.apply( m_currentItem, [Configuration] );
	var __Init = function(){
		$(Configuration.Container).attr("type","submit");
		m_currentItem.Size.Width = 175;
		m_currentItem.Size.Height = 40;
	};
	this.ToHTML = function(){
		var elementHTML = m_currentItem.GetBaseHTML( document.createElement("form") );
		$(elementHTML)
			.attr("html-type","SUBMIT");
		return elementHTML.outerHTML;
	};
	__Init();

};
//==============================================================================
//==============================================================================
//
//
//==============================================================================
//==============================================================================
function jsNorToolBoxPanelHTML(){
    var m_currentItem = this,
    Configuration  = arguments[0] ? arguments[0] : {}, //Configuracion
    m_elementDOM   = null ,
    m_elementTBODY = {} 	,
    m_id           = "" 	,
    m_backColor    = "" 	,
    m_buttons      = [] 	,
		m_index 			 = -1 	,
		m_panel 		   = [] 	,
    m_position     = "" 	,
		m_size				 = null ,
		m_visible			 = true	;

    Object.defineProperties( m_currentItem , {
      'ElementDOM' 			: { get: function() { return m_elementDOM; } },
      'ID'				 			: { get: function() { return m_id; 				} },
      'BackColor'  			: {
          get: function(){ return m_backColor ;},
          set : function( value ){
            m_backColor =  value;
            $(m_elementDOM).css("background-color", m_backColor );
          }
      },
      'Buttons' 				: {
				get: function() { return m_buttons; 	},
				set : function( pAttributeValue ){
					m_buttons = pAttributeValue;
				}
			},
      'ControllerPanel' : {
				get: function() { return m_panel; 	},
				set : function( pAttributeValue ){
					m_panel = pAttributeValue;
				}
			},
      'Position'     		: {
          get: function(){ return m_position ;},
          set : function( pAttributeValue ){
            m_position =  pAttributeValue;
            pCssStyle = {};
            pCssStyle[m_position.toLowerCase()] = "0px";
            if( m_position == "RIGHT" || m_position == "LEFT"){
              pCssStyle["width"] = m_size.Width ;
            }
            else if( m_position == "TOP" || m_position == "BOTTOM"  ){
              pCssStyle["width"] = "100%";
            }
            $(m_elementDOM).css(pCssStyle);
          }
        },
			'Size'  					: {
				get : function() { return m_size; } ,
				set : function( pAttributeValue ){
					if( pAttributeValue instanceof jsNorCssSize ){
						pAttributeValue["Element"] = m_elementDOM;
						m_size = pAttributeValue;
					}
					else{
						pAttributeValue["Element"] = m_elementDOM;
						m_size = new jsNorCssSize( pAttributeValue );
					}
				}
      },
      'Visible'  				: {
          get: function(){ return m_visible ;},
          set : function( value ){
            m_visible =  value;
            if( m_visible ){
							$( m_elementDOM ).animate({ left: 0 }, 500 );
						}
						else{
							$( m_elementDOM ).animate({ left: -177 }, 500 );
						}
          }
      },
    });
		var _Building = function(){
			var elementGROUP = document.createElement("div");
			$( m_elementDOM )
				.empty()
				.append(function(){
					var elementShow = document.createElement("button");
					$(elementShow)
						.append("<i class='uk-icon glyphicon glyphicon-cog'></i>")
						.addClass("glyphicon glyphicon-angle-double-left")
						.css({
							"position":"absolute",
							"right":"-32px"
						})
						.click(function(){
							m_currentItem.Visible = !m_currentItem.Visible;
							if( m_currentItem.Visible ){
								$(this)
									.removeClass("glyphicon glyphicon-angle-double-right")
									.addClass("glyphicon glyphicon-angle-double-left");
							}
							else{
									$(this)
										.removeClass("glyphicon glyphicon-angle-double-left")
										.addClass("glyphicon glyphicon-angle-double-right");
							}
						});
					return elementShow;
				})
				.append( elementGROUP );

			$(elementGROUP)
				.css({
					"overflow-y" : "auto",
					"height"		 : ( Configuration.Height - 50 ) + "px"
				});
			for( item in ItemType ){
				$(elementGROUP)
					.append(function(){
						var elementButton = document.createElement("div");
						m_buttons.push( elementButton );
						$(elementButton)
							.attr("data-role"		 ,"toolBoxItem")
							.attr("data-item", item )
							.attr("data-itemType", ItemType[ item ] )
							.css({"padding":"3px"})
							.addClass("ui-button")
							.addClass("ui-widget")
							.addClass("ui-state-default");
						if( ItemType[ item ] == ItemType.UNKNOW ){
							return false;
						}
						else if( ItemType[ item ] == ItemType.NEW ){
							$(elementButton)
								.attr("title","Crear Nueva Plantilla")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<span class='glyphicon glyphicon-file'></span>")
								.append(" Nuevo")
								.click(function(){
									window.location.href = window.location.pathname ;
								});
						}
						else if( ItemType[ item ] == ItemType.OPEN ){
							$(elementButton)
								.attr("title","Abrir Plantilla")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<span class='glyphicon glyphicon-folder-open'></span>")
								.append(" Abrir")
								.click(function(){
										m_currentItem.ControllerPanel[ m_index ].ShowDialogOpen();
								});
						}
						else if( ItemType[ item ] == ItemType.SAVE ){
							$(elementButton)
								.attr("title","Guardar Plantilla")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-floppy-disk'></i>")
								.append(" Guardar")
								.click(function(){
									if( m_currentItem.ControllerPanel[ m_index ].Title.length == 0 ){
										m_currentItem.ControllerPanel[ m_index ].ShowDialogNew( m_index );
									}
									else{
										m_currentItem.ControllerPanel[ m_index ].ShowDialogSave( m_index );
										var codeHTML = m_currentItem.ControllerPanel[ m_index ].SaveToHTML();
										if( m_index == 0 ){
											var codeHTML_English = m_currentItem.ControllerPanel[ 1 ].SaveToHTML();
											if( codeHTML_English.Empty ){
												m_currentItem.ControllerPanel[ 1 ].SetCodeHTML( codeHTML.CODE );
											}
										}
									}
								});
						}
						else if( ItemType[ item ] == ItemType.DELETE ){
							$(elementButton)
								.attr("title","Borrar Plantilla")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-trash'></i>")
								.append(" Eliminar")
								.click(function(){
									m_currentItem.ControllerPanel[ m_index ].ShowDialogDelete();
								});
						}
						else if( ItemType[ item ] == ItemType.UPLOAD ){
							$(elementButton)
								.attr("title","Cargar Plantilla desde archivo")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cloud-upload'></i>")
								.append(" Cargar")
								.append("<form style='display:none;' ><input type='file' data-called='false'></form>")
								.click(function( ){
									var called = $(this).find("input[type=file]").attr("data-called");
									if( called != "true"){
										$(this).find("input[type=file]").attr("data-called", "true").trigger('click');
									}
									else{
										$(this).find("input[type=file]").attr("data-called", "false");
									}
								});
								$(elementButton).find("input[type=file]").get(0)
									.addEventListener('change'    ,
										function( event ){
											var sender = this;
											$(sender).attr("data-called", "false");
											if( $(sender).val()!=''){
												readSingleFile( event , function( fileSource ){
													var start_position = fileSource.indexOf("<div class='content-area container'>");
													var end_position = fileSource.indexOf("<!-- Footer Area Starts -->");
													if( end_position < 0 ){
														end_position = fileSource.length;
													}
													$(sender).parent().trigger('reset');
													m_currentItem.ControllerPanel[ m_index ].SetCodeHTML( fileSource.substring(start_position , end_position ) );
												});
											}
										}, false);
						}
						else if( ItemType[ item ] == ItemType.ZOOMIN ){
							$(elementButton)
								.attr("title","Aumentar")
								.css({"width": m_size.Width/2 - 2 })
								.append("<i class='glyphicon glyphicon-zoom-in'></i>")
								.click(function(){
									if( m_currentItem.ControllerPanel ){
										m_currentItem.ControllerPanel[ m_index ].Zoom+=0.1;
									}
								});
						}
						else if( ItemType[ item ] == ItemType.ZOOMOUT ){
							$(elementButton)
								.attr("title","Reducir")
								.css({"width": m_size.Width/2 - 2 })
								.append("<i class='glyphicon glyphicon-zoom-out'></i>")
								.click(function(){
									if( m_currentItem.ControllerPanel ){
										m_currentItem.ControllerPanel[ m_index ].Zoom-=0.1;
									}
								});
						}
						else if( ItemType[ item ] == ItemType.IMAGE ){
							$(elementButton)
								.attr("title","Imagen")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-picture'></i>")
								.append(" Image");
						}
						else if( ItemType[ item ] == ItemType.GRID ){
							$(elementButton)
								.attr("title","Tabla")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-th'></i>")
								.append(" Grid");
						}
						else if( ItemType[ item ] == ItemType.LISTVIEW ){
							$(elementButton)
								.attr("title","Lista")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-list-alt'></i>")
								.append(" ListView");
						}
						else if( ItemType[ item ] == ItemType.LINE ){
							$(elementButton)
								.attr("title","Linea")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-minus'></i>")
								.append(" Line");
						}
						else if( ItemType[ item ] == ItemType.LABEL ){
							$(elementButton)
								.attr("title","Etiqueta")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-text-color'></i>")
								.append(" Label");
						}
						else if( ItemType[ item ] == ItemType.PANEL ){
							$(elementButton)
								.attr("title","Contenerdor")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-unchecked'></i>")
								.append(" Panel");
						}
						else if( ItemType[ item ] == ItemType.VIDEO ){
							$(elementButton)
								.attr("title","Video")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-film'></i>")
								.append(" Video");
						}
						else if( ItemType[ item ] == ItemType.AUDIO ){
							$(elementButton)
								.attr("title","Audio")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-music'></i>")
								.append(" Audio");
						}
						else if( ItemType[ item ] == ItemType.UPLOADFILE ){
							$(elementButton)
								.attr("title","Upload File")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-upload'></i>")
								.append(" Upload File");
						}
						else if( ItemType[ item ] == ItemType.COMBOBOX ){
							$(elementButton)
								.attr("title","ComboBox")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" ComboBox");
						}
						else if( ItemType[ item ] == ItemType.TEXTBOX ){
							$(elementButton)
								.attr("title","TextBox")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" TextBox");
						}
						else if( ItemType[ item ] == ItemType.BUTTON ){
							$(elementButton)
								.attr("title","Button")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Button");
						}
						else if( ItemType[ item ] == ItemType.CHECKBOX ){
							$(elementButton)
								.attr("title","CheckBox")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" CheckBox");
						}
						else if( ItemType[ item ] == ItemType.RADIOBUTTON ){
							$(elementButton)
								.attr("title","RadioButton")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" RadioButton");
						}
						else if( ItemType[ item ] == ItemType.FORM ){
							$(elementButton)
								.attr("title","Formulario")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Form");
						}
						else if( ItemType[ item ] == ItemType.CALENDAR ){
							$(elementButton)
								.attr("title","Calendario")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Calendario");
						}
						else if( ItemType[ item ] == ItemType.PROGRESS ){
							$(elementButton)
								.attr("title","Process")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Progress");
						}
						else if( ItemType[ item ] == ItemType.DATEPICKER ){
							$(elementButton)
								.attr("title","DatePicker")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" DatePicker");
						}
						else if( ItemType[ item ] == ItemType.SLIDER ){
							$(elementButton)
								.attr("title","Slider")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Slider");
						}
						else if( ItemType[ item ] == ItemType.TABS ){
							$(elementButton)
								.attr("title","Tabs")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Tabs");
						}
						else if( ItemType[ item ] == ItemType.TEMPLATE ){
							$(elementButton)
								.attr("title","Template")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Template");
						}
						else if( ItemType[ item ] == ItemType.SUBMIT ){
							$(elementButton)
								.attr("title","Submit")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-cog'></i>")
								.append(" Submit");
						}
						else if( ItemType[ item ] == ItemType.CODE ){
							$(elementButton)
								.attr("title","Ver Codigo")
								.css({"width": m_size.Width/3 - 2 })
								.append("<span class='glyphicon glyphicon-console'></span>")
								.click(function(){
									m_currentItem.ControllerPanel[m_index].Manager.ShowPanel(0);
									var SourceHTML = m_currentItem.ControllerPanel[m_index].SaveToHTML() ;
									$(m_currentItem.ControllerPanel[m_index].Manager.PanelCode ).find("[data-role=htmlSource]").val( 	SourceHTML.CODE );
								});
						}
						else if( ItemType[ item ] == ItemType.VIEW ){
							$(elementButton)
								.attr("title","Vista Previa")
								.css({"width": m_size.Width/3 - 2 })
								.append("<span class='glyphicon glyphicon-eye-open'></span>");
						}
						else if( ItemType[ item ] == ItemType.EDITOR ){
							$(elementButton)
								.attr("title","Editor grafico")
								.css({"width": m_size.Width/3 - 2 })
								.append("<i class='glyphicon glyphicon-blackboard'></i>")
								.click(function(){
									m_currentItem.ControllerPanel[m_index].Manager.ShowPanel( 1 + m_index );
								});
						}
						else if( ItemType[ item ] == ItemType.LANGUAGE ){
							$(elementButton)
								.attr("title","Cambiar Idioma")
								.css({"width": m_size.Width - 2 , "text-align":"left"})
								.append("<i class='glyphicon glyphicon-comment'></i>")
								.append("<span>Español</span>")
								.click(function(){
									if( m_currentItem.ControllerPanel ){
										$(m_currentItem.ControllerPanel[m_index].ElementDOM).hide();
										m_index++;
										if( m_index >= m_currentItem.ControllerPanel.length ){
											m_index = 0;
											$(this).find("span").html(" Español ");
										}
										else{
											$(this).find("span").html(" Ingles ");
										}
										$(m_currentItem.ControllerPanel[m_index].ElementDOM).show();
									}
								});
						}
						else {
							$(elementButton).css("display","none");
							return elementButton;
						}
						if( ItemType[ item ] >= 0x000110 && ItemType[ item ] < 0x100020){
							$(elementButton)
								.attr("data-Ower", m_currentItem.ControllerPanel[m_index].ClassOwer )
								.draggable({
									appendTo: "body",
									zIndex: 100,
									helper: "clone"
								});
						}
						$( elementButton ).find("i")
							.tooltip({
								position: { my: "bottom", at: "bottom+5" },
								content: function() {
			        		return $( this ).parent().attr("title");
								}
							});
						return elementButton;
					});
			}
		};
    var __Init = function( ){
      m_elementDOM = Configuration.Container ? $(Configuration.Container).get(0) : document.createElement("div");
      m_id 				 = __GetKey( 5 , "pnlToolBoxHTML");
			m_index 		 = 0;
      m_backColor  = "#F3F3F4";
			m_position 	 = "LEFT";
      m_panel  		 = [] ;
			for( propertyKey in Configuration ){
				if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
					m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
				}
			}
      $(m_elementDOM)
        .attr("data-role","ToolBoxHTML")
				.addClass("EditorPanel-Controller");
			_Building();
    };
    __Init();
};
function jsNorPropertiesPanelHTML(){
  var m_currentItem = this,
    Configuration = arguments[0] ? arguments[0] : {}, //Configuracion
    m_elementDOM  = {},
    m_elementTBODY= {},
    m_id          = "",
    m_backColor   = "",
    m_fields      = [],
		m_itemInspect = {},
    m_position    = {},
		m_visible			= true,
    m_size        = {};

  Object.defineProperties( m_currentItem , {
    'ElementDOM' : { get: function() { return m_elementDOM; 	}},
    'ID'				 : { get: function() { return m_id; 					}},
    'BackColor'  : {
        get: function(){ return m_backColor ;},
        set : function( value ){
          m_backColor =  value;
          $(m_elementDOM).css("background-color", m_backColor );
        }
    },
    'Fields'     :{ get: function(){ return m_fields ;			} },
    'ItemInspect':{ get: function(){ return m_itemInspect ;	} },
    'Position'     : {
        get: function(){ return m_position ;},
        set : function( value ){
          m_position =  value;
          if(      m_position == "RIGHT" ){ $(m_elementDOM).css("right","0px");}
          else if( m_position == "LEFT"  ){ $(m_elementDOM).css("left","0px"); }
        }
    },
    'Visible'     : {
        get: function(){ return m_visible ;},
        set : function( value ){
          m_visible =  value;
					if( m_visible ){
						m_currentItem.Show();
					}
					else{
						m_currentItem.Hide();
					}
        }
    },
    'Size'     : {
        get: function(){ return m_size ;},
        set : function( pAttributeValue ){
					if( pAttributeValue instanceof jsNorCssSize ){
						pAttributeValue["Element"] = m_elementDOM;
						m_size = pAttributeValue;
					}
					else{
						pAttributeValue["Element"] = m_elementDOM;
						m_size = new jsNorCssSize( pAttributeValue );
					}
        }
    }
  });
	var __CreateInputProperty = function( propertyName , propertyType , propertyValue , propertyCallBack ){
			var elementTH = document.createElement("th");
			var elementTD = document.createElement("td");
			$(elementTH)
				.attr("data-th" , propertyName)
				.css({
					"vertical-align": "top" ,
					"padding"				: "0px" ,
					"margin"				: "0px" ,
					"font-size"			: "11px"
				})
				.html( propertyName );


			if ( propertyType == "AUTOCOMPLETE" ){
				$(elementTD).append(function(){
					var elementINPUT = document.createElement("input");
					$(elementINPUT)
						.attr("id","input_" + propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.attr("type","text")
						.attr("data-value"	, JSON.stringify( propertyValue.Value ) )
						.attr("data-text"	, JSON.stringify( propertyValue.Text  ) )
						.val( propertyValue.Text )
						.change( function(){
					      	$(this).attr("data-value", $(this).val() );
							propertyCallBack( { "Text" : $(this).val() , "Data" : $(this).val() } , event );
						})
						.autocomplete({
				      source: function( request, response ) {
						propertyValue.Parameters["Palabra"] = request.term.encodeURI() ;
				        $.ajax({
				          url 			: propertyValue.URL 									,
				          type 			: propertyValue.Method 									,
				          contentType	: "application/x-www-form-urlencoded; charset=UTF-8"	,
				          data 			: propertyValue.Parameters 								,
				          success 		: function( data ) {
				            response( JSON.parse( data ) );
				          }
				        });
				      },
				      position: { my : "left top", at: "left bottom" },
				      minLength: 3,
				      select: function( event, ui ) {
				      	$(this).val( ui.item.Text );
				      	$(this).attr("data-value", ui.item.Data );
						propertyCallBack( ui.item , event );
				        return false;
				      }
				    })
				    .autocomplete( "instance" )._renderItem = function( ul, item ) {
				      return $( "<li>" )
				        .append( "<a>" + item.Text + "</a>" )
				        .appendTo( ul );
				    };
					return elementINPUT;
				});
			}
			else if( propertyType == "CHECKBOX" ){
				$(elementTD).append(function(){
					var elementINPUT = document.createElement("input");
					$(elementINPUT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.attr("type","checkbox")
						.change(function( event ){
							propertyCallBack( $(this).get(0).checked  , event );
						})
						.get(0).checked = propertyValue ;
					return elementINPUT;
				});
			}
			else if( propertyType == "COLOR"){
				$(elementTD).append(function(){
					var elementPICKER = document.createElement("input");
					$(elementPICKER)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.colpick({
							submit:0,
							onShow : function( sender , args ){
								$(sender).css("z-index","2000");
							},
							onChange:function(hsb,hex,rgb,el , bySetColor ) {
								$(elementPICKER).css('background-color','#'+hex);
								$(elementPICKER).css('color','#'+hex);
								propertyCallBack( "#"+hex , event );
							}
						});
						if( propertyValue != null && propertyValue != ""){
							$(elementPICKER).colpickSetColor( propertyValue.ToHex() );
						}
					return elementPICKER;
				});
			}
			else if( propertyType == "IMAGE" ){
				$(elementTD).append(function(){
					var elementIMAGE = document.createElement("div");
					$(elementIMAGE)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.append(function(){
							var buttonDelete = document.createElement("button");
							$(buttonDelete)
								.addClass("btn btn-danger btn-xs")
								.append("<i class='glyphicon glyphicon-remove'></i>")
								.click(function(){
									propertyCallBack( null , event );
										$(elementIMAGE)
											.css("background-image","");
								});
							return buttonDelete;
						})
						.addClass("imageContainer")
						.css({
							"width":"90%",
							"height":"50px",
							"border":"3px dashed lightgray",
							"border-radius":"5px",
							"background-image":"url("+ ( propertyValue.indexOf("../") == -1 ?  "../../lib/images/" + propertyValue +"?"+ new Date().getTime(): propertyValue +"?"+ new Date().getTime() )+")"
						});
						elementIMAGE.addEventListener('dragover', handleDragOver , false);
				    elementIMAGE.addEventListener('drop'    ,
				        function( event ){
				          handleFileSelect( event , function(  container , fileName , fileSource , fileType ){
										$(elementIMAGE)
											.css("background-image","url("+fileSource+")");
										propertyCallBack( fileSource , event );
				      });
				    }, false);
					return elementIMAGE;
				});
			}
			else if( propertyType == "NUMBER" ){
				$(elementTD).append(function(){
					var elementINPUT = document.createElement("input");
					$(elementINPUT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.attr("type","number")
						.val( propertyValue )
						.change(function( event ){
							propertyCallBack( parseInt( $(this).val() ) , event );
						});
					return elementINPUT;
				});
			}
			else if( propertyType == "SELECT" ){
				$(elementTD).append(function(){
					var elementSELECT = document.createElement("select");
					$(elementSELECT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.change(function( event ){
							propertyCallBack( $(this).val() , event );
						});
					for( var index = 0 ; index < propertyValue.length ; index++){
						var pValue = propertyValue[ index ];
						if( pValue.Selected ){
							$(elementSELECT).append("<option value='"+pValue.Value+"' selected>"+pValue.Value+"</option>");
						}
						else{
							$(elementSELECT).append("<option value='"+pValue.Value+"' >"+pValue.Value+"</option>");
						}
					}
					return elementSELECT;
				});
			}
			else if( propertyType == "SELECTBUTTON" ){
				$(elementTD).append(function(){
					var elementSELECT = document.createElement("div");
					$(elementSELECT)
						.attr("id","input_"+propertyName)
						.addClass("btn-group")
						.attr("data-property", propertyName )
						.css({ "width":"90%"});

					for( var index = 0 ; index < propertyValue.length ; index++){
						var pValue = propertyValue[ index ];
						$(elementSELECT)
							.append(function(){
								var elementButtonSelect = document.createElement("button");
								$(elementButtonSelect)
									.attr("data-value" , pValue.Value )
									.addClass("btn btn-default btn-sm")
									.attr("data-propertyButton", propertyName )
									.addClass( pValue.Selected ? "active" :"" )
									.append( pValue.Text ? pValue.Text : pValue.Value )
									.click(function(){
										var flag = $(this).hasClass("active") ;
										var propertyButton = $(this).attr("data-propertyButton");
										$("[data-propertyButton="+propertyButton+"]").removeClass("active");
										if( flag ){
											propertyCallBack( null , event );
										}
										else{
											$(this).addClass("active");
											propertyCallBack( $(this).attr("data-value") , event )
										}
									});
								return elementButtonSelect;
						});
					}
					return elementSELECT;
				});
			}
			else if( propertyType == "SELECTCHECBOX" ){
				$(elementTD).append(function(){
					var elementSELECT = document.createElement("div");
					$(elementSELECT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"});

					for( var index = 0 ; index < propertyValue.length ; index++){
						var pValue = propertyValue[ index ];
						$(elementSELECT)
							.append(function(){
								var elementButtonSelect = document.createElement("input");
								$(elementButtonSelect)
									.attr("type","checkbox")
									.attr("data-value" , pValue.Value )
									.attr("data-propertyButton", propertyName )
									.click(function(){
										propertyCallBack( $(this).attr("data-value") , event );
									});
								if( pValue.Selected ){
									elementButtonSelect.checked = true;
								}
								return elementButtonSelect;
							})
							.append( pValue.Text ? pValue.Text : pValue.Value )
							.append("<br/>");
					}
					return elementSELECT;
				});
			}
			else if( propertyType == "SELECT_MIX_IMAGE" ){
				$(elementTD).append(function(){
					var elementIMAGE = document.createElement("div");
					$(elementIMAGE)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.append(function(){
							var buttonDelete = document.createElement("button");
							$(buttonDelete)
								.addClass("btn btn-danger btn-xs")
								.append("<i class='glyphicon glyphicon-remove'></i>")
								.click(function(){
									propertyCallBack( null , event );
										$(elementIMAGE)
											.css("background-image","");
								});
							return buttonDelete;
						})
						.addClass("imageContainer")
						.css({
							"width":"90%",
							"height":"30px",
							"border":"2px dashed lightgray",
							"border-radius":"5px",
							"background-image":"url("+ ( propertyValue.indexOf("../") == -1 ?  "../../lib/images/" + propertyValue +"?"+ new Date().getTime(): propertyValue +"?"+ new Date().getTime() )+")"
						});
						elementIMAGE.addEventListener('dragover', handleDragOver , false);
				    elementIMAGE.addEventListener('drop'    ,
				        function( event ){
				          handleFileSelect( event , function(  container , fileName , fileSource , fileType ){
										$(elementIMAGE)
											.css("background-image","url("+fileSource+")");
										propertyCallBack( { "IMAGE" : fileSource } , event );
				      });
				    }, false);
					return elementIMAGE;
				})
				.append(function(){
					var elementSELECT = document.createElement("select");
					$(elementSELECT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.change(function( event ){
							propertyCallBack( $(this).val() , event );
						});
					for( var index = 0 ; index < propertyValue.length ; index++){
						var pValue = propertyValue[ index ];
						if( pValue.Selected ){
							$(elementSELECT).append("<option value='"+pValue.Value+"' selected>"+pValue.Value+"</option>");
						}
						else{
							$(elementSELECT).append("<option value='"+pValue.Value+"' >"+pValue.Value+"</option>");
						}
					}
					return elementSELECT;
				});
			}
			else if( propertyType == "SLIDER"){
				$(elementTD)
				.append( propertyValue.Min )
				.append("<span style='float:right;'>"+propertyValue.Max+"</span>")
				.append(function(){
					var elementSLIDER = document.createElement("div");
					$(elementSLIDER)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.slider({
				      range: "min",
				      value: propertyValue.Value ,
				      min: propertyValue.Min,
				      max: propertyValue.Max,
							slide : function ( event , ui ){
								$(elementTH).html( propertyName + " (" + ui.value+")");
							},
				      stop: function( event, ui ) {
									propertyCallBack( ui.value , event );
				      }
				    });
					return elementSLIDER;
				});
			}
			else if( propertyType == "TABLE" ){
				elementTH = null;
				$(elementTD)
					.attr("colspan","2")
					.append(function(){
					var elementTABLE = document.createElement("table");
					$(elementTABLE)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({
							"width":"95%",
						})
						.append(function(){
							var elementTR = document.createElement("tr");
							for( i = 0 ; i < propertyValue.length ; i++){
								$(elementTR).append("<td>" + propertyValue[i].Label + "</td>");
							}
							$(elementTR).append(
								function(){
									var elementBUTTON = document.createElement("button");
									$(elementBUTTON)
										.addClass("btn")
										.attr("data-format", JSON.stringify( propertyValue ))
										.attr("data-reference","input_"+ propertyName )
										.addClass("btn-success")
										.append("<span class='glyphicon glyphicon-plus'></span>")
										.click(function(){
											var parentTABLE = $("#" + $(this).attr("data-reference") );
											var columnsFormat = JSON.parse( $(this).attr("data-format") );
											$(parentTABLE)
												.find("tbody")
												.append(function(){
													var elementTR_BODY = document.createElement("tr");
													$(elementTR_BODY)
														.attr("id",__GetKey( 4 , propertyName ) )
													for( j = 0 ; j < columnsFormat.length ; j++){
														$(elementTR_BODY).append(function(){
															var elementTD = document.createElement("td");
															$(elementTD)
																.append( function(){
																	var elementSELECT_BODY = document.createElement("select");
																	$(elementSELECT_BODY)
																		.attr("data-property", columnsFormat[j].Name );
																	for( c = 0 ; c < columnsFormat[j].Options.length ; c++){
																		$(elementSELECT_BODY).append("<option value='"+ columnsFormat[j].Options[ c ].Value +"' >"+ columnsFormat[j].Options[ c ].Text +"</option>");
																	}
																	$(elementSELECT_BODY).change(function(){
																		var parentTBODY  = $(this).parent().parent().parent();
																		var parentTR 	 = $(this).parent().parent();
																		var tr_array 	 = $(parentTBODY).find("tr");
																		var select_array = $(parentTR).find("select");
																		var ValueComplex = {};
																		for( k = 0 ; k < select_array.length ; k++ ){
																			ValueComplex[ $(select_array[k]).attr("data-property") ] = $(select_array[k]).val();
																		}
																		for( k = 0 ; k < tr_array.length ; k++ ){
																			if( tr_array[k].id == $( parentTR ).attr("id") ){
																				ValueComplex["Index"] = k -1;
																				break;
																			}
																		}
																		propertyCallBack( ValueComplex , event );
																	});

																	return 	elementSELECT_BODY;
																});
															return elementTD;
														});
													}
													$(elementTR_BODY).append(function(){
															var elementTD = document.createElement("td");
															$(elementTD)
																.addClass("btn")
																.addClass("btn-danger")
																.append("<span class='glyphicon glyphicon-trash'></span>")
																.click(function(){
																	var parentTBODY  = $(this).parent().parent().parent();
																	var parentTR 	 = $(this).parent().parent();
																	var tr_array 	 = $(parentTBODY).find("tr");
																	var select_array = $(parentTR).find("select");
																	var ValueComplex = {};
																	for( k = 0 ; k < select_array.length ; k++ ){
																		ValueComplex[ $(select_array[k]).attr("data-property") ] = null ;
																	}
																	for( k = 0 ; k < tr_array.length ; k++ ){
																		if( tr_array[k].id == $( parentTR ).attr("id") ){
																			ValueComplex["Index"] = k -1;
																			break;
																		}
																	}
																	propertyCallBack( ValueComplex , event );
																	$(parentTR).remove();
																});
															return elementTD;
														});
													return elementTR_BODY;
												});
										});
									return elementBUTTON;
								});
							return elementTR;
						});
					return elementTABLE;
				});

				if( propertyValue.length > 0 ){
					for( j = 0 ; j < propertyValue[0].Values.length ; j++ ){
						var parentTABLE = $(elementTD).find("table");
						var columnsFormat = propertyValue ;
						$(parentTABLE)
							.find("tbody")
							.append(function(){
								var elementTR_BODY = document.createElement("tr");
								$(elementTR_BODY)
									.attr("id",__GetKey( 4 , propertyName ) )
								for( j = 0 ; j < columnsFormat.length ; j++){
									$(elementTR_BODY).append(function(){
										var elementTD = document.createElement("td");
										$(elementTD)
											.append( function(){
												var elementSELECT_BODY = document.createElement("select");
												$(elementSELECT_BODY)
													.attr("data-property", columnsFormat[j].Name );
												for( c = 0 ; c < columnsFormat[j].Options.length ; c++){
													$(elementSELECT_BODY).append("<option value='"+ columnsFormat[j].Options[ c ].Value +"' >"+ columnsFormat[j].Options[ c ].Text +"</option>");
												}
												$(elementSELECT_BODY).change(function(){
													var parentTBODY  = $(this).parent().parent().parent();
													var parentTR 	 = $(this).parent().parent();
													var tr_array 	 = $(parentTBODY).find("tr");
													var select_array = $(parentTR).find("select");
													var ValueComplex = {};
													for( k = 0 ; k < select_array.length ; k++ ){
														ValueComplex[ $(select_array[k]).attr("data-property") ] = $(select_array[k]).val();
													}
													for( k = 0 ; k < tr_array.length ; k++ ){
														if( tr_array[k].id == $( parentTR ).attr("id") ){
															ValueComplex["Index"] = k -1;
															break;
														}
													}
													propertyCallBack( ValueComplex , event );
												});

												return 	elementSELECT_BODY;
											});
										return elementTD;
									});
								}
								$(elementTR_BODY).append(function(){
										var elementTD = document.createElement("td");
										$(elementTD)
											.addClass("btn")
											.addClass("btn-danger")
											.append("<span class='glyphicon glyphicon-trash'></span>")
											.click(function(){
												var parentTBODY  = $(this).parent().parent().parent();
												var parentTR 	 = $(this).parent().parent();
												var tr_array 	 = $(parentTBODY).find("tr");
												var select_array = $(parentTR).find("select");
												var ValueComplex = {};
												for( k = 0 ; k < select_array.length ; k++ ){
													ValueComplex[ $(select_array[k]).attr("data-property") ] = null ;
												}
												for( k = 0 ; k < tr_array.length ; k++ ){
													if( tr_array[k].id == $( parentTR ).attr("id") ){
														ValueComplex["Index"] = k -1;
														break;
													}
												}
												propertyCallBack( ValueComplex , event );
												$(parentTR).remove();
											});
										return elementTD;
									});
								return elementTR_BODY;
							});
					}
				}
				var array_Tr = $(elementTD).find("tbody").find("tr");
				if( propertyValue.length > 0 ){
					for( j = 0 ; j < array_Tr.length - 1; j++ ){
						$(array_Tr[j + 1]).find("[data-property="+propertyValue[0].Name+"]").val( propertyValue[0].Values[ j ] );
						$(array_Tr[j + 1]).find("[data-property="+propertyValue[1].Name+"]").val( propertyValue[1].Values[ j ] );
						$(array_Tr[j + 1]).find("[data-property="+propertyValue[2].Name+"]").val( propertyValue[2].Values[ j ] );
					}
				}
			}
			else if( propertyType == "TEXT" ){
				$(elementTD).append(function(){
					var elementINPUT = document.createElement("input");
					$(elementINPUT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%"})
						.attr("type","text")
						.val( propertyValue )
						.change(function( event ){
							propertyCallBack( $(this).val() , event );
						});
					return elementINPUT;
				});
			}
			else if( propertyType == "TEXTAREA" ){
				$(elementTD).append(function(){
					var elementINPUT = document.createElement("textarea");
					$(elementINPUT)
						.attr("id","input_"+propertyName)
						.attr("data-property", propertyName )
						.css({ "width":"90%" , "height":"75px"})
						.attr("type","text")
						.val( propertyValue )
						.change(function( event ){
							propertyCallBack( $(this).val() , event );
						});
					return elementINPUT;
				});
			}
			else if( propertyType == "UPLOAD" ){
				$(elementTD).append(function(){
					var elementIMAGE = document.createElement("input");
					$(elementIMAGE)
						.attr("id","input_"+propertyName)
						.attr("type","file" )
						.attr("data-property", propertyName )
						.css({
							"width":"90%"
						})
						.addClass("imageContainer");

						elementIMAGE.addEventListener('change',
			        function( event ){
			          readSingleFileDataUrl( event , function(  container , fileName , fileSource , fileType ){
									propertyCallBack( container , event );
			      		});
			    		},
						false);
						elementIMAGE.addEventListener('dragover', handleDragOver , false);
				    elementIMAGE.addEventListener('drop'    ,
				        function( event ){
				          readSingleFileDataUrl( event , function(  container , fileName , fileSource , fileType ){
										propertyCallBack( fileSource , event );
				      });
				    }, false);
					return elementIMAGE;
				});
			}
			return [elementTH , elementTD];
		};
	this.ReadProperties = function( itemHTML ){
		m_itemInspect = itemHTML;
		var array_Property = Object.getOwnPropertyNames( m_itemInspect ).sort();
		$(m_elementTBODY).empty();
		for (var indexProperty = 0; indexProperty < array_Property.length; indexProperty++) {
			var propertyName = array_Property[ indexProperty ];
			var elementTR = document.createElement("tr");
			$(elementTR).css({
				"border-top":"1px solid gray"
			});
			if( propertyName == "AccessName" ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"TEXT" , itemHTML.AccessName , function( value , event ){
					itemHTML.AccessName = value;
				}));
			}
			else if( propertyName == "Align" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var optionsValue = [
						{ Selected : false , Value: "left"  	, Text :"<i class='glyphicon glyphicon-align-left'></i>"},
						{ Selected : false , Value: "center" 	, Text :"<i class='glyphicon glyphicon-align-center'></i>"},
						{ Selected : false , Value: "right" 	, Text :"<i class='glyphicon glyphicon-align-right'></i>"}
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.Align ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECTBUTTON", optionsValue , function( value , event ){
					itemHTML.Align = value;
				}));
			}
			else if( propertyName == "Audio" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"UPLOAD" , itemHTML.Audio , function( value , event ){
					itemHTML.Audio = value;
				}));
			}
			else if( propertyName == "AutoPlay" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX" , itemHTML.AutoPlay , function( value , event ){
					itemHTML.AutoPlay = value;
				}));
			}
			else if( propertyName == "AutoSize" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX" , itemHTML.AutoSize , function( value , event ){
					itemHTML.AutoSize = value;
				}));
			}
			else if( propertyName == "AutoWidth" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX" , itemHTML.AutoWidth , function( value , event ){
					itemHTML.AutoWidth = value;
				}));
			}
			else if( propertyName == "AutoHeight" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX" , itemHTML.AutoHeight , function( value , event ){
					itemHTML.AutoHeight = value;
				}));
			}
			else if( propertyName == "BackColor" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"COLOR", itemHTML.BackColor , function( value , event ){
					itemHTML.BackColor = value;
				}));
			}
			else if( propertyName == "BackgroundImage" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"IMAGE", itemHTML.BackgroundImage , function( value , event ){
					itemHTML.BackgroundImage = value;
				}));
			}
			else if( propertyName == "BackgroundPosition" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var optionsValue = [
						{ Selected : false , Value: "left top" },
						{ Selected : false , Value: "left center" },
						{ Selected : false , Value: "left bottom" },
						{ Selected : false , Value: "right top" },
						{ Selected : false , Value: "right center" },
						{ Selected : false , Value: "right bottom" },
						{ Selected : false , Value: "center top" },
						{ Selected : false , Value: "center center" },
						{ Selected : false , Value: "center bottom" }
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.BackgroundPosition ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", optionsValue , function( value , event ){
					itemHTML.BackgroundPosition = value;
				}));
			}
			else if( propertyName == "BackgroundRepeat" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var optionsValue = [
						{ Selected : false , Value: "repeat" },
						{ Selected : false , Value: "repeat-x" },
						{ Selected : false , Value: "repeat-y" },
						{ Selected : false , Value: "no-repeat" }
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.BackgroundRepeat ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", optionsValue , function( value , event ){
					itemHTML.BackgroundRepeat = value;
				}));
			}
			else if( propertyName == "BackgroundSize" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var optionsValue = [
						{ Selected : false , Value: "contain" },
						{ Selected : false , Value: "cover" },
						{ Selected : false , Value: "100% 100%" },
						{ Selected : false , Value: "auto" },
						{ Selected : false , Value: "initial" }
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.BackgroundSize ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", optionsValue , function( value , event ){
					itemHTML.BackgroundSize = value;
				}));
			}
			else if( propertyName == "Border" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var BorderStyles = [
						{ Selected : false , Value: "dashed" },
						{ Selected : false , Value: "dotted" },
						{ Selected : false , Value: "double" },
						{ Selected : false , Value: "groove" },
						{ Selected : false , Value: "hidden" },
						{ Selected : false , Value: "inset" },
						{ Selected : false , Value: "outset" },
						{ Selected : false , Value: "ridge" },
						{ Selected : false , Value: "solid" },
						{ Selected : false , Value: "none" }
				];
				for( var index = 0; index < BorderStyles.length ; index++){
					if( BorderStyles[ index ].Value == itemHTML.Border.Style ){
						BorderStyles[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Border </th>");
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Style" ,"SELECT", BorderStyles , function( value , event ){
					itemHTML.Border.Style = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Width" ,"NUMBER", itemHTML.Border.Width , function( value , event ){
					itemHTML.Border.Width = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Radius" ,"NUMBER", itemHTML.Border.Radius , function( value , event ){
					itemHTML.Border.Radius = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Color" ,"COLOR", itemHTML.Border.Color , function( value , event ){
					itemHTML.Border.Color = value;
				}));
			}
			else if( propertyName == "Caption" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX", itemHTML.Caption , function( value , event ){
						itemHTML.Caption = value;
				}));
			}
			else if( propertyName == "Class" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"TEXTAREA", itemHTML.Class.join() , function( value , event ){
					itemHTML.Class = value.split(",");
				}));
			}
			else if( propertyName == "Color" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"COLOR", itemHTML.Color , function( value , event ){
					itemHTML.Color = value;
				}));
			}
			else if( propertyName == "Columns" ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"NUMBER", itemHTML.Columns , function( value , event ){
						itemHTML.Columns = value;
				}));
			}
			else if( propertyName == "Container" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX" , itemHTML.Container , function( value , event ){
					itemHTML.Container = value;
				}));
			}
			else if( propertyName == "DataTemple" && itemHTML.hasTemple() && itemHTML.ItemType != ItemType.TEMPLATE ){
				var parentTemple = itemHTML.hasTemple();
				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> DataSource </th>");
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				var OptionsValues = [];
				for( var index = 0; index < parentTemple.Fields.length ; index++){
					var flag = false;
					for( var i = 0 ; i < itemHTML.DataTemple.Name.length ; i++ ){
						if( itemHTML.DataTemple.Name[ i ] == parentTemple.Fields[ index].Data ){
							flag = true;
							break;
						}
					}
					OptionsValues.push( { Selected : flag , Value: parentTemple.Fields[ index].Data , Text: parentTemple.Fields[ index].Data });
				}
				var OptionsValuesAttribute = [
					{ Text :"Image" 		, Value :"src" 				},
					{ Text :"Link" 			, Value :"href" 			},
					{ Text :"Color" 		, Value :"color"	 		},
					{ Text :"Texto" 		, Value :"html" 			},
					{ Text :"Imagen Fondo" 	, Value :"background-image" },
					{ Text :"Color Fondo" 	, Value :"background-color" },
					{ Text :"Valor" 		, Value :"Value" 			}
				];
				var OptionsValuesFormato = [
					{ Text :"Sin Formato" 	, Value :"" 			},
					{ Text :"Entero 2D" 	, Value :"i2" 			},
					{ Text :"Decimal 2D" 	, Value :"f2"	 		},
					{ Text :"Fecha" 		, Value :"yyy-mm-dd" 	}
				];
				var ColumnsValues = [
					{ Label : "Campo" 		, Name : "DataName" 	 	, Options : OptionsValues 			, Values : itemHTML.DataTemple.Name 	   },
					{ Label : "Attributo" 	, Name : "DataAttribute" 	, Options : OptionsValuesAttribute 	, Values : itemHTML.DataTemple.Attribute },
					{ Label : "Formato" 	, Name : "DataFormat" 		, Options : OptionsValuesFormato 	, Values : itemHTML.DataTemple.DataType  },
				 ];

				$(elementTR).append( __CreateInputProperty( "" ,"TABLE" , ColumnsValues , function( value , event ){
					var Property = value;
					itemHTML.DataTemple.Name[ Property.Index ] = Property.DataName;
					itemHTML.DataTemple.Attribute[ Property.Index ] = Property.DataAttribute;
					itemHTML.DataTemple.DataType[ Property.Index ] = Property.DataFormat;
				}));
			}
			else if( propertyName == "DecorationText" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				var TextDecoration = [
						{ Selected : false , Value: "line-through" },
						{ Selected : false , Value: "overline" },
						{ Selected : false , Value: "underline" },
						{ Selected : false , Value: "none" }
				];
				for( var index = 0; index < TextDecoration.length ; index++){
					if( TextDecoration[ index ].Value == itemHTML.DecorationText ){
						TextDecoration[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", TextDecoration , function( value , event ){
					itemHTML.DecorationText = value;
				}));
			}
			else if( propertyName == "Enabled" ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX", itemHTML.Enabled , function( value , event ){
					itemHTML.Enabled = value;
				}));
			}
			else if( propertyName == "FillParent" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"CHECKBOX", itemHTML.FillParent , function( value , event ){
					itemHTML.FillParent = value;
				}));
			}
			else if( propertyName == "Float" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				var optionsValue = [
						{ Selected : false , Value: "left" },
						{ Selected : false , Value: "right" },
						{ Selected : false , Value: "none" }
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.Float ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", optionsValue , function( value , event ){
					itemHTML.Float = value;
				}));

			}
			else if( propertyName == "Font" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Font </th>");
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Size" ,"NUMBER", itemHTML.Font.Size , function( value , event ){
					itemHTML.Font.Size = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				var OptionsValues = [
						{ Selected : false , Value: "Arial , sans-serif" },
						{ Selected : false , Value: "Bevan" },
						{ Selected : false , Value: "Bevan , sans-serif" },
						{ Selected : false , Value: "Helvetica" },
						{ Selected : false , Value: "Helvetica , sans-serif" },
						{ Selected : false , Value: "Open Sans" },
						{ Selected : false , Value: "TAHOMA" },
						{ Selected : false , Value: "Raleway" },
						{ Selected : false , Value: "Raleway , sans-serif" }
				];
				for( var index = 0; index < OptionsValues.length ; index++){
					if( OptionsValues[ index ].Value == itemHTML.Font.Family ){
						OptionsValues[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( "Family" ,"SELECT", OptionsValues , function( value , event ){
					itemHTML.Font.Family = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Bold" ,"NUMBER", itemHTML.Font.Bold , function( value , event ){
					itemHTML.Font.Bold = value;
				}));
			}
			else if( propertyName == "Image" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"IMAGE", itemHTML.Image , function( value , event ){
					itemHTML.Image = value;
				}));
			}
			else if( propertyName == "Format" && itemHTML.ItemType != ItemType.TEMPLATE  ){
				var OptionsValues = [
						{ Selected : false , Value: "mp3" },
						{ Selected : false , Value: "wma" }
				];
				for( var index = 0; index < OptionsValues.length ; index++){
					if( OptionsValues[ index ].Value == itemHTML.Format ){
						OptionsValues[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", OptionsValues , function( value , event ){
					itemHTML.Format = value;
				}));
			}
			else if( propertyName == "ListStyle" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var OptionsValues = [
						{ Selected : false , Value: "disc" },
						{ Selected : false , Value: "armenian" },
						{ Selected : false , Value: "circle" },
						{ Selected : false , Value: "cjk-ideographic" },
						{ Selected : false , Value: "decimal" },
						{ Selected : false , Value: "decimal-leading-zero" },
						{ Selected : false , Value: "georgian" },
						{ Selected : false , Value: "hebrew" },
						{ Selected : false , Value: "hiragana" },
						{ Selected : false , Value: "hiragana-iroha" },
						{ Selected : false , Value: "katakana" },
						{ Selected : false , Value: "katakana-iroha" },
						{ Selected : false , Value: "lower-alpha" },
						{ Selected : false , Value: "lower-greek" },
						{ Selected : false , Value: "lower-latin" },
						{ Selected : false , Value: "lower-roman" },
						{ Selected : false , Value: "none" },
						{ Selected : false , Value: "square" },
						{ Selected : false , Value: "upper-alpha" },
						{ Selected : false , Value: "upper-latin" },
						{ Selected : false , Value: "upper-roman" }
				];
				for( var index = 0; index < OptionsValues.length ; index++){
					if( OptionsValues[ index ].Value == itemHTML.ListStyle ){
						OptionsValues[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT_MIX_IMAGE", OptionsValues , function( value , event ){
					itemHTML.ListStyle = value;
				}));
			}
			else if( propertyName == "Link" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"AUTOCOMPLETE", {
					Value 		: itemHTML.Link.Data ,
					Text 		: itemHTML.Link.Text  ,
				 	Method 		: "POST",
					URL 		: "../lib/php/editorPlantilla.php",
					Parameters 	: { "Request" : btoa( JSON.stringify( { "CommandType" : "URL_PLANTILLA"} ))  }
				},
				function( value , event ){
					console.log(value);
					itemHTML.Link = value;
				}));
			}
			else if( propertyName == "Location" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Location </th>");
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "X" ,"TEXT", itemHTML.Location.X , function( value , event ){
					itemHTML.Location.X = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Y" ,"TEXT", itemHTML.Location.Y , function( value , event ){
					itemHTML.Location.Y = value;
				}));
			}
			else if( propertyName == "Marggin" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var SliderOptions = {};

				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Marggin </th>");
				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Marggin.TOP };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "TOP" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Marggin.TOP = value;
				}));

				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Marggin.RIGHT };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "RIGHT" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Marggin.RIGHT = value;
				}));

				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Marggin.BOTTOM };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "BOTTOM" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Marggin.BOTTOM = value;
				}));

				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Marggin.LEFT };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "LEFT" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Marggin.LEFT = value;
				}));
			}
			else if( propertyName == "Padding" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var SliderOptions = {};

				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Padding </th>");
				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Padding.TOP };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "TOP" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Padding.TOP = value;
				}));

				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Padding.RIGHT };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "RIGHT" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Padding.RIGHT = value;
				}));

				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Padding.BOTTOM };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "BOTTOM" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Padding.BOTTOM = value;
				}));

				SliderOptions = { Min : -100 , Max: 100 , Value : itemHTML.Padding.LEFT };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");
				$(elementTR).append( __CreateInputProperty( "LEFT" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Padding.LEFT = value;
				}));
			}
			else if( propertyName == "Pager" ){
				$(elementTR).append( __CreateInputProperty( "Paginado" ,"CHECKBOX" , itemHTML.Pager , function( value , event ){
					itemHTML.Pager = value;
				}));
			}
			else if( propertyName == "Responsive" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var SliderOptions = {};

				SliderOptions = { Min : 0 , Max: 12 , Value : itemHTML.Responsive.PHONES };
				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Responsive </th>");
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "PHONES" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Responsive.PHONES = value;
				}));

				SliderOptions = { Min : 0 , Max: 12 , Value : itemHTML.Responsive.TABLES };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "TABLES" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Responsive.TABLES = value;
				}));

				SliderOptions = { Min : 0 , Max: 12 , Value : itemHTML.Responsive.NOTEBOOK };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "NOTEBOOK" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Responsive.NOTEBOOK = value;
				}));

				SliderOptions = { Min : 0 , Max: 12 , Value : itemHTML.Responsive.DESKTOPS };
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "DESKTOPS" ,"SLIDER",  SliderOptions, function( value , event ){
					itemHTML.Responsive.DESKTOPS = value;
				}));
			}
			else if( propertyName == "RowView" ){
				$(elementTR).append( __CreateInputProperty( "Elementos por Vista" ,"NUMBER" , itemHTML.RowView , function( value , event ){
					itemHTML.RowView = value;
				}));
			}
			else if( propertyName == "Size" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append("<th colspan='2' style='text-align: center; border-botttom: 1px solid lightgray;'> Size </th>");
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Width" ,"TEXT", itemHTML.Size.Width , function( value , event ){
					itemHTML.Size.Width = value;
				}));
				$(m_elementTBODY).append(elementTR);
				elementTR = document.createElement("tr");

				$(elementTR).append( __CreateInputProperty( "Height" ,"TEXT", itemHTML.Size.Height , function( value , event ){
					itemHTML.Size.Height = value;
				}));
			}
			else if( propertyName == "Source"  ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"AUTOCOMPLETE", {
					Value 		: itemHTML.Source ,
					Text 		: itemHTML.Source  ,
				 	Method 		: "POST",
					URL 		: "../lib/php/editorPlantilla.php",
					Parameters 	: { "Request" : btoa( JSON.stringify( { "CommandType" : "GET_CONTENT"} ))}
				},
				function( value , event ){
					itemHTML.Source = value;
				}));
			}
			else if( propertyName == "Tabs" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"NUMBER" , itemHTML.Tabs , function( value , event ){
					itemHTML.Tabs = value;
				}));
			}
			else if( propertyName == "Text" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"TEXTAREA", itemHTML.Text, function( value , event ){
					itemHTML.Text = value;
				}));
			}
			else if( propertyName == "TextType" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var optionsValue = [
						{ Selected : false , Value: "Title 1" },
						{ Selected : false , Value: "Title 2" },
						{ Selected : false , Value: "Title 3" },
						{ Selected : false , Value: "Title 4" },
						{ Selected : false , Value: "Title 5" },
						{ Selected : false , Value: "Title 6" },
						{ Selected : false , Value: "Parrafo" },
						{ Selected : false , Value: "Texto" }
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.TextType ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECT", optionsValue , function( value , event ){
					itemHTML.TextType = value;
				}));
			}
			else if( propertyName == "TextAlign" && itemHTML.ItemType != ItemType.TEMPLATE ){
				var optionsValue = [
						{ Selected : false , Value: "left"  	, Text :"<i class='glyphicon glyphicon-align-left'></i>"},
						{ Selected : false , Value: "center" 	, Text :"<i class='glyphicon glyphicon-align-center'></i>"},
						{ Selected : false , Value: "right" 	, Text :"<i class='glyphicon glyphicon-align-right'></i>"},
						{ Selected : false , Value: "justify" , Text :"<i class='glyphicon glyphicon-align-justify'></i>"}
				];
				for( var index = 0; index < optionsValue.length ; index++){
					if( optionsValue[ index ].Value == itemHTML.TextAlign ){
						optionsValue[ index ].Selected = true;
						break;
					}
				}
				$(elementTR).append( __CreateInputProperty( propertyName ,"SELECTBUTTON", optionsValue , function( value , event ){
					itemHTML.TextAlign = value;
				}));
			}
			else if( propertyName == "Video" && itemHTML.ItemType != ItemType.TEMPLATE ){
				$(elementTR).append( __CreateInputProperty( propertyName ,"UPLOAD" , itemHTML.Video , function( value , event ){
					itemHTML.Video = value;
				}));
			}
			$(m_elementTBODY).append(elementTR);
		}
	};
	this.Show = function(){
		$( m_elementDOM).animate({ right: 0 });
	};
	this.Hide = function(){
		$( m_elementDOM).animate({ right: -m_size.Width });
	};
	var __Init = function( ){
    m_elementDOM = Configuration.Container ? $(Configuration.Container).get(0) : document.createElement("div");
    m_id 				 = __GetKey( 5 , "pnlPropertiesHTML");
    m_currentItem.Position  = Configuration.Position  ? Configuration.Position : "RIGHT";
    m_currentItem.BackColor = Configuration.BackColor ? Configuration.BackColor : "#F3F3F4";
		for( propertyKey in Configuration ){
			if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
				m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
			}
		}

    $(m_elementDOM)
      .attr("data-role","PropertiesHTML")
      .addClass("uk-panel")
      .addClass("uk-panel-header")
      .css({
				"margin-top":"20px",
				"padding":"0px 0px 0px 5px",
				"z-index":"1",
				"border":"1px solid lightgray",
				"position":"absolute" })
      .append(function(){
        var elementH4 = document.createElement("h4");
        $(elementH4)
          .addClass("uk-panel-title")
          .attr("data-role","Title")
					.append(function(){
						var elementButton = document.createElement("button");
						$(elementButton)
							.addClass("uk-icon angle-double-right")
							.css({
								"left":"-39px",
								"top":"-5px",
								"position":"relative",
							})
							.append("<span class='glyphicon glyphicon-cog'></span>")
							.click(function(){
								m_currentItem.Visible = !m_currentItem.Visible;
								if( !m_currentItem.Visible ){
									$(this)
										.removeClass("glyphicon glyphicon-angle-double-right")
										.addClass("glyphicon glyphicon-angle-double-left");
								}
								else{
										$(this)
											.removeClass("glyphicon glyphicon-angle-double-left")
											.addClass("glyphicon glyphicon-angle-double-right");
								}
							});
						return elementButton ;
					})
          .append("Panel de Propiedades");

        return elementH4;
      })
      .append(function(){
        var elementDIV = document.createElement("div");
        $(elementDIV)
					.css({
						"height" : m_currentItem.Size.Height - 50,
						"overflow-y":"auto"
					})
          .append(function(){
            var elementTABLE = document.createElement("table");
            $(elementTABLE)
              .addClass("table")
              .append(function(){
                m_elementTBODY = document.createElement("tbody");
                return m_elementTBODY;
              });
            return elementTABLE;
          })
        return elementDIV;
      });
	};
	__Init();
};
function jsNorCodePanelHTML(){
	var
		DOM_textArea = null;
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}, //Configuracion
		m_elementDOM  = {}	 ,
		m_id          = ""	 ,
		m_left				= 0		 ,
		m_size 				= null ,
		m_text				= ""	 ,
		m_top					= 0		,
		m_visible			= false;
  Object.defineProperties( m_currentItem , {
    'ElementDOM' : { get: function() { return m_elementDOM; }},
    'ID'				 : { get: function() { return m_id;         }},
		"Left"			 : {
			get : function() { return m_left; } ,
			set : function( pAttributeValue ){
				m_left = pAttributeValue;
				$(m_elementDOM).css("left",m_left);
			}
		},
		"Size"			 : {
			get : function() { return m_size; } ,
			set : function( pAttributeValue ){
				if( pAttributeValue instanceof jsNorCssSize ){
					pAttributeValue["Element"] = m_elementDOM;
					m_size = pAttributeValue;
				}
				else{
					pAttributeValue["Element"] = m_elementDOM;
					m_size = new jsNorCssSize( pAttributeValue );
				}
			}
		},
		"Text"			 : {
			get : function() { return m_text; } ,
			set : function( pAttributeValue ){
				m_text = pAttributeValue;
			}
		},
		"Top"			 	 : {
			get : function() { return m_left; } ,
			set : function( pAttributeValue ){
				m_top = pAttributeValue;
				$(m_elementDOM).css("top",m_top);
			}
		},
		"Visible"		 : {
			get : function() { return m_visible; } ,
			set : function( pAttributeValue ){
				m_visible = pAttributeValue;
				if( m_visible ){
					$( m_elementDOM ).css("display","block");
				}
				else{
					$( m_elementDOM ).css("display","none");
				}
			}
		}
	});
	var __Init = function( ){
		m_elementDOM = Configuration.Container ? $(Configuration.Container).get(0) : document.createElement("div");
		m_id = __GetKey( 5 , "jsNorCodePanelHTML");
		m_size = new jsNorCssSize( { Element : m_elementDOM });
		DOM_textArea = document.createElement("textarea");

		$(DOM_textArea).css({ "height":"100%", "width":"100%" });

		$(m_elementDOM)
			.attr("data-role","CodePanel")
			.css({ "position":"absolute" })
			.append(DOM_textArea);
		for( propertyKey in Configuration ){
			if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
				m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
			}
		}
	};
	__Init();
};
//==============================================================================
//==============================================================================
//
//
//==============================================================================
//==============================================================================
function jsNorDragAndDropPanelHTML( ){
  	var m_currentItem = this,
  		Configuration 	= arguments[0] ? arguments[0] : {}, //Configuracion
  		m_elementDOM  	= {},
  		m_id          	= "",
  		m_actionStack 	= [],
      m_backColor   	= "",
      m_border      	= "",
			m_classOwer			= "",
  		m_css         	= [],
			m_entrys				= [],
			m_formularios		= {},
			m_items					= [],
			m_lastItem			= null,
			m_left					= 0 ,
			m_manager				= {},
  		m_safeCopy    	= "",
  		m_scripts     	= [],
			m_selectedItem	= {},
      m_size        	= {},
  		m_title       	= "",
			m_top						= 0 ,
			m_visible				= true,
      m_zoom        	= -1,
      m_width       	= -1,
      m_height      	= -1;
		//	=========================================================================
		// 		Events
		//	=========================================================================
		var
		  e_OnBeforeAddItem 		= [] , // Evento que se ejecuta antes de agregar un articulo
			e_OnBeforeDispose 		= [] , // Evento que se ejecuta antes de eliminar el elemento
			e_OnBeforeRemoveItem	= [] , // Evento que se ejecuta antes de eliminar un item
			e_OnBeforeReSize			= [] , // Evento que se ejecuta antes de redimencionar el elemento

			e_OnAddItem 		  		= [] , // Evento que se ejecuta cuando se agrega un item
			e_OnClick 			  		= [] , // Evento que se ejecuta cuando hace click el elemento
			e_OnDispose			  		= [] , // Evento que se ejecuta cuando se elimina el elemnento
			e_OnInit				  		= [] , // Evento que se ejecuta antes de Renderizarce
			e_OnMouseEnter	  		= [] , // Evento que se ejecuta cuando el mouse entra al objeto
			e_OnMouseOut		  		= [] , // Evento que se ejecuta cuando el mouse se retira del objeto
			e_OnMove 				  		= [] , // Evento que se ejecuta cuando el objeto se ha movido
			e_OnRemoveItem 	  		= [] , // Evento que se ejecuta cuando se elimina un item
			e_OnReOrden						= [] , // Evento que se ejecuta cuando reordean el elemento
			e_OnReSize			  		= [] , // Evento que se ejecuta cuando cambia de tamaño
			e_SelectedItemChanged	= [] ;

		Object.defineProperties( m_currentItem , {
			'ElementDOM' 		: { get: function() { return m_elementDOM; 		} },
			'ID'				 		: { get: function() { return m_id; 						}	},
      'ActionStack'   : {
          get: function(){ return m_actionStack ;},
          set : function( value ){
            m_actionStack.push( value );
          }
      },
      'BackColor'     : {
          get: function(){ return m_backColor ;},
          set : function( value ){
            m_backColor = value ;
            $( m_elementDOM ).css("background-color", m_backColor );
          }
      	},
      'Border'     		: {
          get: function(){ return m_border ;},
          set : function( value ){
            m_border = value ;
            $( m_elementDOM ).css("border", m_border );
          }
      	},
      'ClassOwer'     : {
          get: function(){ return m_classOwer ;},
          set : function( value ){
            m_classOwer = value ;
          }
      	},
      'Css'     			: {
          get: function(){ return m_css ;},
          set : function( value ){
            m_css.push( value );
          }
      	},
      'Entrys'     		: {
          get: function(){ return m_entrys ;},
          set : function( pEntryHTML ){
            for( var index = 0; index < m_entrys.length ; index++ ){
							if( m_entrys[ index ].ID == pEntryHTML.ID ){
								return;
							}
							 m_entrys[ index ].Refresh();
						}
						for( keyProperty in ItemType ){
							if( ItemType[ keyProperty ] == pEntryHTML.ItemType ){
								pEntryHTML.AccessName = keyProperty + " " + m_currentItem.FindItemCounter( pEntryHTML.ItemType );
								break;
							}
						}
						m_entrys.push( pEntryHTML );
          }
      	},
			'Items'     		: {
          get: function(){ return m_items ;},
      	},
			'LastInsert'    : {
          get: function(){ return m_lastItem ;},
          set : function( value ){
            m_lastItem = value ;
          }
      	},
			'Left'     			: {
          get: function(){ return m_left ;},
          set : function( pAttributeValue ){
            m_left = pAttributeValue ;
						$(m_elementDOM).css("left", m_left );
          }
      	},
			'Manager'     	: {
          get: function(){ return m_manager ;},
          set : function( value ){
            m_manager = value ;
          }
      	},
      'SafeCopy'     	: {
          get: function(){ return m_safeCopy ;},
          set : function( value ){
            m_safeCopy = value ;
          }
      	},
      'Scripts'     	: {
          get: function(){ return m_scripts ;},
          set : function( value ){
            m_scripts.push( value );
          }
      	},
			'SelectedItem'	: {
          get: function(){ return m_selectedItem ;},
          set : function( value ){
						m_selectedItem.IsSelected = false;
            m_selectedItem = value;
						for( var i = 0 ; i < e_SelectedItemChanged.length ; i++){
							e_SelectedItemChanged[ i ]( m_currentItem , m_selectedItem );
						}
          }
				},
      'Size'     			: {
          get: function(){ return m_size ;},
          set : function( pAttributeValue ){
						if( pAttributeValue instanceof jsNorCssSize ){
							pAttributeValue["Element"] = m_elementDOM;
							m_size = pAttributeValue;
						}
						else{
							pAttributeValue["Element"] = m_elementDOM;
							m_size = new jsNorCssSize( pAttributeValue );
						}
					}
      },
      'Title'     		: {
          get: function(){ return m_title ;},
          set : function( value ){
            m_title = value ;
          }
      	},
			'Top'     			: {
          get: function(){ return m_top ;},
          set : function( pAttributeValue ){
            m_top = pAttributeValue ;
						$(m_elementDOM).css("top", m_top );
          }
      	},
      'Visible'     	: {
          get: function(){ return m_visible ;},
          set : function( value ){
            m_visible = value ;
						if( m_visible ){
		          $(m_elementDOM).css( "display" , "block" );
						}
						else{
		          $(m_elementDOM).css( "display" , "none" );
						}
          }
      	},
      'Zoom'     			: {
          get: function(){ return m_zoom ;},
          set : function( value ){
            m_zoom = value ;
            $( m_elementDOM ).css("-ms-transform"     , "scale("+m_zoom+","+m_zoom+")" );
            $( m_elementDOM ).css("-webkit-transform" , "scale("+m_zoom+","+m_zoom+")" );
            $( m_elementDOM ).css("transform"         , "scale("+m_zoom+","+m_zoom+")" );
          }
      	}
		});
		//	=========================================================================
		// 		Asignacion de los eventos
		//	=========================================================================
		Object.defineProperties( m_currentItem , {
			'OnAddItem': {
				get: function() { return e_OnAddItem; 					},
				set: function( eValue ) { e_OnAddItem.push( eValue ) ; }
			},
			'OnClick' : {
				get: function() { return e_OnClick; 					},
				set: function( eValue ) { e_OnClick.push( eValue ) ;}
			},
			'OnDispose' : {
				get: function() { return e_OnDispose; 					},
				set: function( eValue ) { e_OnDispose.push(eValue) ;}
			},
			'OnInit' : {
				get: function() { return e_OnInit; 					},
				set: function( eValue ) { e_OnInit.push(eValue) ;}
			},
			'OnMouseEnter': {
				get: function() { return e_OnMouseEnter; 					},
				set: function( eValue ) { e_OnMouseEnter.push( eValue ) ; }
			},
			'OnMouseOut': {
				get: function() { return e_OnMouseOut; 					},
				set: function( eValue ) { e_OnMouseOut.push( eValue ) ; }
			},
			'OnMove': {
				get: function() { return e_OnMove; 					},
				set: function( eValue ) { e_OnMove.push( eValue ) ; }
			},
			'OnRemoveItem': {
				get: function() { return e_OnRemoveItem; 					},
				set: function( eValue ) { e_OnRemoveItem.push( eValue ) ; }
			},
			'OnReOrden': {
				get: function() { return e_OnReOrden; 					},
				set: function( eValue ) { e_OnReOrden.push( eValue ) ; }
			},
			'OnReSize': {
				get: function() { return e_OnReSize; 					},
				set: function( eValue ) { e_OnReSize.push( eValue ) ; }
			}
		});
		this.Show = function(){
			m_currentItem.Visible = true;
		};
		this.Hide = function(){
			m_currentItem.Visible = false;
		};
		this.SaveToHTML = function(){
			var array_imagesFiles 	= [];
			var array_soundFiles 	= [];
			var array_videoFiles 	= [];
			var l_empty = true;
			var _codeHTML = "";
			for (var i = 0; i < m_items.length; i++) {
				var array_files = m_items[ i ].GetFiles();
				if( array_files.Images ){
					array_imagesFiles = array_imagesFiles.concat( array_files.Images );
				}
				if( array_files.Sounds ){
					array_soundFiles = array_soundFiles.concat( array_files.Sounds );
				}
				if( array_files.Video ){
					array_videoFiles = array_videoFiles.concat( array_files.Video );
				}
				_codeHTML += m_items[ i ].ToHTML();
			}
			l_empty = _codeHTML.trim().length == 0;


			_codeHTML = "<div class='page-content row' html-type='startItems'>" + _codeHTML + "</div>";
			_codeHTML = "<?php require('../Header.php'); ?><div class='content-area' style='width:100%;' >" + _codeHTML + "</div><?php require('../Footer.php') ?>";
			return { Empty : l_empty ,  CODE : _codeHTML , IMAGES : array_imagesFiles , SOUNDS : array_soundFiles , VIDEOS : array_videoFiles };
		};
		this.Clear = function(){
			while( m_items.length > 0){
				m_items[0].Dispose();
			}
		};
		this.SetCodeHTML = function( sourceHTML ){
			m_currentItem.Clear();
			var elementContainer = document.createElement("div");
			$(elementContainer).append( sourceHTML );
			var array_Childs = $(elementContainer).find("[html-type=startItems]").get(0).childNodes;
			for (var i = 0; i < array_Childs.length; i++) {
				var pItemHTML = BuilderNorItemHTMLByDom( array_Childs[ i ] , m_currentItem );
				if( !pItemHTML )
					continue;
				m_currentItem.AddItem( pItemHTML );
			}
		};
		var __AjaxGetFormularios = function(  ){
			if( m_formularios.Add )
				return;
			$.ajax({
					type: "GET",
					url: "formulario_Plantilla.php",
					dataType: "html",
			})
			.success( function( data ) {
				var elementTemplate = document.createElement("div");
				$(elementTemplate).append( data );
					m_formularios.Add 		 = $(elementTemplate).find("[name=frmAdd]");
					m_formularios.Open 		 = $(elementTemplate).find("[name=frmOpen]");
					m_formularios.Save 		 = $(elementTemplate).find("[name=frmSave]");
					m_formularios.Delete 	 = $(elementTemplate).find("[name=frmDelete]");
					m_formularios.Template = $(elementTemplate).find("[name=frmTemplate]");

					$( m_formularios.Add).hide();
					$("[data-role=formulario]").remove();
					$("body").append(  m_formularios.Add );
			});
		};
		var __Refresh = function(){
			if( $( m_elementDOM ).sortable( "instance" ) ){
				$( m_elementDOM ).sortable( "destroy" );
			}
			$(m_elementDOM).sortable( configurationSortable( m_currentItem , m_classOwer , { left: 0, top: 0 } ) );
		};
		var __Init = function( ){
      m_elementDOM = Configuration.Container ? $(Configuration.Container).get(0) : document.createElement("div");
      m_id = __GetKey( 5 , "pnlDrag_DropHTML");
			m_currentItem.BackColor = "white";
			m_currentItem.Border	 	= "1px solid black";
			m_classOwer = __GetKey( 3 , "DragDrop_Panel" );
			m_size = new jsNorCssSize({ Element : m_elementDOM });

			for( propertyKey in Configuration ){
				if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
					m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
				}
			}
			if( Configuration.Formularios ){
				m_formularios.Add 			=  Configuration.Formularios.Add 			? Configuration.Formularios.Add 	 : null ;
				m_formularios.Open 			=  Configuration.Formularios.Open 		? Configuration.Formularios.Open 	 : null ;
				m_formularios.Save 			=  Configuration.Formularios.Save 		? Configuration.Formularios.Save 	 : null ;
				m_formularios.Delete 		=  Configuration.Formularios.Delete 	? Configuration.Formularios.Delete : null ;
				m_formularios.Template 	=  Configuration.Formularios.Template ? Configuration.Formularios.Template : null ;
			}
			$(m_elementDOM)
				.addClass( m_classOwer )
				.css({
					"position" :"absolute"
				})
				.attr("data-container","unlimited")
        .attr("data-role","Drag&DropHTML")
				.droppable( configurationDroppable( m_currentItem , m_classOwer ) );
			__AjaxGetFormularios();
			__Refresh();
  	};
		Object.defineProperties( m_size , {
      'OnSelectItemChanged'     : {
          get: function(){ return e_SelectedItemChanged ;},
        	set : function( eValue ){
						e_SelectedItemChanged.push( eValue );
					}
	      }
			});
  //============================================================================
		this.Refresh 					= function(){
			__Refresh();
		};
		this.ShowDialogNew 		= function( index ){
			if( !$( m_formularios.Add ).dialog( "instance" ) ){
				$( m_formularios.Add ).find("input").val("");
				$( m_formularios.Add ).dialog({
					modal 	  : true,
					hide 	  	: true,
					draggable : false,
					resizable : false,
					title 	  : "Nueva Plantilla",
	        create: function( event, ui ) {
	          var array_buttons = $(".ui-dialog-buttonset").find("button:not(.btn)");
	          $(".ui-dialog-titlebar-close:not(.btn)")
	            .addClass("btn btn-danger")
	            .append("<span class='glyphicon glyphicon-remove' ></span>");
	          for( i = 0 ; i < array_buttons.length ; i++ ){
	            if( $(array_buttons[i]).html() != "Cancelar"){
	              $(array_buttons[i]).addClass("btn btn-success");
	            }
	            else{
	              $(array_buttons[i]).addClass("btn btn-danger");
	            }
	          }
	        },
					buttons	  : {
						Aceptar: function() {
							var pSource = m_currentItem.SaveToHTML();
							var elementCANVAS = document.createElement("div");
							$(elementCANVAS).append( pSource.CODE );
							$(document.body).append( elementCANVAS );
							html2canvas(elementCANVAS , {
							  onrendered: function(canvas) {
							    m_title = $( m_formularios.Add).find("[name=titulo]").val();
									urlExterno = $( m_formularios.Add).find("[name=urlExterno]").val();
									pSource.CODE  = pSource.CODE.encodeURI();
									m_manager.SendAjax({ UrlExtern :  urlExterno , Prefix : index , Title : m_title.encodeURI() , Source : pSource , MiniImage : canvas.toDataURL() });
									$(elementCANVAS).remove();
									$( m_formularios.Add ).dialog( "close" );
							  },
							  width: 300,
							  height: 300
							});
						},
						Cancelar: function() {
							$( m_formularios.Add ).dialog( "close" );
						}
					}
			 	});
			}
			$( m_formularios.Add ).dialog("open");
		};
		this.ShowDialogOpen 	= function(){
			if( !$( m_formularios.Open ).dialog( "instance" ) ){
				$( m_formularios.Open ).dialog({
					modal 	  : true,
					hide 	  : true,
					draggable : false,
					resizable : false,
					height 	  : $(window).height()*0.6,
					width 	  : $(window).width()*0.5,
					title 	  : "Abrir Plantilla",
	        create: function( event, ui ) {
	          var array_buttons = $(".ui-dialog-buttonset").find("button:not(.btn)");
	          $(".ui-dialog-titlebar-close:not(.btn)")
	            .addClass("btn btn-danger")
	            .append("<span class='glyphicon glyphicon-remove' ></span>");
	          for( i = 0 ; i < array_buttons.length ; i++ ){
	            if( $(array_buttons[i]).html() != "Cancelar"){
	              $(array_buttons[i]).addClass("btn btn-success");
	            }
	            else{
	              $(array_buttons[i]).addClass("btn btn-danger");
	            }
	          }
	        },
					buttons	  : {
						Cancelar: function() {
							$( m_formularios.Open ).dialog( "close" );
						}
					}
			 	});
			}
			$( m_formularios.Open ).dialog("open");
		};
		this.ShowDialogSave 	= function( index ){
			$( m_formularios.Add).find("[name=titulo]").val( m_title );
			if( !$( m_formularios.Add ).dialog( "instance" ) ){
				$( m_formularios.Add ).dialog({
					modal 	  : true,
					hide 	    : true,
					draggable : false,
					resizable : false,
					title 	  : "Guardar Plantilla",
	        create: function( event, ui ) {
	          var array_buttons = $(".ui-dialog-buttonset").find("button:not(.btn)");
	          $(".ui-dialog-titlebar-close:not(.btn)")
	            .addClass("btn btn-danger")
	            .append("<span class='glyphicon glyphicon-remove' ></span>");
	          for( i = 0 ; i < array_buttons.length ; i++ ){
	            if( $(array_buttons[i]).html() != "Cancelar"){
	              $(array_buttons[i]).addClass("btn btn-success");
	            }
	            else{
	              $(array_buttons[i]).addClass("btn btn-danger");
	            }
	          }
	        },
					buttons	  : {
						Guardar: function() {
							var pSource = m_currentItem.SaveToHTML();
							var elementCANVAS = document.createElement("div");
							$(elementCANVAS).append( pSource.CODE );
							$(document.body).append( elementCANVAS );
							html2canvas(elementCANVAS , {
							  onrendered: function(canvas) {
							    m_title = $( m_formularios.Add).find("[name=titulo]").val();
									urlExterno = $( m_formularios.Add).find("[name=urlExterno]").val();
									pSource.CODE  = pSource.CODE.encodeURI();
									m_manager.SendAjax({ UrlExtern :  urlExterno , Prefix : index , Title : m_title.encodeURI() , Source : pSource , MiniImage : canvas.toDataURL() });
									$(elementCANVAS).remove();
									$( m_formularios.Add ).dialog( "close" );
							  },
							  width: 300,
							  height: 300
							});
						},
						Cancelar: function() {
							$( m_formularios.Add ).dialog( "close" );
						}
					}
			 	});
			}
			$( m_formularios.Add ).dialog("open");
		};
		this.ShowDialogDelete = function(){
			if( !$( m_formularios.Delete ).dialog( "instance" ) ){
				$( m_formularios.Delete ).dialog({
					modal 	  : true,
					hide 	  : true,
					draggable : false,
					resizable : false,
					title 	  : "Eliminar Plantilla",
					buttons	  : {
						Continuar: function() {
							$( m_formularios.Delete ).dialog( "close" );
						},
						Cancelar: function() {
							$( m_formularios.Delete ).dialog( "close" );
						}
					}
			 	});
			}
			$( m_formularios.Delete ).dialog("open");
		};
		this.FindChild 				= function( pChildID ){
			for (var index = 0; index < m_items.length; index++) {
				if( m_items[ index ].FindChild( pChildID ) ){
					return m_items[ index ];
				}
			}
			return null;
		};
		this.RemoveEntry 			= function( pEntryHTML ){
			for( var index = 0; index < m_entrys.length ; index++){
				if ( pEntryHTML.ID == m_entrys[ index].ID ) {
					m_entrys.splice(index, 1);
					return true;
				}
			}
			return false;
		};
		this.FindItemCounter 	= function( pItemTypeHTML ){
			var itemCounter = 1;
			for( var index = 0; index < m_entrys.length ; index++){
				if( m_entrys[ index ].ItemType == pItemTypeHTML ){
					itemCounter++;
				}
			}
			return itemCounter;
		};
		this.FindEntry 				= function( pEntryID ){
			for( var index = 0; index < m_entrys.length ; index++){
				if ( pEntryID == m_entrys[ index].ID || pEntryID.ID == m_entrys[ index].ID) {
					return m_entrys[ index];
				}
			}
			return null;
		};
		this.RemoveItem 			= function( pItemHTML ){
			for( var index = 0; index < m_items.length ; index++){
				if ( pItemHTML.ID == m_items[ index].ID ) {
		    	m_items.splice(index, 1);
					return true;
				}
			}
			return false;
		};
		this.AddItem 					= function( pItemHTML ){
			pItemHTML.Parent = m_currentItem ;
			m_items.push( pItemHTML );
			m_currentItem.Entrys = pItemHTML;
		};
  	__Init();
  }
function jsNorEditorHTML(){
	var m_currentItem = this,
		Configuration = arguments[0] ? arguments[0] : {}, //Configuracion
		m_elementDOM  = {}		,
		p_plantillaID = -1		,
		m_id          = ""		,
		m_language		= ["es","en"]		,
		m_request			= null	,
		m_root				= "../../pages"		,
		m_size				= null  ,
		m_sourceType	= ""		;
  var
	 	pnl_Code			 = null ,
		pnl_Properties = null ,
    pnl_ToolBox		 = null ,
    pnl_DragDrop 	 = [] 	;
  Object.defineProperties( m_currentItem , {
    'ElementDOM'      : { get: function() { return m_elementDOM; 	}},
    'ID'				      : { get: function() { return m_id;          }},
    'PanelCode'				: { get: function() { return pnl_Code;  }},
    'PanelDragDrop'		: { get: function() { return pnl_DragDrop;  }},
    'PanelProperties'	: { get: function() { return pnl_Properties;}},
    'PanelToolBox'	  : { get: function() { return pnl_ToolBox;   }},
    'PlantillaID'	    : { get: function() { return p_plantillaID; } , set : function(value){ p_plantillaID = value ;}},
    'Request'	    		: {
			get : function() { return p_plantillaID; } ,
			set : function( pAttributeValue ){
        if( pAttributeValue instanceof jsNorRequest ){
          m_request = new jsNorRequestGroup( pAttributeValue );
        }
        else{ m_request = pAttributeValue; }
			}
		},
		"Root":{ get: function( ){ return m_root ; }, set : function( pAttributeValue ){ m_root = pAttributeValue; }},
		"SourceType":{ get: function( ){ return m_sourceType ; }, set : function( pAttributeValue ){ m_sourceType = pAttributeValue; }}
  });
	this.SaveToHTML = function( index ){
		return pnl_DragDrop[ index ].SaveToHTML( );
	}
	this.SetCodeHTML = function( index , sourceHTML ){
		pnl_DragDrop[ index ].SetCodeHTML( sourceHTML );
	};
	this.SendAjax = function( pParameters ){
		var pQueryData = {};
		if( p_plantillaID == -1){
			pQueryData["CommandType"]= "INSERT_PLANTILLA";
		}
		else{
			pQueryData["CommandType"]= "EDIT_PLANTILLA";
		}
		pParameters["ID"] = p_plantillaID;
		pQueryData["Plantilla"] = pParameters;
		Ajax_ServerRequest(  "../lib/php/editorPlantilla.php",  "POST" , pQueryData , function( data ){
			var dataSource = JSON.parse(data);
			if( p_plantillaID == 0 ){
				console.log( window.location.search );
			}
			p_plantillaID = dataSource.TOKEN;

		});
	};
	this.ShowPanel = function ( pIndex ){
		switch ( pIndex ) {
			case 0:
				for( var i = 0; i < pnl_DragDrop.length ; i++){
					pnl_DragDrop[i].Hide();
				}
				$(m_currentItem.PanelCode).css("display","block");
			break;
			case 1:
				for( var i = 0; i < pnl_DragDrop.length ; i++){
					pnl_DragDrop[i].Hide();
				}
				pnl_DragDrop[ 0 ].Show();
				$(m_currentItem.PanelCode).css("display","none");
			break;
			case 2:
				for( var i = 0; i < pnl_DragDrop.length ; i++){
					pnl_DragDrop[i].Hide();
				}
				pnl_DragDrop[ 1 ].Show();
				$(m_currentItem.PanelCode).css("display","none");
			break;
		}
	}
		var __SaveData = function(){
			debugger;
			__AjaxSendRequest(1);
		};
		var __GetData = function(){
			__AjaxSendRequest(0);
		};
		var __AjaxGetRequest = function( p_requestType , p_ResponseData ){
			switch ( p_requestType ) {
				case 0:{
					var dataJSON = JSON.parse( p_ResponseData );
					if( dataJSON.length == 0 )
						return;
					$.ajax({
							type: 'GET',
							url: m_root + "/" + dataJSON[0].ID + "/" + m_language[0] + "-" + dataJSON[0].Url ,
							dataType: 'html',
					})
					.success( function( data ) {
						m_currentItem.PanelDragDrop[0].PlantillaID 	= dataJSON[0].ID		;
						m_currentItem.PanelDragDrop[0].Title 				= dataJSON[0].Title ;
						m_currentItem.SetCodeHTML( 0 , data );
					});
				}break;
				case 1:{
					var dataJSON = JSON.parse( p_ResponseData );
					console.log( window.location.search );
					console.log( dataJSON );
				}break;
				case 2:{
					var dataJSON = JSON.parse( p_ResponseData );
					console.log( window.location.search );
					console.log( dataJSON );
				}break;
				case 3:{
				}break;
			}
		};
		/* Medio por el cual el grid envia y recibe informcion del Servidor */
		var __AjaxSendRequest = function( p_requestType ){
			switch ( p_requestType ) {
				case 0:{ // Metodo select
					l_tempParams = {};
					for( propertyKey in m_request.Select.PARAMS ){
						l_tempParams[ propertyKey ] = m_request.Select.PARAMS[ propertyKey ];
					}
					Ajax_ServerRequest( m_request.Select.URL ,  m_request.Select.METHOD , l_tempParams , function( data ){  __AjaxGetRequest(p_requestType , data )});
				}break;
				case 1:{ // Metodo insert
					l_tempParams = {};
					for( propertyKey in m_request.Insert.PARAMS ){
						l_tempParams[ propertyKey ] = m_request.Insert.PARAMS[ propertyKey ];
					}
					Ajax_ServerRequest( m_request.Insert.URL ,  m_request.Insert.METHOD , l_tempParams , function( data ){  __AjaxGetRequest(p_requestType , data )});
				}break;
				case 2:{ // Metodo Edit
					l_tempParams = {};
					for( propertyKey in m_request.Edit.PARAMS ){
						l_tempParams[ propertyKey ] = m_request.Edit.PARAMS[ propertyKey ];
					}
					Ajax_ServerRequest( m_request.Edit.URL ,  m_request.Edit.METHOD , l_tempParams , function( data ){  __AjaxGetRequest(p_requestType , data )});
				}break;
				case 3:{ // Metodo Delete
					l_tempParams = {};
					for( propertyKey in m_request.Delete.PARAMS ){
						l_tempParams[ propertyKey ] = m_request.Delete.PARAMS[ propertyKey ];
					}
					Ajax_ServerRequest( m_request.Delete.URL ,  m_request.Delete.METHOD , l_tempParams , function( data ){  __AjaxGetRequest(p_requestType , data )});
				}break;
			}
		};

		var __RecycleScript = function(){
			$(".colpick").remove();
			$(document.body).css({"background":"ulr() !important"});
		};
    var __Init = function( ){
      m_elementDOM = Configuration.Container ? $(Configuration.Container).get(0) : document.createElement("div");
      m_id = __GetKey( 5 , "jsNorEditorHTML");
			m_size = new jsNorCssSize({
				Element : m_elementDOM  ,
				Height 	: $(window).height()*0.85 ,
				Width 	: $(window).width()*0.98
			});
			__RecycleScript();
			for( propertyKey in Configuration ){
	      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
	        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
	      }
	    }
			if( !Configuration.Panel ){
				pnl_Code 				= new jsNorCodePanelHTML({
					Left : m_size.Width * 0.15 ,
					Size : {
						Height : m_size.Height ,
						Width  : m_size.Width * 0.85
					}
				});
				pnl_Properties 	= new jsNorPropertiesPanelHTML({
					Size : {
						Height : m_size.Height ,
						Width  : 300
					}
				});
				pnl_DragDrop		= [
					new jsNorDragAndDropPanelHTML({
						Left : m_size.Width * 0.15 ,
						Manager :  m_currentItem ,
						Top : 0 ,
						Size : {
							Height : m_size.Height ,
							Width  : m_size.Width * 0.83
						},
						Visible : true
					}) , new jsNorDragAndDropPanelHTML({
						Left : m_size.Width * 0.15 ,
						Manager :  m_currentItem ,
						Top : 0 ,
						Size : {
							Height : m_size.Height ,
							Width  : m_size.Width * 0.83
						},
						Visible : false
					}) ];
				pnl_ToolBox			= new jsNorToolBoxPanelHTML({
					ControllerPanel : pnl_DragDrop ,
					Size : {
						Width  : m_size.Width * 0.1
					}
				});
			}
			else{
				pnl_Code 				= Configuration.Panel.Code 				?  Configuration.Panel.Code 			 : new jsNorCodePanelHTML();
				pnl_Properties 	= Configuration.Panel.Properties 	?  Configuration.Panel.Properties  : new jsNorPropertiesPanelHTML();
				pnl_DragDrop 		= Configuration.Panel.DragAndDrop ?  Configuration.Panel.DragAndDrop : [ new jsNorDragAndDropPanelHTML() , new jsNorDragAndDropPanelHTML() ];
				pnl_ToolBox 		= Configuration.Panel.ToolBox 		?  Configuration.Panel.ToolBox 		 : new jsNorToolBoxPanelHTML({ ControllerPanel : pnl_DragDrop });
			}
			$(m_elementDOM)
				.css({
					"overflow-x":"hidden",
					"position":"relative"
				})
				.append( pnl_Code.ElementDOM )
				.append( pnl_Properties.ElementDOM )
				.append( pnl_ToolBox.ElementDOM );
			for( var i = 0 ; i < pnl_DragDrop.length ; i++ ){
				$( m_elementDOM ).append( pnl_DragDrop[ i ].ElementDOM );
			}
			if( m_sourceType == "AJAX" ){
				__GetData();
			}
  	};
  	__Init();
  }
