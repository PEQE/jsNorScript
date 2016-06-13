/*  ----  Controlles para Edicion de Datos  ----
    Desarrollado por Ernesto Alejandro Pérez Quintana
    12-01-2016 ( Creacion de jsNorLoading , panel de espera miestras se carga o completa un proceso ).
    13-01-2016 ( Definicion de Componente jsNorForm para edicion de datos ).
     - Renombre de enumDataTypes a ControllerTypesOptions
     - Creacion de enumeracion EditFormOptions para definicion de tipos de formularios
*/
function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}
$.widget( "custom.iconselectmenu", $.ui.selectmenu, {
   _renderItem: function( ul, item ) {
    var li = $( "<li>", { text: item.label } );

    if ( item.disabled ) {
       li.addClass( "ui-state-disabled" );
    }

    $( "<span>", {
       style: item.element.attr( "data-style" ),
       "class": "ui-icon " + item.element.attr( "data-class" )
    })
        .appendTo( li );
    return li.appendTo( ul );
   }
 });
var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

var WidgetTypeOptions         = Object.freeze({ // Lista de Widgets del framework y API
    "UNKNOW"                : 0x000000 ,
    "jsNorWindow"           : 0x000001 ,
    "jsNorAlert"            : 0x000002 ,
    "jsNorConfirm"          : 0x000003 ,
    "jsNorPrompt"           : 0x000004 ,
    "jsNorControlBuilder"   : 0x000005 ,
    "jsNorMenu"             : 0x000006 ,
    "jsNorList"             : 0x000007
});
var ControllerTypesOptions  = Object.freeze({ // Tipos de Controles para formulario
    "UNKNOW"     : 0x010000 ,
    "Int"        : 0x010001 ,
    "Text"       : 0x010002 ,
    "String"     : 0x010003 ,
    "Binary"     : 0x010004 ,
    "Image"      : 0x010005 ,
    "Money"      : 0x010006 ,
    "Date"       : 0x010007 ,
    "DateTime"   : 0x010008 ,
    "Time"       : 0x010009 ,
    "Autocomplete": 0x01000A ,
    "Join"       : 0x01000B ,
    "Float"      : 0x01000C ,
    "Ranking"    : 0x01000D ,
    "File"       : 0x01000E ,
    "MULTIPLE"   : 0x01000F ,
    "DateRange"  : 0x010010 ,
    "IntRange"   : 0x010011 ,
    "BinaryRadio": 0x010012 ,
    "Grid"       : 0x010013 ,
    "Select"     : 0x010014 ,
    "Password"   : 0x010015 ,
    "Form"       : 0x010016 ,
    "SelectIcon": 0x010017 
});
var EditFormOptions         = Object.freeze({ //Tipos de formularios para la edicion de datos
    "UNKNOW"     : 0x020000 ,
    "FORM"       : 0x020001 ,
    "ROW"        : 0x020002 ,
    "INLINE"     : 0x020003
});
var WindowStateOptions = Object.freeze({ // Status de las ventanas
    "WINDOW"    : 0x030000,
    "MINIMIZE"  : 0x030001,
    "MAXIMIZE"  : 0x030002
});
var MenuOptions = Object.freeze({ // Tipos de Estilos para el barra de menu
    "SIMPLE"        : 0x040000,
    "TOP_IMAGE"     : 0x040001,
    "BOTTOM_IMAGE"  : 0x040002,
    "LEFT_IMAGE"    : 0x040003,
    "RIGHT_IMAGE"   : 0x040004
});
//==============================================================================
//=     Funciones Utilitarios
//==============================================================================
$.fn.hasOverflow = function() {
    var $this = $(this);
    var $children = $this.find('*');
    var len = $children.length;

    if (len) {
        var maxWidth = 0;
        var maxHeight = 0
        $children.map(function(){
            maxWidth = Math.max(maxWidth, $(this).outerWidth(true));
            maxHeight = Math.max(maxHeight, $(this).outerHeight(true));
        });

        return maxWidth > $this.width() || maxHeight > $this.height();
    }

    return false;
};
//----------------------------------------------------
//-     Codifica una cadena a URI
//----------------------------------------------------
String.prototype.encodeURI = function(){
    return encodeURIComponent(this);
};
//----------------------------------------------------
//-     Decodifica una cadena de URI
//----------------------------------------------------
String.prototype.decodeURI = function(){
    try{
        return decodeURIComponent(this); 
    }
    catch( ex ){
        return this.toString();
    }
};
//----------------------------------------------------
//-     Trasnforma un color rgb a HEX
//----------------------------------------------------
String.prototype.ToHex = function ( ) {
  if(this.length > 0 && this != "transparet"){
    if( this.indexOf("#") == -1){
     var  rgb = this.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
     return  hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
    else{
      return this;
    }
  }
  else{
    return "transparet";
  }
};
function hex(x) { return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16]; }
//----------------------------------------------------
//-     Elimina valores repetidos de un arreglo
//----------------------------------------------------
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};
//----------------------------------------------------
//-     Verifica si una Cadena contiene el formato JSON
//----------------------------------------------------
JSON.isJSON = function( pValueString ){
  try {
      var o = JSON.parse(pValueString);
      return (o && typeof o === "object" && o !== null);
  }
  catch (e) {
      
  }
  return false;
};
//----------------------------------------------------
//-     Obtiene un parametro de URL
//----------------------------------------------------
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//----------------------------------------------------
//-     Verifica si una imagen existe
//----------------------------------------------------
function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}
//----------------------------------------------------
//-     Genera una cadena Aleatoria
//----------------------------------------------------
function __GetKey( len, prefix ) {
  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz + 1);
  }
  if( prefix ){
    randomString = prefix + "-" + randomString;
  }
  return randomString;
};
//==================================================================================================================
//==================================================================================================================
//==================================================================================================================
/**
* Clase Base de todos los widgets del framework y API
*
* @class jsNorBase
* @constructor
* @param {Object} ControlConfiguration              Configuracion basica de los widgets
* @param {Object} ControlConfiguration.DataType     Tipo de Widgets
* @param {Object} [ControlConfiguration.Element]    Elemento DOM que contiene el widget
*/
function jsNorBase() {
  var param_ControlConfiguration = arguments[0] ? arguments[0] : {} ;
    var // Propieades del Widget          ==============================
    obj_currentItem = this,
        /**
        * id del widget , clave que identifica el objeto DOM en el documento HTML
        * 
        * @property property_id
        * @type {String}
        * @default ""
        */
    property_id          = ""  ,
        /**
        * elemento DOM que referencia al HTML del widget.
        * 
        * @property property_elementDOM
        * @type {Object}
        * @default "div"
        */
    property_elementDOM  = null ,
        /**
        * Tipo de Widget que genera la clas e base.
        * 
        * @property property_dataType
        * @type {int}
        * @default 0x000000
        */
    property_dataType    = ControllerTypesOptions.UNKNOW  ;
    //==========================================================================================
    // Definicion de las propiedades ==============================
    Object.defineProperties( obj_currentItem , {
        "ID"        : { get:function(){ return property_id ;           }} ,
        "ElementDOM": { get:function(){ return property_elementDOM ;   }} ,
        "DataType"  : { get:function(){ return property_dataType ;     }}
    });
    /**
    * Funcion que inicializa la configuracion Inicial del widget
    *
    * @method __Init
    */
  function __Init() {
      var l_keyName = "UNKNOW";
      for( var keyName in WidgetTypeOptions ){
          if( WidgetTypeOptions[ keyName] == param_ControlConfiguration.DataType ){
              l_keyName = keyName;
          }
      }
      // Genera el ID del Widget conforme a al tipo de widget por crear
      property_id = __GetKey(10, l_keyName);
      // Asigna el elementoDOM que contendra al widget
      property_elementDOM = param_ControlConfiguration.Element ? param_ControlConfiguration.Element : document.createElement("div");
      // Asigna el tipo de Widget desde la enumeracion
      property_dataType = param_ControlConfiguration.DataType ? param_ControlConfiguration.DataType : WidgetTypeOptions.UNKNOW;

      $(property_elementDOM).attr("id", property_id);
  }
  __Init();
}
//==================================================================================================================
//==================================================================================================================
/**
*
* @class jsNorAlert
* @constructor
* @param {String} param_Text     Texto que mostrara en el widgets
* @param {String} param_Title    Titulo que mostrara el widget
* @param {String} param_Image    Url de la Imagen que mostrara en el widget
* @param {String} param_Status   Status del widget , que especifica la paleta de colores predominantes
* @param {function} param_CallBack   funcion que llamara despues de cerrar el widget
*/
function jsNorAlert( param_Text , param_Title , param_Image , param_Status , param_CallBack){
    var // Propieades del Widget          ==============================
        obj_currentItem = this,
        /**
        * Indica si el Widget se destruye cuando se cierra.
        * 
        * @property property_autoDispose
        * @type {boolean}
        * @default true
        */
        property_autoDispose = true,
        /**
        * Funcion que continuara despues de cerrar el widget.
        * 
        * @property property_callBack
        * @type {function}
        * @default null
        */
        property_callBack = null,
        /**
        * Url de la imagen que se mostrara dentro del elemento
        * 
        * @property property_image
        * @type {string}
        * @default ""
        */
        property_image = "",
        /**
        * Indicador del estado del widget .Si esta cerrrado o abierto
        * 
        * @property property_isOpen
        * @type {boolean}
        * @default false
        */
        property_isOpen = false,
        /**
        * Texto del contenido que se muestra en el centro del widget
        * 
        * @property property_text
        * @type {string}
        * @default ""
        */
        property_text = "",
        /**
        * Titulo del widget, se mostrara en la barra de titulo relativo al elemento
        * 
        * @property property_title
        * @type {string}
        * @default ""
        */
        property_title = "",
        /**
        * Status o paleta de colores del widget , hace enfasis en el proposito del elemento
        * 
        * @property property_status
        * @type {string}
        * @default ""
        */
        property_status         = ""   ;
    //==========================================================================================
    // Definicion de las propiedades ==============================
    var 
        methodPrivate_autoDispose = function( param_Value ){
            property_autoDispose = param_Value ;
        },  
        methodPrivate_SetCallBack = function( param_Value ){
            property_callBack = param_Value ;
        },
        methodPrivate_SetImage = function( param_Value ){
            property_image = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=picture]").attr("src", property_image );
        },
        methodPrivate_SetText = function (param_Value) {
            property_text = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=textContainer]").html(property_image);
        },
        methodPrivate_SetTitle = function( param_Value ){
            property_title = param_Value;
            $(obj_currentItem.ElementDOM).dialog("option", "title", property_title );
        },
        methodPrivate_SetStatus = function (param_Value) {
            property_status = param_Value;
        };
        
    Object.defineProperties( obj_currentItem , {
        "AutoDispose"   : { get: function () { return property_autoDispose;} , set: methodPrivate_autoDispose },
        "Callback"      : { get: function () { return property_callBack;   } , set: methodPrivate_SetCallBack },
        "Image"         : { get: function () { return property_image;      } , set: methodPrivate_SetImage    },
        "IsOpen"        : { get: function () { return property_isOpen;     } },
        "Title"         : { get: function () { return property_title;      } , set: methodPrivate_SetTitle    },
        "Text"          : { get: function () { return property_text;       } , set: methodPrivate_SetText     },
        "Status"        : { get: function () { return property_status;     } , set: methodPrivate_SetStatus   }
    });
    //==========================================================================================
    // Metodos de Widgets ==============================
    /**
    * Cierra el widget
    *
    * @method Close
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Close = function(){
        property_isOpen = false;
        if ($(obj_currentItem.ElementDOM).dialog("instance")) {
            $(obj_currentItem.ElementDOM).dialog("close");
        }
        for (var i = 0 ; i < event_onClose.length ; i++) {
            event_onClose[i](obj_currentItem);
        }
        if( property_autoDispose ){
            obj_currentItem.Dipose();
        }
    };
    /**
    * Destruye el widget y elimina el elemento HTML del documento
    *
    * @method Dipose
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Dipose = function(){
        if( property_isOpen ){
            $(obj_currentItem.ElementDOM).dialog("close");
        }
        if ($(obj_currentItem.ElementDOM).dialog("instance")) {
            $(obj_currentItem.ElementDOM).dialog("destroy");
        }
        $(obj_currentItem.ElementDOM).remove();
        delete obj_currentItem;

        for (var i = 0 ; i < event_onDispose.length ; i++) {
            event_onDispose[i]();
        }
    };
    /**
    * Abre el widget
    *
    * @method Open
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Open = function(){
        property_isOpen = true;
        $(obj_currentItem.ElementDOM).dialog("open");
        for (var i = 0 ; i < event_onOpen.length ; i++) {
            event_onOpen[i]();
        }
        setTimeout( obj_currentItem.Close , 3400);
    };
    //==========================================================================================
    // Eventos de Widgets ==============================
    var
        event_onDispose = [],
        event_onClose   = [],
        event_onOpen = [];
    Object.defineProperties(obj_currentItem, {
        "OnDestroy": { get: function () { return event_onDispose; }, set: function (param_VALUE) { event_onDispose.push(param_VALUE ); } },
        "OnClose": { get: function () { return event_onClose; }, set: function (param_VALUE) { event_onClose.push(param_VALUE); } },
        "OnOpen": { get: function () { return event_onOpen; }, set: function (param_VALUE) { event_onOpen.push(param_VALUE); } },
    });
    //==========================================================================================
    //==========================================================================================
    function _CreateDialog(){
        $( obj_currentItem.ElementDOM ).dialog({
            autoOpen        : false,
            closeOnEscape   : true  ,
            draggable       : false ,
            resizable       : false ,
            modal           : true  ,
            title           : property_title,
            show            : { effect: "fade", duration: 400 },
            hide            : { effect: "fade", duration: 400 }, 
            buttons         : { Aceptar: obj_currentItem.Close },
            create      : function(){
                var parentDialog = $(obj_currentItem.ElementDOM).parent();
                $(parentDialog).find(".ui-widget-header").find("button").remove();
                $(parentDialog).find(".ui-widget-header").addClass( property_status );
            }
        });
        $(obj_currentItem.ElementDOM)
            .addClass("text-center")
            .append(function () {
            	if( property_image.indexOf(" ") == -1 ){
                    var elementIMG_image = document.createElement("img");
                    $(elementIMG_image)
                        .attr("data-role","picture")
                        .attr("src", property_image);
                    return elementIMG_image;
            		
            	}
            	else if( property_image.indexOf("<") != -1  ){
                    return property_image;
               }
            	else{
                    var elementSPAN_image = document.createElement("span");
                    $(elementSPAN_image)
                        .attr("data-role","picture")
                        .addClass( property_image);
                    return elementSPAN_image;
               }
            })
            .append(function () {
                var elementDIV_TextContainer = document.createElement("div");
                $(elementDIV_TextContainer)
                    .attr("data-role","textContainer")
                    .append(property_text );
                return elementDIV_TextContainer;
            })
        if (typeof property_callBack == "function") {
            event_onClose.push(property_callBack );
        }
    }
    function __Init() {
        jsNorBase.apply(obj_currentItem, [{ DataType: WidgetTypeOptions.jsNorAlert }]);
        property_title      = param_Title    ? param_Title      : "";
        property_callBack   = param_CallBack ? param_CallBack   : null;
        property_image      = param_Image    ? param_Image      : "";
        property_text       = param_Text     ? param_Text       : "";
        property_status     = param_Status   ? param_Status     : "";
        _CreateDialog();
    };
    __Init();
}
//==================================================================================================================
//==================================================================================================================
/**
*
* @class jsNorConfirm
* @constructor
* @param {String} param_Text     Texto que mostrara en el widgets
* @param {String} param_Title    Titulo que mostrara el widget
* @param {String} param_Image    Url de la Imagen que mostrara en el widget
* @param {String} param_Status   Status del widget , que especifica la paleta de colores predominantes
* @param {function} param_CallBack   funcion que llamara despues de cerrar el widget
*/
function jsNorConfirm(param_Text, param_Title, param_Image, param_Status, param_CallBack) {
    var // Propieades del Widget          ==============================
        obj_currentItem = this,
        /**
        * Indica si el Widget se destruye cuando se cierra.
        * 
        * @property property_autoDispose
        * @type {boolean}
        * @default true
        */
        property_autoDispose = true,
        /**
        * Funcion que continuara despues de cerrar el widget.
        * 
        * @property property_callBack
        * @type {function}
        * @default null
        */
        property_callBack = null,
        /**
        * Url de la imagen que se mostrara dentro del elemento
        * 
        * @property property_image
        * @type {string}
        * @default ""
        */
        property_image = "",
        /**
        * Indicador del estado del widget .Si esta cerrrado o abierto
        * 
        * @property property_isOpen
        * @type {boolean}
        * @default false
        */
        property_isOpen = false,
        /**
        * Texto del contenido que se muestra en el centro del widget
        * 
        * @property property_text
        * @type {string}
        * @default ""
        */
        property_text = "",
        /**
        * Titulo del widget, se mostrara en la barra de titulo relativo al elemento
        * 
        * @property property_title
        * @type {string}
        * @default ""
        */
        property_title = "",
        /**
        * Status o paleta de colores del widget , hace enfasis en el proposito del elemento
        * 
        * @property property_status
        * @type {string}
        * @default ""
        */
        property_status = "",
        /**
        * Valor seleccionado por el usuario 
        * 
        * @property property_value
        * @type {boolean}
        * @default false
        */
        property_value = false;
    //==========================================================================================
    // Definicion de las propiedades ==============================
    var
        methodPrivate_autoDispose = function (param_Value) {
            property_autoDispose = param_Value;
        },
        methodPrivate_SetCallBack = function (param_Value) {
            property_callBack = param_Value;
        },
        methodPrivate_SetImage = function (param_Value) {
            property_image = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=picture]").attr("src", property_image);
        },
        methodPrivate_SetText = function (param_Value) {
            property_text = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=textContainer]").html(property_image);
        },
        methodPrivate_SetTitle = function (param_Value) {
            property_title = param_Value;
            $(obj_currentItem.ElementDOM).dialog("option", "title", property_title);
        },
        methodPrivate_SetStatus = function (param_Value) {
            property_status = param_Value;
        };

    Object.defineProperties(obj_currentItem, {
        "autoDispose": { get: function () { return property_autoDispose; }, set: methodPrivate_autoDispose },
        "Callback": { get: function () { return property_callBack; }, set: methodPrivate_SetCallBack },
        "Image": { get: function () { return property_image; }, set: methodPrivate_SetImage },
        "IsOpen": { get: function () { return property_isOpen; } },
        "Title": { get: function () { return property_title; }, set: methodPrivate_SetTitle },
        "Text": { get: function () { return property_text; }, set: methodPrivate_SetText },
        "Status": { get: function () { return property_status; }, set: methodPrivate_SetStatus }
    });
    //==========================================================================================
    // Metodos de Widgets ==============================
    /**
    * Cierra el widget. Este recibe la decision del usuario al haber cerrado el widget
    *
    * @method Close
    * @param {boolean} param_RESULT resultado de haber cerrado el widget
    * @return {void} 
    */
    obj_currentItem.Close = function (param_RESULT) {
        property_isOpen = false;
        if ($(obj_currentItem.ElementDOM).dialog("instance")) {
            $(obj_currentItem.ElementDOM).dialog("close");
        }
        property_value = param_RESULT;
    };
    /**
    * Destruye el widget y elimina el elemento HTML del documento
    *
    * @method Dipose
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Dipose = function () {
        if (property_isOpen) {
            $(obj_currentItem.ElementDOM).dialog("close");
        }
        if ($(obj_currentItem.ElementDOM).dialog("instance")) {
            $(obj_currentItem.ElementDOM).dialog("destroy");
        }
        $(obj_currentItem.ElementDOM).remove();
        delete obj_currentItem;

        for (var i = 0 ; i < event_onDispose.length ; i++) {
            event_onDispose[i]();
        }
    };
    /**
    * Abre el widget
    *
    * @method Open
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Open = function () {
        property_isOpen = true;
        $(obj_currentItem.ElementDOM).dialog("open");
        for (var i = 0 ; i < event_onOpen.length ; i++) {
            event_onOpen[i]();
        }
    };
    //==========================================================================================
    // Eventos de Widgets ==============================
    var
        event_onDispose = [],
        event_onClose = [],
        event_onOpen = [];
    Object.defineProperties(obj_currentItem, {
        "OnDestroy": { get: function () { return event_onDispose; }, set: function (param_VALUE) { event_onDispose.push(param_VALUE); } },
        "OnClose": { get: function () { return event_onClose; }, set: function (param_VALUE) { event_onClose.push(param_VALUE); } },
        "OnOpen": { get: function () { return event_onOpen; }, set: function (param_VALUE) { event_onOpen.push(param_VALUE); } },
    });
    //==========================================================================================
    //==========================================================================================
    function _CreateDialog() {
        $(obj_currentItem.ElementDOM).dialog({
            autoOpen: false,
            closeOnEscape: true,
            draggable: false,
            resizable: false,
            modal: true,
            title: property_title,
            show: { effect: "fade", duration: 400 },
            hide: { effect: "fade", duration: 400 },
            buttons: {
                Aceptar: function () { obj_currentItem.Close(true) },
                Cancelar: function () { obj_currentItem.Close(false) }
            },
            close: function () {
                for (var i = 0 ; i < event_onClose.length ; i++) {
                    event_onClose[i]( property_value );
                }
                if (property_autoDispose) {
                    obj_currentItem.Dipose();
                }
            }
        });
        $(obj_currentItem.ElementDOM)
            .addClass("text-center")
            .append(function () {
                var elementDIV_TextContainer = document.createElement("div");
                $(elementDIV_TextContainer)
                    .attr("data-role","textContainer")
                    .append(property_text);
                return elementDIV_TextContainer;
            })
            .append(function () {
                var elementIMG_image = document.createElement("img");
                $(elementIMG_image)
                    .attr("data-role","picture")
                    .attr("src", property_image);
                return elementIMG_image;
            });
        if (typeof property_callBack == "function") {
            event_onClose.push(property_callBack);
        }
    }
    function __Init() {
        jsNorBase.apply(obj_currentItem, [{ DataType: WidgetTypeOptions.jsNorConfirm }]);
        property_title = param_Title ? param_Title : "";
        property_callBack = param_CallBack ? param_CallBack : null;
        property_image = param_Image ? param_Image : "";
        property_text = param_Text ? param_Text : "";
        property_status = param_Status ? param_Status : "";
        _CreateDialog();
    };
    __Init();
}
//==================================================================================================================
//==================================================================================================================
/**
*
* @class jsNorPrompt
* @constructor
* @param {String} param_Text     Texto que mostrara en el widgets
* @param {String} param_DefaultValue  Valor por Default que se mostra en el cuadro de texto
* @param {String} param_Title    Titulo que mostrara el widget
* @param {String} param_Image    Url de la Imagen que mostrara en el widget
* @param {String} param_Status   Status del widget , que especifica la paleta de colores predominantes
* @param {function} param_CallBack   funcion que llamara despues de cerrar el widget
*/
function jsNorPrompt(param_Text, param_DefaultValue , param_Title, param_Image, param_Status, param_CallBack) {
    var // Propieades del Widget          ==============================
        obj_currentItem = this,
        /**
        * Indica si el Widget se destruye cuando se cierra.
        * 
        * @property property_autoDispose
        * @type {boolean}
        * @default true
        */
        property_autoDispose = true,
        /**
        * Funcion que continuara despues de cerrar el widget.
        * 
        * @property property_callBack
        * @type {function}
        * @default null
        */
        property_callBack = null,
        /**
        * Url de la imagen que se mostrara dentro del elemento
        * 
        * @property property_image
        * @type {string}
        * @default ""
        */
        property_image = "",
        /**
        * Indicador del estado del widget .Si esta cerrrado o abierto
        * 
        * @property property_isOpen
        * @type {boolean}
        * @default false
        */
        property_isOpen = false,
        /**
        * Texto del contenido que se muestra en el centro del widget
        * 
        * @property property_text
        * @type {string}
        * @default ""
        */
        property_text = "",
        /**
        * Titulo del widget, se mostrara en la barra de titulo relativo al elemento
        * 
        * @property property_title
        * @type {string}
        * @default ""
        */
        property_title = "",
        /**
        * Status o paleta de colores del widget , hace enfasis en el proposito del elemento
        * 
        * @property property_status
        * @type {string}
        * @default ""
        */
        property_status = "",
        /**
        * Valor seleccionado por el usuario 
        * 
        * @property property_value
        * @type {string}
        * @default false
        */
        property_value = "";
    //==========================================================================================
    // Definicion de las propiedades ==============================
    var
        methodPrivate_autoDispose = function (param_Value) {
            property_autoDispose = param_Value;
        },
        methodPrivate_SetCallBack = function (param_Value) {
            property_callBack = param_Value;
        },
        methodPrivate_SetImage = function (param_Value) {
            property_image = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=picture]").attr("src", property_image);
        },
        methodPrivate_SetText = function (param_Value) {
            property_text = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=textContainer]").html(property_image);
        },
        methodPrivate_SetTitle = function (param_Value) {
            property_title = param_Value;
            $(obj_currentItem.ElementDOM).dialog("option", "title", property_title);
        },
        methodPrivate_SetStatus = function (param_Value) {
            property_status = param_Value;
        },
        methodPrivate_SetValue = function (param_Value) {
            property_value = param_Value;
            $(obj_currentItem.ElementDOM).find("[data-role=inputValue]").val(property_value);
        };

    Object.defineProperties(obj_currentItem, {
        "AutoDispose"   : { get: function () { return property_autoDispose; }, set: methodPrivate_autoDispose },
        "Callback"      : { get: function () { return property_callBack; }, set: methodPrivate_SetCallBack },
        "Image"         : { get: function () { return property_image; }, set: methodPrivate_SetImage },
        "IsOpen"        : { get: function () { return property_isOpen; } },
        "Title"         : { get: function () { return property_title; }, set: methodPrivate_SetTitle },
        "Text"          : { get: function () { return property_text; }, set: methodPrivate_SetText },
        "Status"        : { get: function () { return property_status; }, set: methodPrivate_SetStatus },
        "Value"         : { get: function () { return property_value; }, set: methodPrivate_SetValue }
    });
    //==========================================================================================
    // Metodos de Widgets ==============================
    /**
    * Cierra el widget. Este recibe la decision del usuario al haber cerrado el widget
    *
    * @method Close
    * @param {boolean} param_RESULT resultado de haber cerrado el widget
    * @return {void} 
    */
    obj_currentItem.Close = function () {
        property_isOpen = false;
        if ($(obj_currentItem.ElementDOM).dialog("instance")) {
            $(obj_currentItem.ElementDOM).dialog("close");
        }
    };
    /**
    * Destruye el widget y elimina el elemento HTML del documento
    *
    * @method Dipose
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Dipose = function () {
        if (property_isOpen) {
            $(obj_currentItem.ElementDOM).dialog("close");
        }
        if ($(obj_currentItem.ElementDOM).dialog("instance")) {
            $(obj_currentItem.ElementDOM).dialog("destroy");
        }
        $(obj_currentItem.ElementDOM).remove();
        delete obj_currentItem;

        for (var i = 0 ; i < event_onDispose.length ; i++) {
            event_onDispose[i]();
        }
    };
    /**
    * Abre el widget
    *
    * @method Open
    * @param {void} 
    * @return {void} 
    */
    obj_currentItem.Open = function () {
        property_isOpen = true;
        $(obj_currentItem.ElementDOM).dialog("open");
        for (var i = 0 ; i < event_onOpen.length ; i++) {
            event_onOpen[i]();
        }
    };
    //==========================================================================================
    // Eventos de Widgets ==============================
    var
        event_onDispose = [],
        event_onClose = [],
        event_onOpen = [];
    Object.defineProperties(obj_currentItem, {
        "OnDestroy": { get: function () { return event_onDispose; }, set: function (param_VALUE) { event_onDispose.push(param_VALUE); } },
        "OnClose": { get: function () { return event_onClose; }, set: function (param_VALUE) { event_onClose.push(param_VALUE); } },
        "OnOpen": { get: function () { return event_onOpen; }, set: function (param_VALUE) { event_onOpen.push(param_VALUE); } },
    });
    //==========================================================================================
    //==========================================================================================
    function _CreateDialog() {
        $(obj_currentItem.ElementDOM).dialog({
            autoOpen: false,
            closeOnEscape: true,
            draggable: false,
            resizable: false,
            modal: true,
            title: property_title,
            show: { effect: "fade", duration: 400 },
            hide: { effect: "fade", duration: 400 },
            buttons: {
                Aceptar: function () { obj_currentItem.Close() },
                Cancelar: function () { property_value = null; obj_currentItem.Close() }
            },
            open: function () {
                $(obj_currentItem.ElementDOM).find("[data-role=inputValue]:text").focus(function () { $(this).select(); });
            },
            close: function () {
                for (var i = 0 ; i < event_onClose.length ; i++) {
                    event_onClose[i](property_value);
                }
                if (property_autoDispose) {
                    obj_currentItem.Dipose();
                }
            }
        });
        $(obj_currentItem.ElementDOM)
            .addClass("text-center")
            .append(function () {
                var elementDIV_TextContainer = document.createElement("div");
                $(elementDIV_TextContainer)
                    .attr("data-role","textContainer")
                    .append(property_text);
                return elementDIV_TextContainer;
            })
            .append(function () {
                var elementIMG_image = document.createElement("img");
                $(elementIMG_image)
                    .attr("data-role","picture")
                    .attr("src", property_image);
                return elementIMG_image;
            })
            .append(function () {
                var elementINPUT_Value = document.createElement("input");
                $(elementINPUT_Value)
                    .css({"background-color":"rgba(255,255,255,0.5)"})
                    .attr("data-role", "inputValue")
                    .attr("type", "text")
                    .val(property_value)
                    .change(function () {
                        property_value = $(this).val();
                    });
                return elementINPUT_Value;
            }); 
        if (typeof property_callBack == "function") {
            event_onClose.push(property_callBack);
        }
    }
    function __Init() {
        jsNorBase.apply(obj_currentItem, [{ DataType: WidgetTypeOptions.jsNorPrompt }]);
        property_title = param_Title ? param_Title : "";
        property_callBack = param_CallBack ? param_CallBack : null;
        property_image = param_Image ? param_Image : "";
        property_text = param_Text ? param_Text : "";
        property_status = param_Status ? param_Status : "";
        property_value = param_DefaultValue;
        _CreateDialog();
    };
    __Init();
}
//----------------------------------------------------
//-     Contructor de controles para la interfaz de usuario
//----------------------------------------------------
function jsNorControlBuilder( p_ControlName , p_ControlType , p_ControlValue , p_ControlCallBack , p_ControlConfiguration ){
  var
    m_currentItem = this ,
    m_elementDOM  = null ,
    m_id          = ""   ,
    m_config      = {}   ,
    m_ControllerType    = ControllerTypesOptions.UNKNOW  ,
    m_editable    = true ,
    m_grid        = null ,
    m_input       = null ,
    m_name        = ""   ,
    m_text        = ""   ,
    m_value       = ""   ;
  var
    e_onCompleted =  []   ,
    e_onChange    = []  ;
  Object.defineProperties( m_currentItem , {
    "ElementDOM"  :{ get: function( ){ return m_elementDOM; } },
    "ID"          :{ get: function( ){ return m_id;         } },
    "Configuration":{
      get: function( ){ return m_config; },
      set : function( pAttributeValue ){
        m_config = pAttributeValue;
      }
    },
    "OptionsValues":{
      get: function( ){ return m_config.OptionsValues; },
      set : function( pAttributeValue ){
        m_config.OptionsValues = pAttributeValue;
         $( m_elementDOM ).find("#"+ m_name ).empty();
         $( m_elementDOM ).find("#"+ m_name ).append( _CreateSelectControl( pAttributeValue ));
      }
    },
    "ControllerType"    :{ get: function( ){ return m_ControllerType;   } },
    "Editable"        :{ get: function( ){ return m_editable;       },
      set : function( pAttributeValue ){
        m_editable = pAttributeValue;
        switch( m_ControllerType ){
            case ControllerTypesOptions.Int           :// Entero
            case ControllerTypesOptions.Text          :// Texto
            case ControllerTypesOptions.String        :// Cadena
            case ControllerTypesOptions.Binary        :// Checkbox
            case ControllerTypesOptions.Image         :// Imagen
            case ControllerTypesOptions.Money         :// Moneda
            case ControllerTypesOptions.Date          :// Fecha
            case ControllerTypesOptions.Autocomplete          :// Enlance
            case ControllerTypesOptions.Float         :// Decimal
            case ControllerTypesOptions.File          :// File
            case ControllerTypesOptions.BinaryRadio   :// BinarioRadio
            case ControllerTypesOptions.Select        :// Select
            case ControllerTypesOptions.Password      :// Password
            case ControllerTypesOptions.SelectIcon :// SelectIcon
            {
                if( !m_editable ){
                    $( m_elementDOM ).find("#"+ m_name ).attr("readonly", true);
                }
                else{
                    $( m_elementDOM ).find("#"+ m_name ).removeAttr("readonly");
                }
            }break;
            case ControllerTypesOptions.Autocomplete          :{// Link
                $( m_elementDOM ).autocomplete( "option", "disabled", !m_editable );
            }break;
            case ControllerTypesOptions.Ranking       :{ // Ranking
                $( m_elementDOM ).find("#"+ m_name +"_SLIDE").slider( "option", "disabled", !m_editable );
            }break;
            case ControllerTypesOptions.Grid          :{// Grid
            }break;
        }
      }
    },
    "Input"       :{ get: function( ){ return m_input;      } },
    "Name"        :{ get: function( ){ return m_name;       },
      set : function( pAttributeValue ){
        m_name = pAttributeValue;
        $(m_input).attr("name", m_name );
      }
    },
    "Text"       :{ get: function( ){ return m_text;        } },
    "Value"       :{ get: function( ){ return m_value;      },
      set : function( pAttributeValue ){
        m_value = pAttributeValue;
        _ReadValue();
      }
    }
  });
  Object.defineProperties( m_currentItem , {
        "OnCompleted"  :{ 
            get: function( ){ return e_onCompleted; },
            set : function( pAttributeEvent ){
                e_onCompleted.push( pAttributeEvent );
            }
        },
        "OnChange"  :{ 
            get: function( ){ return e_onChange; },
            set : function( pAttributeEvent ){
                if( typeof pAttributeEvent == "function" ){
                    e_onChange.push( pAttributeEvent );
                }
                else if( pAttributeEvent && pAttributeEvent.constructor.name == "Array" ){
                    e_onChange = e_onChange.concat( pAttributeEvent );
                }
            }
        },
  });
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  var _Completed = function( data ){
    switch( m_ControllerType ){
      case ControllerTypesOptions.Int           :// Entero
      case ControllerTypesOptions.Text          :// Texto
      case ControllerTypesOptions.Int.String    :// Cadena
      case ControllerTypesOptions.Money         :// Moneda
      case ControllerTypesOptions.Date          :// Fecha
      case ControllerTypesOptions.Float         ://Decimal
      case ControllerTypesOptions.Binary        :// checkbox
      case ControllerTypesOptions.Image         ://Imagen
      case ControllerTypesOptions.DateTime      :{ /* Hora y Fecha */}break;
      case 9:{ /* Hora y Fecha */}break;
      case 10:{// Link
      }break;
      case 11:{// Enlace
      }break;
      case ControllerTypesOptions.Ranking       :{// Ranking
      }break;
      case ControllerTypesOptions.File          :{// File
      }break;
      case 16:{ /* Rango Fechas */}break;
      case 17:{ /* Rango Entero */}break;
      case ControllerTypesOptions.BinaryRadio   :{// BinarioRadio
      }break;
      case ControllerTypesOptions.Grid          :{// Grid
      }break;
      case ControllerTypesOptions.SelectIcon    ://Select
      case ControllerTypesOptions.Select        :{//Select
        var array_options = $( m_elementDOM ).find("#"+ m_name ).find("option");
        m_config.OptionsValues = {};
        m_config.OptionsComplements = {};
        
        for( i = 0 ; i < array_options.length ; i++ ){
          var l_propertyName = $(array_options[i]).attr("value");
          m_config.OptionsValues[ l_propertyName != undefined ? l_propertyName : i ] = $(array_options[i]).html();
          if( $(array_options[i]).attr("data-JSON") ){
            m_config.OptionsComplements[ l_propertyName != undefined ? l_propertyName : i ] = JSON.parse( $(array_options[i]).attr("data-JSON") );
          }
          
          if( m_value != undefined && m_value != null && ( m_text == null || m_text == undefined)){
              if( l_propertyName == m_value ){
                  m_text = $(array_options[i]).html();
              }
          }
        }
      }break;
      case ControllerTypesOptions.Grid      :{// Grid
      }break;
    }

    for( var i = 0; i < e_onCompleted.length ; i++){
      e_onCompleted[i]( m_currentItem , data );
    }
  };
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  /* funcion que elimina el elemento con todos sus componentes */
  this.Dispose = function(){
    switch( m_ControllerType ){
      case ControllerTypesOptions.Int           :// Entero
      case ControllerTypesOptions.Text          :// Texto
      case ControllerTypesOptions.String        :// Cadena
      case ControllerTypesOptions.Binary        :// Checkbox
      case ControllerTypesOptions.Image         :// Imagen
      case ControllerTypesOptions.Money         :// Moneda
      case ControllerTypesOptions.Date          :// Fecha
      case ControllerTypesOptions.Float         :// Decimal
      case ControllerTypesOptions.File          :// File
      case ControllerTypesOptions.BinaryRadio   :// BinarioRadio
      case ControllerTypesOptions.Select        :// Select
      case ControllerTypesOptions.SelectIcon    :// SelectIcon
      case ControllerTypesOptions.Password      :// Password
      {
        $( m_elementDOM ).empty();
        $( m_elementDOM ).remove();
      }break;
      case ControllerTypesOptions.Autocomplete          :{// Link
        $( m_elementDOM ).autocomplete("destroy");
        $( m_elementDOM ).empty();
        $( m_elementDOM ).remove();
      }break;
      case ControllerTypesOptions.Ranking       :{ // Ranking
        $( m_elementDOM ).find("#"+ m_name +"_SLIDE").slider("destroy" );
        $( m_elementDOM ).empty();
        $( m_elementDOM ).remove();
      }break;
      case ControllerTypesOptions.Grid          :{// Grid
        m_grid.Clear();
      }break;
    }
  };
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  /* Limpia el contendo del control */
  this.Clear = function(){
    switch( m_ControllerType ){
      case ControllerTypesOptions.Int           :// Entero
      case ControllerTypesOptions.Text          :// Texto
      case ControllerTypesOptions.String        :// Cadena
      case ControllerTypesOptions.Money         :// Moneda
      case ControllerTypesOptions.Date          :// Fecha
      case ControllerTypesOptions.Float         ://Decimal
      case ControllerTypesOptions.Password      ://Password
      {
        $( m_elementDOM ).find("#"+ m_name ).val( "" );
      }
      break;
      case ControllerTypesOptions.Binary        :{ // checkbox
        $( m_elementDOM ).find("#"+ m_name ).get(0).checked = false ;
      }break;
      case ControllerTypesOptions.Image         :{//Imagen
        $( m_elementDOM ).find("#"+ m_name ).val( "" );
        $( m_elementDOM ).find("[data-reference="+m_id+"]").css("background-image","");
      }break;
      case 8:{ /* Hora y Fecha */}break;
      case 9:{ /* Hora y Fecha */}break;
      case ControllerTypesOptions.Autocomplete          :{// Link
        $( m_elementDOM ).find("#"+ m_name ).attr("data-value"	, "" );
        $( m_elementDOM ).find("#"+ m_name ).attr("data-text"	, "" );
        $( m_elementDOM ).find("#"+ m_name ).val( ""  );
      }break;
      case ControllerTypesOptions.Ranking       :{ // Ranking
        $( m_elementDOM ).find("#"+ m_name ).val( "" );
        $( m_elementDOM ).find("#"+ m_name +"_SLIDE").slider("value", "0" );
      }break;
      case ControllerTypesOptions.File          :{// File
      }break;
      case ControllerTypesOptions.SelectIcon     :
      case ControllerTypesOptions.Select        :{
          var elementOPTION =  $( m_elementDOM ).find("#"+ m_name ).html();
          $( m_elementDOM ).find("#"+ m_name ).empty();
          $( m_elementDOM ).find("#"+ m_name ).append( elementOPTION );
      }break;
      case 16:{ /* Rango Fechas */}break;
      case 17:{ /* Rango Entero */}break;
      case ControllerTypesOptions.BinaryRadio   :{// BinarioRadio
        $( m_elementDOM ).find("[value="+ m_value +"]").get(0).checked = false;
      }break;
      case ControllerTypesOptions.Grid          :{// Grid
        m_grid.Clear();
      }break;
    }
  };
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  /* funcion que lee y coloca el valor al elemento */
  var _ReadValue = function( ){
      debugger;
    switch( m_ControllerType ){
      case ControllerTypesOptions.Int           :// Entero
      case ControllerTypesOptions.Text          :// Texto
      case ControllerTypesOptions.String        :// Cadena
      case ControllerTypesOptions.Money         :// Moneda
      case ControllerTypesOptions.Date          :// Fecha
      case ControllerTypesOptions.Float         ://Decimal
      case ControllerTypesOptions.Password      ://Password
      {
        $( m_elementDOM ).find("#"+ m_name ).val( m_value );
        
      }break;
      case ControllerTypesOptions.Binary        :{// checkbox
        $( m_elementDOM ).find("#"+ m_name ).get(0).checked = m_value == true || m_value == 'Y' || m_value == 'on' || parseInt(m_value) ;
        
      }break;
      case ControllerTypesOptions.Image         :{//Imagen
    	if( !m_value ){
            return;
        }
        $( m_elementDOM ).find("#"+ m_name ).val( m_value );
        if(m_value.indexOf("data:image") == 0){
          $( m_elementDOM ).find("div[data-reference="+m_id+"]").css("background-image","url("+m_value+")");
        }
        else{
          $( m_elementDOM ).find("div[data-reference="+m_id+"]").css("background-image","url('"+m_value+"')");
        }
      }break;
      case ControllerTypesOptions.DateTime      :{ /* Hora y Fecha */}break;
      case ControllerTypesOptions.Autocomplete          :{// Link
        if( m_value && m_value.Text ){
            $( m_elementDOM ).find("#"+ m_name ).attr("data-value"	, m_value.Value );
            $( m_elementDOM ).find("#"+ m_name ).attr("data-text"	, m_value.Text );
            $( m_elementDOM ).find("#"+ m_name ).val( m_value.Text  );
        }
        else{
            $( m_elementDOM ).find("#"+ m_name ).val( m_value );
        }
      }break;
      case 11:{// Enlace
        $( m_elementDOM ).find("#FK"+ m_name ).val( m_value );
      }break;
      case 13:{ // Ranking
        $( m_elementDOM ).find("#"+ m_name ).val( m_value );
        $( m_elementDOM ).find("#"+ m_name +"_SLIDE").slider("value", m_value );
      }break;
      case ControllerTypesOptions.File          :{// File
      }break;
      case ControllerTypesOptions.DateRange     :{ /* Rango Fechas */}break;
      case 17:{ /* Rango Entero */}break;
      case ControllerTypesOptions.BinaryRadio   :{// BinarioRadio
        $( m_elementDOM ).find("[value="+ m_value +"]").get(0).checked = true;
      }break;
      case ControllerTypesOptions.Grid          :{// Grid
        m_grid.Data = m_value;
        m_grid.Refresh();
      }break;
      case ControllerTypesOptions.SelectIcon        :
      case ControllerTypesOptions.Select        :{//Select
        $( m_elementDOM ).find("#"+ m_name ).val( m_value );
        var elementFIXED_SPACE = $( m_elementDOM ).find("#"+ m_name ).find("option");
        for( var i = 0 ; i < elementFIXED_SPACE.length ;i++ ){
            if( $(elementFIXED_SPACE[i]).attr("value") == m_value ){
                m_text = $(elementFIXED_SPACE[i]).html();
            }
        }
      }break;
    }
  };
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  var __AjaxSendRequest = function( p_UrlAction,  p_MethodType , p_DataRequest , p_AjaxCallBack ){
    Ajax_ServerRequest( p_UrlAction,  p_MethodType , p_DataRequest , p_AjaxCallBack );
  }
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  var _CreateSelectControl = function( p_Options ){
    if( !JSON.isJSON( p_Options ) && !(p_Options.constructor === Array) )
      return p_Options;
    if( JSON.isJSON( p_Options ) ){
      p_Options = JSON.parse( p_Options );
    }
    var array_options = [];
        array_options.push("<option data-class='' value='-1000000' disabled selected > --- Seleccione un valor ---</option>");
    for( var i = 0; i < p_Options.length ; i++ ){
      var selectVALUE = "";
      var selectTEXT  = "";
      var dataClass = "";
      if( p_Options[i].Class ){
          dataClass = p_Options[i].Class;
      }
      
      if( p_Options[i].Text ){
        selectVALUE = p_Options[i].Value ;
        selectTEXT  = p_Options[i].Text  ;
      }
      else{
        selectVALUE = selectTEXT = p_Options[i] ;
      }

      if( !selectVALUE ){
        selectVALUE = selectTEXT;
      }
      if( selectVALUE == m_value ){
        array_options.push("<option data-class='"+dataClass+"' value='"+(selectVALUE)+"' data-JSON='"+JSON.stringify(p_Options[i])+"' selected >"+selectTEXT+"</option>");
      }
      else{
        array_options.push("<option data-class='"+dataClass+"' value='"+(selectVALUE)+"' data-JSON='"+JSON.stringify(p_Options[i])+"'>"+selectTEXT+"</option>");
      }
      m_text = selectTEXT;
    }
    return array_options;
  };
  //================================================================================================================================================
  //================================================================================================================================================
  //================================================================================================================================================
  /* inicializa la configuracion del componente */
  var __Init = function( data ){
    if( !p_ControlConfiguration ){
        p_ControlConfiguration = {};
    }
    m_elementDOM  = p_ControlConfiguration.Element ? p_ControlConfiguration.Element : document.createElement("div");
    m_id = __GetKey( 5 ,"ControlBuilder" );
    m_name        = p_ControlName;
    m_ControllerType    = parseInt( p_ControlType );
    m_value       = p_ControlValue;
    if( p_ControlCallBack && typeof p_ControlCallBack == "function" ){
        e_onChange.push( p_ControlCallBack );
    }
    
    $(m_elementDOM)
        .attr("id", m_id )
        .css({
            "float":"left",
            "width":"100%",
            "padding-left":"15px"
        });
    if( p_ControlConfiguration ){
      if( p_ControlConfiguration.OnCompleted ){
        m_currentItem.OnCompleted = p_ControlConfiguration.OnCompleted;
      }
      if( p_ControlConfiguration.OnChange ){
        m_currentItem.OnChange = p_ControlConfiguration.OnChange;
      }
      if( p_ControlConfiguration.Width ){
        $(m_elementDOM).css({
            "width": p_ControlConfiguration.Width
        });
      }
      if( p_ControlConfiguration.MarginLeft ){
        $(m_elementDOM).css({
            "margin-left": p_ControlConfiguration.MarginLeft
        });
      }
      if( p_ControlConfiguration.MarginRight ){
        $(m_elementDOM).css({
            "margin-right": p_ControlConfiguration.MarginRight
        });
      }
    }
    switch ( m_ControllerType ){
      case ControllerTypesOptions.Int   :{ // Entero
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","Entero")
              .attr("data-reference", m_id )
              .attr("type","number")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .keydown(function (e) {
                  if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
                      return;
                  }
                  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault();
                  }
              })
              .change(function(){
                m_value= $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( m_value );
            return elementINPUT;
          });
      }break;
      case ControllerTypesOptions.Text  :{ // Texto
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("textarea");
            $(elementINPUT)
              .attr("data-type","Texto")
              .attr("data-reference", m_id )
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .change(function(){
                m_value = $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( m_value );
            return elementINPUT;
          });
      }break;
      case ControllerTypesOptions.String    :{ // Cadena
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","Cadena")
              .attr("data-reference", m_id )
              .attr("type","text")
              .attr("maxlength","200")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .change(function(){
                m_value= $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( m_value );
            return elementINPUT;
          });
      }break;
      case ControllerTypesOptions.Binary    :{ // Checkbox
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","checkbox")
              .attr("data-reference", m_id )
              .attr("type","checkbox")
              .attr("maxlength","200")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .change(function(){
                m_value = $(this).get(0).checked;
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .get(0).checked = m_value ;
            return elementINPUT;
          });
      }break;
      case ControllerTypesOptions.Image     :{ // Image
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","Image")
              .attr("data-reference", m_id )
              .attr("type","hidden")
              .attr("name", m_name )
              .attr("id", m_name )
              .val( m_value );
            return elementINPUT;
          })
          .append(function(){
            var elementIMAGE = document.createElement("div");
            $(elementIMAGE)
              .attr("data-reference", m_id )
              .css({
                "width"					: "120px",
                "height"				:	"120px",
                "border"				: "3px lightgray dashed",
                "border-radius"			: "5px",
                "background-repeat"		: "no-repeat",
                "background-position"	: "center" ,
                "background-size"		: "contain"
              });
            $(elementIMAGE)
              .get(0).addEventListener('dragover', handleDragOver , false);
            $(elementIMAGE)
              .get(0).addEventListener('drop'    ,
                function( event ){
                  handleFileSelect( event , function(  container , fileName , fileSource , fileType ){
                  m_value = fileSource;
                    for( var i = 0 ;  i < e_onChange.length ; i++){
                        e_onChange[i]( $(m_elementDOM).find("input").attr("name") , m_value , m_currentItem );
                    }
                  $(m_elementDOM).find("input").val( fileSource);
                  $(m_elementDOM).find("div").css({ "background-image":"url("+fileSource+")"});
              });
            }, false);
            return elementIMAGE;
          });
      }break;
      case ControllerTypesOptions.Money :{ // Moneda
        $( m_elementDOM )
        .append(function(){
            var elementDIV_fixed = document.createElement("div");
            $( elementDIV_fixed )
                .addClass("input-group")
                .append("<span class='input-group-addon'>$</span>")
                .append(function(){
                    var elementINPUT = document.createElement("input");
                    $(elementINPUT)
                    .attr("data-type","Moneda")
                    .attr("data-reference", m_id )
                    .attr("type","number")
                    .attr("name", m_name )
                    .attr("id", m_name )
                    .addClass("form-control")
                    .keydown(function (e) {
                        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
                            return;
                        }
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                        }
                    })
                    .change(function(){
                        m_value= $(this).val();
                        for( var i = 0 ;  i < e_onChange.length ; i++){
                            e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                        }
                    })
                    .val( m_value );
                    return elementINPUT;
                });
            return elementDIV_fixed;
        });
      }break;
      case ControllerTypesOptions.Date  :{ // Fecha
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","Fecha")
              .attr("data-reference", m_id )
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .change(function(){
                m_value= $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( m_value )
              .datepicker( { dateFormat :"yy-mm-dd"});
            return elementINPUT;
          });
      }break;
      case 8:{ /* Hora y Fecha */}break;
      case 9:{ /* Hora */}break;
      case ControllerTypesOptions.Autocomplete  :{// Autocomplete
        $( m_elementDOM )
          .addClass("input-group")
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
                .attr("data-type","Autocomplete")
                .attr("data-reference", m_id )
                .attr("name", m_name )
                .attr("id", m_name )
                .attr("data-value"	, m_value ? m_value.Value : m_value )
                .attr("data-text"	,  m_value ? m_value.Text : m_value )
                .addClass("form-control")
                .val( m_value ? m_value.Text : m_value )
              .autocomplete({
                source: function( request, response ) {
                    if( p_ControlConfiguration.Request ){
                        p_ControlConfiguration.Request.PARAMS[ p_ControlConfiguration.Request.KeyName ] = request.term.encodeURI();
                        __AjaxSendRequest(
                            p_ControlConfiguration.Request.URL,
                            p_ControlConfiguration.Request.METHOD ,
                            p_ControlConfiguration.Request.PARAMS ,
                            function( data ){
                                m_config.OptionsValues = JSON.parse( data );
                                response( JSON.parse( data ) );
                            }
                        );
                    }
                    else{
                        return p_ControlConfiguration.Options;
                    }
                },
                position: { my : "left top", at: "left bottom" },
                minLength: 3,
                select: function( event, ui ) {
                  $(this).val( ui.item.Text );
                  $(this).attr("data-value", ui.item.Data );
                  $(this).attr("data-text", ui.item.Text );
                  m_value = { "Text" : ui.item.Text , "Data" : ui.item.Data  , "Sender" : ui.item };
                  m_config.OptionsComplements = ui.item ;
                    for( var i = 0 ;  i < e_onChange.length ; i++){
                        e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                    }
                  return false;
                }
              })
              .autocomplete( "instance" )._renderItem = function( ul, item ) {
                return $( "<li>" ).append( "<a>" + item.Text + "</a>" ).appendTo( ul );
              };
            return elementINPUT;
          });
      }break;
      case ControllerTypesOptions.Float :{ // Decimal
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","Decimal")
              .attr("data-reference", m_id )
              .attr("type","number")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .keydown(function (e) {
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
              })
              .change(function(){
                  if( isNaN( parseInt( $(this).val() )) ){
                      $(this).val( m_value );
                      return;
                  }
                m_value= $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( m_value );
            return elementINPUT;
          });
      }break;
      case ControllerTypesOptions.Ranking       :{ // Ranking
        $(m_elementDOM)
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","Ranking")
              .attr("data-reference", m_id )
              .attr("type","hidden")
              .attr("name", m_name )
              .attr("id", m_name );
            return elementINPUT;
          })
          .append(function(){
            var elementDIV_SLIDE = document.createElement("div");
            $(elementDIV_SLIDE)
              .attr("name",m_name+"_SLIDE")
              .attr("id",m_name+"_SLIDE")
              .slider({
                value : m_value,
                min: 0,
                max: 5,
                range : "min",
                step: 1,
                change: function (event, ui ) {
                  var itemParent = $(this).parent();
                  $("#" + $(itemParent).attr("data-field")).val( ui.value );
                  $("#" + $(itemParent).attr("data-field") + "_SHOW").empty();
                  for (var index = 0; index < ui.value ; index++) {
                      $("#" + $(itemParent).attr("data-field") + "_SHOW").append("<i style='color: rgb(255, 186, 0);' class='uk-icon-star'></i>")
                  }
                  m_value = ui.value;
                  $(itemParent).find("input").val( m_value );
                    for( var i = 0 ;  i < e_onChange.length ; i++){
                        e_onChange[i]( $(itemParent).find("input").attr("name") , m_value , m_currentItem );
                    }
                }
            });
            return elementDIV_SLIDE;
          })
          .append(function(){
            var elementDIV_SHOW = document.createElement("div");
            $(elementDIV_SHOW)
              .attr("name",m_name+"_SHOW")
              .attr("id",m_name+"_SHOW");
            return elementDIV_SHOW;
          });
      }break;
      case ControllerTypesOptions.File      :{// File
        $( m_elementDOM )
          .addClass("input-group")
          .append("<span class='input-group-addon glyphicon glyphicon-cloud-upload'></span>")
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","File")
              .attr("data-reference", m_id )
              .attr("type","hidden")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .val( m_value );
            return elementINPUT;
          })
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","File")
              .attr("data-reference", m_id )
              .attr("type","file")
              .get(0).addEventListener('change'    ,
                function( event ){
                  var sender = this;
                  $(sender).parent().find("span").css("color","rgb(200,100,100)");
                  readSingleFile( event , function( fileSource ){
                    $(sender).parent().find("span").css("color","rgb(100,200,100)");
                    $(sender).parent().find("input[type=hidden]").val( fileSource );
                    m_value = fileSource ;
                    for( var i = 0 ;  i < e_onChange.length ; i++){
                        e_onChange[i]( $(sender).parent().find("input[type=hidden]").attr("name") , m_value , m_currentItem );
                    }
                  });
                }, false);
            return elementINPUT;
          });
      }break;
      case 15:{ /* Multiple */}break;
      case 16:{ /* Rango Fechas */}break;
      case 17:{ /* Rango Entero */}break;
      case ControllerTypesOptions.BinaryRadio   :{// BinarioRadio
        $( m_elementDOM )
          .append("<span>Si </span>")
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","BinarioRadio")
              .attr("data-reference", m_id )
              .attr("type","radio")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .click(function(){
                m_value = $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( 'Y' )
              .get(0).checked = m_value == 'Y';
            return elementINPUT;
          })
          .append("<span> / </span>")
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type","BinarioRadio")
              .attr("data-reference", m_id )
              .attr("type","radio")
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              .click(function(){
                m_value = $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( 'N' )
              .get(0).checked = m_value == 'N';
            return elementINPUT;
          })
          .append("<span>No</span>");
      }break;
      case ControllerTypesOptions.Grid          :{// Grid
        setTimeout(function(){
          p_ControlConfiguration["Container"] = m_elementDOM ;
          p_ControlConfiguration["OnUpdate"] = function( senderGrid , args ){
            m_value = senderGrid.Data;
            for( var i = 0 ;  i < e_onChange.length ; i++){
                e_onChange[i]( m_name , m_value  , m_currentItem );
            }
          }

          m_grid = new jsNorGrid( p_ControlConfiguration );
        },100);
      }break;
      case ControllerTypesOptions.SelectIcon        :{// Select
        $( m_elementDOM )
          .append(function(){
            var elementSELECT_Icon = document.createElement("select");
            $(elementSELECT_Icon)
              .attr("data-type","select")
              .attr("data-reference", m_id )
              .attr("name", m_name )
              .attr("id", m_name )
              .addClass("form-control")
              setTimeout(function(){ 
                $( elementSELECT_Icon ).iconselectmenu({
                        change : function(){
                            m_value = $(this).val();
                            var elementFIXED_SPACE = $( this ).find("#"+ m_name ).find("option");
                            for( var i = 0 ; i < elementFIXED_SPACE.length ;i++ ){
                                if( $(elementFIXED_SPACE[i]).attr("value") == m_value ){
                                    m_text = $(elementFIXED_SPACE[i]).html();
                                }
                            }
                            for( var i = 0 ;  i < e_onChange.length ; i++){
                                e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                            }
                        }
                    });
                    $(m_elementDOM).find(".ui-selectmenu-button").css({
                        "width": "85%",
                        "float": "left",
                        "border-top-right-radius":"0px",
                        "border-bottom-right-radius":" 0px",
                        "background":" rgb(255, 255, 255)",
                        "height":"34px"
                    });
                },100);
              
              
              if( p_ControlConfiguration.constructor === Array){
                $(elementSELECT_Icon).append( _CreateSelectControl( p_ControlConfiguration ));
                _Completed( this );
              }
              else if( p_ControlConfiguration.OptionsValues ){
                $(elementSELECT_Icon).append( _CreateSelectControl( p_ControlConfiguration.OptionsValues ));
                _Completed( this );
              }
              else if( p_ControlConfiguration.Request ){
                __AjaxSendRequest(
                  p_ControlConfiguration.Request.URL,
                  p_ControlConfiguration.Request.METHOD ,
                  p_ControlConfiguration.Request.PARAMS ,
                  function( data ){
                    $(elementSELECT_Icon).append( _CreateSelectControl( data ));
                    if( m_value ){
                      $( m_elementDOM ).find("#"+ m_name ).val( m_value );
                      m_text = $(elementSELECT_Icon).find("option[value="+m_value+"]").html();
                    }
                    _Completed( this );
                  });
              }
            return elementSELECT_Icon;
          })
          .append(function(){
              var elementBUTTON_Clear = document.createElement("button");
              $(elementBUTTON_Clear)
                .addClass("btn btn-default")
                .css({
                    "float":"left",
                    "width":"15%",
                    "border-top-left-radius": "0",
                    "border-bottom-left-radius": "0",
                    "height":"34px"
                })
                .append("<span class='glyphicon glyphicon-remove'></span>")
                .click(function(){
                    m_currentItem.Clear();
                    for( var i = 0 ;  i < e_onChange.length ; i++){
                        e_onChange[i]( m_name , null  , m_currentItem );
                    }
                });
              return elementBUTTON_Clear;
          });
      }break;
      case ControllerTypesOptions.Select        :{// Select
        $( m_elementDOM )
          .append(function(){
            var elementSELECT = document.createElement("select");
            $(elementSELECT)
              .attr("data-type","select")
              .attr("data-reference", m_id )
              .attr("name", m_name )
              .attr("id", m_name )
              .css({
                "width":"85%",
                "border-top-right-radius": "0",
                "border-bottom-right-radius": "0",
                "float":"left"
              })
              .addClass("form-control")
              .change( function(){

                m_value = $(this).val();
                var elementFIXED_SPACE = $( this ).find("#"+ m_name ).find("option");
                for( var i = 0 ; i < elementFIXED_SPACE.length ;i++ ){
                    if( $(elementFIXED_SPACE[i]).attr("value") == m_value ){
                        m_text = $(elementFIXED_SPACE[i]).html();
                    }
                }
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              });
              
              if( p_ControlConfiguration.constructor === Array){
                $(elementSELECT).append( _CreateSelectControl( p_ControlConfiguration ));
                _Completed( this );
              }
              else if( p_ControlConfiguration.Options ){
                $(elementSELECT).append( _CreateSelectControl( p_ControlConfiguration.Options ));
                _Completed( this );
              }
              else if( p_ControlConfiguration.Request ){
                __AjaxSendRequest(
                  p_ControlConfiguration.Request.URL,
                  p_ControlConfiguration.Request.METHOD ,
                  p_ControlConfiguration.Request.PARAMS ,
                  function( data ){
                    $(elementSELECT).append( _CreateSelectControl( data ));
                    if( m_value ){
                      $( m_elementDOM ).find("#"+ m_name ).val( m_value );
                      m_text = $(elementSELECT).find("option[value="+m_value+"]").html();
                    }
                    _Completed( this );
                  });
              }
            return elementSELECT;
          })
          .append(function(){
              var elementBUTTON_Clear = document.createElement("button");
              $(elementBUTTON_Clear)
                .addClass("btn btn-default")
                .css({
                    "float":"left",
                    "width":"15%",
                    "border-top-left-radius": "0",
                    "border-bottom-left-radius": "0",
                    "height":"34px"
                })
                .append("<span class='glyphicon glyphicon-remove'></span>")
                .click(function(){
                    m_currentItem.Clear();
                    for( var i = 0 ;  i < e_onChange.length ; i++){
                        e_onChange[i]( m_name , null  , m_currentItem );
                    }
                });
              return elementBUTTON_Clear;
          });
      }break;
      case ControllerTypesOptions.Password      :{ // Password
        $( m_elementDOM )
          .append(function(){
            var elementINPUT = document.createElement("input");
            $(elementINPUT)
              .attr("data-type"     , "Password")
              .attr("data-reference", m_id )
              .attr("type"          , "password")
              .attr("name"          , m_name )
              .attr("id"            , m_name )
              .addClass("form-control")
              .change(function(){
                m_value= $(this).val();
                for( var i = 0 ;  i < e_onChange.length ; i++){
                    e_onChange[i]( $(this).attr("name") , m_value  , m_currentItem );
                }
              })
              .val( m_value );
            return elementINPUT;
          });
      }break;
      default:
    }
  };
  __Init( m_currentItem );
}
//----------------------------------------------------
//-     Control de Peticiones Asincronas al Servidor
//----------------------------------------------------
function Ajax_ServerRequest( p_UrlAction,  p_MethodType , p_DataRequest , p_AjaxCallBack ){
  $.ajax({
     type : p_MethodType                         ,
     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
     url  : p_UrlAction ,
     data : { "Request" : btoa( JSON.stringify( p_DataRequest ).encodeURI() ) } , // serializes the form's elements.
     success: function( data ){
       var resultURI = null;
       try{
         resultURI = data.decodeURI();
       }
       catch(ex){
         resultURI = data;
       }
       if( JSON.isJSON( resultURI )){
         resultJSON = JSON.parse( resultURI );
         if( resultJSON.Error ){
           new jsNorAlert( resultJSON.MSG , "Error en Sistema ("+resultJSON.Error+")" ,"<span style='font-size:50px; color:red;' class='glyphicon glyphicon-ban-circle' ></span><br/>","", null);
         }
         else{
          if( p_AjaxCallBack ){
            p_AjaxCallBack( resultURI );
          }
         }
        return;
       }
       if( p_AjaxCallBack ){
         p_AjaxCallBack( data.decodeURI() );
       }
     }
   });
}
//==============================================================================
//=     Control de Peticiones Asincronas al Servidor
//==============================================================================
$(document).ready(function(){
  $("form").submit(function( event ) {
      if( $(this).attr("function") ){
        var formData = new FormData( this );// yourForm: form selector
        var formData = {};
        var functForm = $(this).attr("function");
        for( var index = 0; index < $(this).find("[name]").length;index++ ){
            var itemInput = $( $(this).find("[name]").get( index ) );
            formData[ itemInput.attr("name") ] = itemInput.val().encodeURI();
        }
        Ajax_ServerRequest( $(this).attr("action") , $(this).attr("method") , formData , function( data ){
            if( typeof window[functForm] == "function"){
                window[functForm]( data );
            }
        }); 
        event.preventDefault(); 
      }
  });
});
//==============================================================================
//=     Funciones Basicas para Sitio Administracion
//==============================================================================
window.Access = function( pRESULT ){
  if( JSON.isJSON( pRESULT ) ){
    var resultJSON = JSON.parse( pRESULT );
    if( resultJSON.length > 0 ){
      new jsNorAlert(
        " Bienvenido " + resultJSON[0].Nombre,
        "Sesion Iniciada",
        "<span style='color:green;' class='glyphicon glyphicon-ok' ></span>" ,
        "" , function(){
        window.location.reload();
      } ).Open();
      return;
    }
  }
  new jsNorAlert( "El usuario o contraseña es incorrecto", "Error", "<span style='font-size:50px; color:red;' class='glyphicon glyphicon-ban-circle' ></span><br/>" ,"" , null ).Open();
};
// =============================================================================
function fn_CreateKey( MaxLenght , Prefix ){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i <  MaxLenght ; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    if( Prefix )
      text = Prefix + "-" + text;
    return text;
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function handleFileSelect_Once( fileContent , container , p_callBack ) {
    reader = new FileReader();
    reader.onload = function(e) {
      var fileName = fileContent.name;
      var fileSource = this.result ;
      var fileType = fileContent.type;
      if( p_callBack )
        p_callBack( container , fileName , fileSource , fileType );
      return ;
    }
    reader.readAsDataURL( fileContent );
  }
function handleFileSelect( evt , p_callBack ) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        handleFileSelect_Once(f , this , p_callBack );
    }
}
function readSingleFile(e , p_callBack) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    if( p_callBack )
      p_callBack( contents );
  };
  reader.readAsText(file);
}
function readSingleFileDataUrl(e , p_callBack) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    if( p_callBack )
      p_callBack( contents );
  };
  reader.readAsDataURL(file);
}

function jsManagerController(){
	var
		Configuration = arguments[0],
		m_currentItem = this,
    m_elementDOM  = null,
    m_id          = "" ,
		m_container   = {} ,
		m_data        = [] ,
    m_method      = "" ,
    m_request     = "" ,
    m_type        = "" ,
    m_url         = "" ;
	var _CreateMenuItem = function( objectJSON ){
		var elementLI = document.createElement("li");
		$(elementLI)
			.append(function(){
				var elementA = document.createElement("a");
				$( elementA )
					.attr("href", objectJSON.Url )
					.html( objectJSON.Title );
        if(  objectJSON.Title.indexOf("<") != -1){
  				$( elementA ).css({"padding":"7px"})
        }
				return elementA;
			});
		return  elementLI;
	};
	var _CreateMenuIcon = function( objectJSON ){
		var elementLI = document.createElement("li");
		$(elementLI)
			.append(function(){
				var elementA = document.createElement("a");
				$( elementA )
					.attr("href", objectJSON.Url )
					.append("<i class='uk-icon-small uk-icon-"+objectJSON.Icon+"'></i>");
				return elementA;
			});
		return  elementLI;
	};
	var _CreateMenuImage = function( objectJSON ){
		var elementLI = document.createElement("li");
		$(elementLI)
			.append(function(){
				var elementIMG = document.createElement("img");
				$( elementIMG )
					.attr("src", objectJSON.Image )
					.css( {"width": objectJSON.width + "px","height": objectJSON.height+"px"} );
				return elementIMG;
			});
		return  elementLI;
	};
	var _CreateMenu = function( p_data , isSubMenu ){
		var elementUL = document.createElement("ul");
    if( isSubMenu ){
      $(elementUL)
        .addClass("dropdown-menu");
    }
    else{
      $(elementUL)
        .addClass("nav")
        .addClass("navbar-nav");
    }

		for( var i = 0; i < p_data.length ; i++){
			var menuItem = null;
			switch ( parseInt(p_data[i].ItemType)) {
				case 0:
					menuItem = _CreateMenuImage( p_data[i] );
				break;
				case 1:
					menuItem = _CreateMenuIcon( p_data[i] );
				break;
				case 2:
					menuItem = _CreateMenuItem( p_data[i] );
				break;
			}
      if( p_data[i].Pages && p_data[i].Pages.length > 0){
        $( menuItem )
          .addClass("dropdown")
          .find("a")
            .attr("data-toggle","dropdown")
            .attr("role","button")
            .attr("aria-haspopup",true)
            .attr("aria-expanded",false )
            .addClass("dropdown-toggle");
        $(menuItem)
          .append( _CreateMenu( p_data[i].Pages , true) );
      }
      if( p_data[i].Url ){
        var PageName = p_data[i].Url.split("/").reverse()[0];
  			if( window.location.pathname.indexOf( PageName ) != -1 ){
  				$(menuItem).addClass("active");
  			}
      }
			$(elementUL).append( menuItem );
		}
    return elementUL;
	};
  var _CreateHeader = function( ){
    var elementDIV = document.createElement("div");
    $(elementDIV)
      .addClass("navbar-header")
      .append(function(){
        var elementBUTTON = document.createElement("button");
        $(elementBUTTON)
          .attr("type","button")
          .attr("data-toggle","collapse")
          .attr("data-target","#pnl_Menu" + m_id )
          .attr("aria-expanded", false)
          .addClass("navbar-toggle")
          .addClass("collapsed")
          .append("<span class='icon-bar'></span>")
          .append("<span class='icon-bar'></span>")
          .append("<span class='icon-bar'></span>")
        return elementBUTTON;
      })
      .append(function(){
        var elementA = document.createElement("a");
        $(elementA)
          .attr("href" ,  m_data[0].Url )
          .append("<img alt='LOGO' src='../../Resources/lib/images/Logo.png' style='max-height: 50px;'>");
        return elementA;
      })
    return elementDIV;
  };
  var _CreateCollapseMenu = function(){
    var elementDIV = document.createElement("div");
    $(elementDIV)
      .attr("id","pnl_Menu" + m_id )
      .addClass("collapse")
      .addClass("navbar-collapse")
      .append( _CreateMenu( m_data ));
    return elementDIV;
  };
  var __Init = function(){
    m_container  = Configuration.Container  ? Configuration.Container  : [];
    m_data       = Configuration.Data       ? Configuration.Data       : [];
      m_method     = Configuration.Method     ? Configuration.Method     : "POST";
      m_request    = Configuration.Request    ? Configuration.Request    : { "CommandType":"GET_MENU_INICIO"};
      m_type       = Configuration.RequetType ? Configuration.RequetType : "JSON";
      m_url        = Configuration.Url        ? Configuration.Url : "";

      if( m_url != "" && m_data.length == 0){
        Ajax_ServerRequest( m_url,  m_method , m_request , function( data ){
          m_data = JSON.parse( data );
          $(m_container).empty();
          $(m_container)
            .append( _CreateHeader() )
            .append(function(){
              var elementDIV = document.createElement("div");
              $(elementDIV)
                .addClass("container-fluid")
                .append( _CreateCollapseMenu() );
                return elementDIV;
            });
        });
      }
      else{
        $(m_container).empty();
        $(m_container)
          .append( _CreateHeader() )
          .append(function(){
            var elementDIV = document.createElement("div");
            $(elementDIV)
              .addClass("container-fluid")
              .append( _CreateCollapseMenu() );
              return elementDIV;
          });
      }
	};
		__Init();
};

function jsModulosManager( ){
  var Configuration = arguments[0] ? arguments[0] : {};
  var m_CurrentObject = this;

  var m_Modulos =  Configuration.Modulos ? Configuration.Modulos : [] ;
  var m_Container = Configuration.id ? $( Configuration.id ).get(0) : document.createElement("div");
  var m_id = fn_CreateKey( 5 ,"pnlGeneric");
  var m_ColumnGrid  = Configuration.Colums ? Configuration.Colums : 4;

  Object.defineProperties( m_CurrentObject , {
      "Modulos":{
          get: function( ){ return m_Modulos; },
          set : function( value ){ m_Modulos = value; },
      },
      "Container":{
          get: function( ){ return m_Container; }
      },
      "ColumnGrid":{
          get: function( ){ return m_ColumnGrid; }
      }
    });
  this.__Init = function( ){
    for (var index = 0; index < this.Modulos.length; index++) {
      $( this.Container ).append( this.CreateGridView( this.Modulos[ index ] ) );
    }
  };
  this.CreateGridView = function( objectJSON ){
    var gridElement = document.createElement("div");

    $(gridElement)
      .addClass("uk-width-1-" + ( this.ColumnGrid ? this.ColumnGrid : "4" ) )
      .addClass("uk-container-center")
      .addClass("ctlControl")
      .attr("dataUrlAction", objectJSON.Url )
      .attr("dataUrlTitle", objectJSON.Title )
      .css({"margin-top": "20px" })
      .append(function(){
        var elementHover = document.createElement("div");
        $(elementHover)
          .addClass("uk-panel")
          .addClass("uk-panel-box")
          .addClass("uk-panel-hover")
          .append( function(){
            var elementHeader = document.createElement("div");
            $(elementHeader)
              .addClass("uk-panel")
              .addClass("uk-panel-header")
              .append("<h3 class='uk-panel-title'>" + objectJSON.Title + " </h3>")
              return elementHeader;
          })
          .append("<br />")
          .append(function(){
            var elementImageContainer = document.createElement("div");
            imageExists(objectJSON.ImageUrl +"?"+ new Date().getTime() , function(pRESULT){
              if(pRESULT){
                $(elementImageContainer)
                  .addClass("uk-panel-teaser")
                  .css({"text-align":"center"})
                  .append("<img src='" + objectJSON.ImageUrl +"?"+ new Date().getTime() + "' />");
              }
              else{
                $(elementImageContainer)
                  .addClass("uk-panel-teaser")
                  .css({"text-align":"center"});
              }
            });
              return elementImageContainer;
          })
          .append("<span>" + objectJSON.Description + "</span>");
          return elementHover;
      });
    return gridElement;
  };
  this.__Init();
}
//==============================================================================
//==============================================================================
function CreateDiagram( ObjectCoumnsJSON , objectJSON ){
  var counterUpper = 0;
  var counterLower = 0;
  for (var i = 0; i < ObjectCoumnsJSON.length; i++) {
    counterUpper += ( ObjectCoumnsJSON[i].IsUpper=='Y')?1:0;
    counterLower += ( ObjectCoumnsJSON[i].IsUpper=='N')?1:0;
  }
  counterUpper =  counterUpper > counterLower ? counterUpper: counterLower;
	$(".tblSiteMap")
		.append(function(){
			var elementTHEAD = document.createElement("thead");
			$(elementTHEAD)
				.append(function(){
					var elementTR = document.createElement("tr");
					for (var index = 0; index < counterUpper; index++) {
						if( parseInt( (counterUpper )/2 ) == index ){
							$(elementTR).append("<th>Index</th>");
						}
						else{
							$(elementTR).append("<th></th>");
						}
					}
					return elementTR;
				});
			return elementTHEAD;
		})
		.append(function(){
			var elementTBODY = document.createElement("tbody");
			$(elementTBODY)
			.append(function(){
				var elementTR = document.createElement("tr");
				for (var index = 0; index < ObjectCoumnsJSON.length; index++) {
          if( ObjectCoumnsJSON[ index ].IsUpper=='N')
          continue;
					$(elementTR).append(function(){
            var elementTD = document.createElement("td");
            $(elementTD)
              .attr("data-title",ObjectCoumnsJSON[ index ].Title.replace(/\s/g, "") )
              .attr("data-id",ObjectCoumnsJSON[ index ].ID )
              .append("<h4 class='ui-state-default ui-state-disabled'>"+ObjectCoumnsJSON[ index ].Title+"</h4>");

            return elementTD;
          });
				}
				return elementTR;
			})
			.append(function(){
				var elementTR = document.createElement("tr");
				for (var index = 0; index < ObjectCoumnsJSON.length; index++) {
          if( ObjectCoumnsJSON[ index ].IsUpper=='Y')
          continue;
					$(elementTR).append(function(){
            var elementTD = document.createElement("td");
            $(elementTD)
              .attr("data-title",ObjectCoumnsJSON[ index ].Title.replace(/\s/g, "") )
              .attr("data-id",ObjectCoumnsJSON[ index ].ID )
              .append("<h4 class='ui-state-default ui-state-disabled'>"+ObjectCoumnsJSON[ index ].Title+"</h4>");
            return elementTD;
          });
				}
				return elementTR;
			});
			return elementTBODY;
		});
	for (var index = 0; index < objectJSON.length; index++) {
    var parentTitle = objectJSON[ index ].Parent.replace(/\s/g, "");
    if( parentTitle.length ==0 ){
  		$(".pnlPageItem").append( CreateSitePreView( objectJSON[ index ]) );
    }
    else{
  		$(".tblSiteMap")
  			.find("tbody")
  			.find("[data-title="+parentTitle+"]")
  			.append( CreateSitePreView( objectJSON[ index ]) );
    }
	}
  $(".pnlPageItem").sortable({
    connectWith: $(".tblSiteMap").find( "td" ).selector ,
    handle     : ".ctlHandler",
    placeholder: "portlet-placeholder ui-corner-all",
    appendTo : document.body,
    start: function(){
        $(".pnlPageItem").css({"overflow-y":"visible"});
    },
    stop : function(){
      $(".pnlPageItem").css({"overflow-y":"auto"});
    },
    remove: function( event, ui ) {
      var elementSite = ui.item[0];
      var itemOrder = 0;
      var parentID = $(elementSite).parent().attr("data-id");
      for (var i = 0; i < $("[data-id="+parentID+"]").find("div").length; i++) {
          var itemSite = $("[data-id="+parentID+"]").find("div").get(i);
          if( $(itemSite).attr("data-id") ==  $(elementSite).attr("data-id") ){
            break;
          }
          itemOrder++;
      }
      Ajax_ServerRequest( '../lib/php/ControlContenidos.php',  "POST" , {
        "field_content_CommandType" : "reOrderMenu",
        "ParentID"  : parentID,
        "OrdeBegin" : itemOrder,
        "PageID"    : $(elementSite).attr("data-id")
      });
    }
  });
  $(".tblSiteMap")
    .find( "td" ).sortable({
      connectWith: ".tblSiteMap tbody td",
      handle: ".ctlHandler",
      items: "div.imgViewSite",
      placeholder: "portlet-placeholder ui-corner-all",
      stop: function( event, ui ) {
        var elementSite = ui.item[0];
        var itemOrder = 0;
        var parentID = $(elementSite).parent().attr("data-id");
        for (var i = 0; i < $("[data-id="+parentID+"]").find("div").length; i++) {
            var itemSite = $("[data-id="+parentID+"]").find("div").get(i);
            if( $(itemSite).attr("data-id") ==  $(elementSite).attr("data-id") ){
              break;
            }
            itemOrder++;
        }
        Ajax_ServerRequest( '../lib/php/ControlContenidos.php',  "POST" , {
          "field_content_CommandType" : "reOrderMenu",
          "ParentID"  : parentID,
          "OrdeBegin" : itemOrder,
          "PageID"    : $(elementSite).attr("data-id")
        });
      }
  });

  $(".tblSiteMap").find( ".uk-panel" )
    .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
    .find( ".portlet-header" )
    .addClass( "ui-widget-header ui-corner-all" )
    .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
};
function CreateSitePreView( objectJSON ){
	var elementDIV = document.createElement("div");
	$(elementDIV)
    .attr("data-id",objectJSON.ID)
		.addClass("panel")
		.addClass("uk-panel-box")
		.addClass("imgViewSite")
		.append(function(){
			var elementH3 = document.createElement("h3");
			$(elementH3)
				.addClass("uk-panel-title")
				.addClass("ctlHandler")
				.append("<i class='uk-icon-arrows'></i>")
        .append(function(){
    			var elementButton = document.createElement("button");
    			$(elementButton)
            .css({"float":"right"})
            .attr("parent-id",objectJSON.ID)
            .addClass("uk-button")
            .addClass("uk-button-danger")
    				.append("<i class='uk-icon-trash uk-icon-mini'></i>")
            .click(function(){
              Ajax_ServerRequest( '../lib/php/ControlContenidos.php',  "POST" , {
                "field_content_CommandType" : "reOrderMenu",
                "ParentID"  : 0,
                "OrdeBegin" : 0,
                "PageID"    : $(this).attr("parent-id")
              },
              function(){
                $( elementDIV ).effect( "blind", {}, 200, function(){
                  $(elementDIV).remove();
                });
              });
            });
    			return elementButton;
    		});
			return elementH3;
		})
		.append(function(){
			var elementContainer = document.createElement("div");
			$(elementContainer)
				.addClass("uk-panel-teaser")
				.append("<img src='"+objectJSON.ImageUrl+"' style='width: 50px; height: 50px;'  />");
			return elementContainer;
		})
		.append("<p>"+objectJSON.Titulo+"</p>")
	return elementDIV;
};

function GetContentSource(){
  var DataFormat = {};
  DataFormat["field_content_CommandType"] = "GetTemplateSource";
  DataFormat["ContentSource"] = $("[name=pnlTemplate_Source]").attr("data-source");

  DataFormat["ContentFilter"] = "";
  if( $("[name=pnlTemplate_Source]").attr("data-parameter-source") ){
    var array_parametersSource = $("[name=pnlTemplate_Source]").attr("data-parameter-source").split(";");
    var array_parameter = $("[name=pnlTemplate_Source]").attr("data-parameter").split(";");
    for (var i = 0; i < array_parametersSource.length; i++) {
      DataFormat["ContentFilter"] = " AND "+array_parametersSource[ i ]+" = "+array_parameter[i];
    }
  }
  $.ajax({
     type : "post"                         ,
     contentType: "application/x-www-form-urlencoded; charset=UTF-8",
     url  : "Resources/lib/php/ControlContenidos.php" ,
     data : { "Request" : btoa( JSON.stringify( DataFormat )) } , // serializes the form's elements.
     success: function( data ){
       var months_names=  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
       var sourceJSON = JSON.parse( data );
       var stepSize = 10;

      $("[name=pnlTemplate]").append("<ul data-role='headerTab'></ul>");
       var  indexCounter = 0;
       var elememtContainer = {};
       for (var index = 0; index < sourceJSON.length; index++) {
         if( indexCounter == 0){
           elememtContainer = document.createElement("div");
            $(elememtContainer).attr("id", "tab-"+( index / 10) );
         }
         var elementTemple = $("[name=pnlTemplate_Source]>div").clone();
         for( TempleKey in sourceJSON[ index ] ){
           for( var  i = 0; i < $(elementTemple).find("[data-name]").length ; i++){
              var templeField = $(elementTemple).find("[data-name]").get(i);
              if( $(templeField ).attr("data-name").indexOf( TempleKey )!= -1){
                var array_names       = $(templeField ).attr("data-name").split(",");
                var array_properties  = $(templeField ).attr("data-attribute").split(",");
                var array_types       = $(templeField ).attr("data-type")   ? $(templeField ).attr("data-type").split(",")    : [];
                var array_format      = $(templeField ).attr("data-format") ? $(templeField ).attr("data-format").split(",")  : [];

                for(var c = 0; c < array_names.length ; c++){
                  if( array_properties[c] == "src"){
                    $(templeField).attr("src","lib/images/" + sourceJSON[ index ][ array_names[c] ] );
                  }
                  else if( array_properties[c] == "href" ){
                    if( $(templeField).attr("data-href") ){
                      $(templeField).attr("href", $(templeField).attr("data-href")+"?PID="+sourceJSON[ index ][ array_names[c] ] );
                    }
                    else{
                      $(templeField).attr("href", sourceJSON[ index ][ array_names[c] ] );
                    }
                  }
                  else if( array_properties[c] == "dataurl" ){
                    if( $(templeField).attr("dataurl") ){
                      $(templeField).attr("dataurl", $(templeField).attr("dataurl")+"?"+$(templeField).attr("data-parameter")+"="+sourceJSON[ index ][ array_names[c]] );
                    }
                    else {
                      $(templeField).attr("dataurl", sourceJSON[ index ][ array_names[c]] );
                    }
                  }
                  else if( array_properties[c] == "html" ){
                    if( array_types[c] == "date"){
                      var tempDate = new Date( sourceJSON[ index ][ array_names[c] ] );
                      var dateValue = tempDate.getDate()+" "+ months_names[ tempDate.getMonth() ];
                      $(templeField)
                        .attr("data-value", sourceJSON[ index ][ array_names[c] ] )
                        .html( dateValue );
                    }
                    else{
                      $(templeField).html( sourceJSON[ index ][ array_names[c] ] );
                    }
                  }
                  else if( array_properties[c] == "backcolor" ){
                    $(templeField).css("background-color", sourceJSON[ index ][ array_names[c] ] );
                  }
                  else if( array_properties[c] == "background-image" ){
                    $(templeField).css("background-image", "url('lib/images/"+sourceJSON[ index ][ array_names[c] ]+"')" );
                  }
                  else if( array_properties[c] == "forecolor" ){
                    $(templeField).css("color", sourceJSON[ index ][ array_names[c] ] );
                  }
                }
              }
           }
         }
         indexCounter++;
         if( indexCounter >= 10){
           indexCounter = 0;
         }
         $(elememtContainer).append( elementTemple )
         $("[name=pnlTemplate]").append(elememtContainer);
       }
        $( "[name=pnlTemplate]" ).tabs({
          collapsible: true
        });
        _pageController.AsingEventClick();
     }
   });
}
//------------------------------------------------------------------------------
//    Control para Peticiones para elementos DOM
//------------------------------------------------------------------------------
function jsNorRequest(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var // Lista de Propiedades y Atriutos del elemento Grid
    m_currentItem   = this  ,
    m_url           = ""    ,
    m_method        = ""    ,
    m_params        = {}    ;
  Object.defineProperties( m_currentItem , {
    "URL":{
        get: function( ){ return m_url ; },
        set : function( pAttributeValue ){ m_url = pAttributeValue; }
    },
    "METHOD":{
        get: function( ){ return m_method ; },
        set : function( pAttributeValue ){ m_method = pAttributeValue; }
      },
    "PARAMS":{
        get: function( ){ return m_params ; },
        set : function( pAttributeValue ){ m_params = pAttributeValue; }
      }
    });
  var __Init = function(){
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
function jsNorRequestGroup(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var // Lista de Propiedades y Atriutos del elemento Grid
    m_currentItem   = this  ,
    m_Delete        = new jsNorRequest()    ,
    m_Edit          = new jsNorRequest()    ,
    m_Insert        = new jsNorRequest()    ,
    m_Select        = new jsNorRequest()    ;
  Object.defineProperties( m_currentItem , {
    "Delete":{
        get: function( ){ return m_Delete ; },
        set : function( pAttributeValue ){
          if( pAttributeValue instanceof jsNorRequest ){
            m_Delete = pAttributeValue;
          }
          else{ m_Delete = new jsNorRequest( pAttributeValue );}
        }
    },
    "Edit":{
        get: function( ){ return m_Edit ; },
        set : function( pAttributeValue ){
          if( pAttributeValue instanceof jsNorRequest ){
            m_Edit = pAttributeValue;
          }
          else{ m_Edit = new jsNorRequest( pAttributeValue );}
        }
      },
    "Insert":{
        get: function( ){ return m_Insert ; },
        set : function( pAttributeValue ){
          if( pAttributeValue instanceof jsNorRequest ){
            m_Insert = pAttributeValue;
          }
          else{ m_Insert = new jsNorRequest( pAttributeValue );}
        }
      },
    "Select":{
        get: function( ){ return m_Select ; },
        set : function( pAttributeValue ){
          if( pAttributeValue instanceof jsNorRequest ){
            m_Select = pAttributeValue;
          }
          else{ m_Select = new jsNorRequest( pAttributeValue );}
        }
      }
    });
  var __Init = function(){
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
//------------------------------------------------------------------------------
//    Control CSS para elementos DOM
//------------------------------------------------------------------------------
function jsNorCssBorder(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var
    m_currentItem = this ,
    m_elementDOM  = null ,
    m_id          = ""   ,
    m_color       = ""   ,
    m_radius      = ""   ,
    m_style       = ""   ,
    m_width       = ""   ;
  var
    e_OnPropertyChange  = [];
  var _eOnPropertyChange = function( pPARAMS ){
    for( var i = 0 ; i < e_OnPropertyChange.length ; i++){
      e_OnPropertyChange( m_currentItem , pPARAMS );
    }
  };
  Object.defineProperties( m_currentItem , {
    "ElementDOM":{ get: function( ){ return m_elementDOM ; }},
    "Color"    :{
        get: function( ){ return m_color ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_color;
          m_color = pAttributeValue;
          $( m_elementDOM ).css("color",m_color );
          _eOnPropertyChange( { "Property" : "BorderColor" , "lastValue" : lastPropertyValue , "Value" : m_color });
        }
      },
    "Radius"    :{
        get: function( ){ return m_radius ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_radius;
          m_radius = pAttributeValue;
          $( m_elementDOM ).css("border-radius",m_radius );
          _eOnPropertyChange( { "Property" : "BorderRadius" , "lastValue" : lastPropertyValue , "Value" : m_radius });
        }
      },
    "Style"    :{
        get: function( ){ return m_style ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_style;
          m_style = pAttributeValue;
          $( m_elementDOM ).css("border-style",m_style );
          _eOnPropertyChange( { "Property" : "BorderStyle" , "lastValue" : lastPropertyValue , "Value" : m_style });
        }
      },
    "Width"     :{
        get: function( ){ return m_width ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_width;
          m_width = pAttributeValue;
          $( m_elementDOM ).css("border-width",m_width );
          _eOnPropertyChange( { "Property" : "BorderWidth" , "lastValue" : lastPropertyValue , "Value" : m_width });
        }
      }
  });
  Object.defineProperties( m_currentItem , {
    "OnPropertyChange":{
        get: function( ){ return e_OnPropertyChange ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnPropertyChange.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnPropertyChange.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  var __Init = function(){
    m_elementDOM = Configuration.Element ;
    m_id = __GetKey( 5 ,"jsNorCssBorder");
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
function jsNorCssFont(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var
    m_currentItem = this ,
    m_elementDOM  = null ,
    m_id          = ""   ,
    m_family      = ""   ,
    m_size        = ""   ,
    m_style       = ""   ,
    m_weight      = ""   ,
    m_variant     = ""   ;
  var
    e_OnPropertyChange  = [];
  var _eOnPropertyChange = function( pPARAMS ){
    for( var i = 0 ; i < e_OnPropertyChange.length ; i++){
      e_OnPropertyChange( m_currentItem , pPARAMS );
    }
  };
  Object.defineProperties( m_currentItem , {
    "ElementDOM":{ get: function( ){ return m_elementDOM ; }},
    "Family"    :{
        get: function( ){ return m_family ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_family;
          m_family = pAttributeValue;
          $( m_elementDOM ).css("font-family",m_family );
          _eOnPropertyChange( { "Property" : "FontFamily" , "lastValue" : lastPropertyValue , "Value" : m_color });
        }
      },
    "Style"    :{
        get: function( ){ return m_style ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_style;
          m_style = pAttributeValue;
          $( m_elementDOM ).css("font-style",m_style );
          _eOnPropertyChange( { "Property" : "FontStyle" , "lastValue" : lastPropertyValue , "Value" : m_style });
        }
      },
    "Weight "     :{
        get: function( ){ return m_weight ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_weight;
          m_weight = pAttributeValue;
          $( m_elementDOM ).css("font-weight",m_weight );
          _eOnPropertyChange( { "Property" : "FontWeight" , "lastValue" : lastPropertyValue , "Value" : m_weight });
        }
      },
    "Variant"     :{
        get: function( ){ return m_variant ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_variant;
          m_variant = pAttributeValue;
          $( m_elementDOM ).css("font-variant",m_variant );
          _eOnPropertyChange( { "Property" : "FontVariant" , "lastValue" : lastPropertyValue , "Value" : m_variant });
        }
      }
  });
  Object.defineProperties( m_currentItem , {
    "OnPropertyChange":{
        get: function( ){ return e_OnPropertyChange ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnPropertyChange.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnPropertyChange.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  var __Init = function(){
    m_elementDOM = Configuration.Element ;
    m_id = __GetKey( 5 ,"jsNorCssFont");
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
function jsNorCssMargin(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var
    m_currentItem = this ,
    m_elementDOM  = null ,
    m_id          = ""   ,
    m_bottom      = ""   ,
    m_left        = ""   ,
    m_right       = ""   ,
    m_top         = ""   ;
  var
    e_OnPropertyChange  = [];
  var _eOnPropertyChange = function( pPARAMS ){
    for( var i = 0 ; i < e_OnPropertyChange.length ; i++){
      e_OnPropertyChange( m_currentItem , pPARAMS );
    }
  };
  Object.defineProperties( m_currentItem , {
    "ElementDOM":{ get: function( ){ return m_elementDOM ; }},
    "Bottom"    :{
        get: function( ){ return m_bottom ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_bottom;
          m_bottom = pAttributeValue;
          $( m_elementDOM ).css("margin-bottom",m_bottom );
          _eOnPropertyChange( { "Property" : "MarginBottom" , "lastValue" : lastPropertyValue , "Value" : m_bottom });
        }
      },
    "Left"    :{
        get: function( ){ return m_left ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_left;
          m_left = pAttributeValue;
          $( m_elementDOM ).css("margin-left",m_left );
          _eOnPropertyChange( { "Property" : "PadddingLeft" , "lastValue" : lastPropertyValue , "Value" : m_left });
        }
      },
    "Right"    :{
        get: function( ){ return m_right ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_right;
          m_right = pAttributeValue;
          $( m_elementDOM ).css("margin-right",m_right );
          _eOnPropertyChange( { "Property" : "PadddingRight" , "lastValue" : lastPropertyValue , "Value" : m_right });
        }
      },
    "Top"    :{
        get: function( ){ return m_right ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_top;
           m_top = pAttributeValue;
          $( m_elementDOM ).css("margin-top", m_top );
          _eOnPropertyChange( { "Property" : "PadddingTop" , "lastValue" : lastPropertyValue , "Value" : m_top });
        }
      }
  });
  Object.defineProperties( m_currentItem , {
    "OnPropertyChange":{
        get: function( ){ return e_OnPropertyChange ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnPropertyChange.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnPropertyChange.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  var __Init = function(){
    m_elementDOM = Configuration.Element ;
    m_id = __GetKey( 5 ,"jsNorCssMargin");
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
function jsNorCssPadding(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var
    m_currentItem = this ,
    m_elementDOM  = null ,
    m_id          = ""   ,
    m_bottom      = ""   ,
    m_left        = ""   ,
    m_right       = ""   ,
    m_top         = ""   ;
  var
    e_OnPropertyChange  = [];
  var _eOnPropertyChange = function( pPARAMS ){
    for( var i = 0 ; i < e_OnPropertyChange.length ; i++){
      e_OnPropertyChange( m_currentItem , pPARAMS );
    }
  };
  Object.defineProperties( m_currentItem , {
    "ElementDOM":{ get: function( ){ return m_elementDOM ; }},
    "Bottom"    :{
        get: function( ){ return m_bottom ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_bottom;
          m_bottom = pAttributeValue;
          $( m_elementDOM ).css("padding-bottom",m_bottom );
          _eOnPropertyChange( { "Property" : "PaddingBottom" , "lastValue" : lastPropertyValue , "Value" : m_bottom });
        }
      },
    "Left"    :{
        get: function( ){ return m_left ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_left;
          m_left = pAttributeValue;
          $( m_elementDOM ).css("padding-left",m_left );
          _eOnPropertyChange( { "Property" : "PadddingLeft" , "lastValue" : lastPropertyValue , "Value" : m_left });
        }
      },
    "Right"    :{
        get: function( ){ return m_right ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_right;
          m_right = pAttributeValue;
          $( m_elementDOM ).css("padding-right",m_right );
          _eOnPropertyChange( { "Property" : "PadddingRight" , "lastValue" : lastPropertyValue , "Value" : m_right });
        }
      },
    "Top"    :{
        get: function( ){ return m_right ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_top;
           m_top = pAttributeValue;
          $( m_elementDOM ).css("padding-top", m_top );
          _eOnPropertyChange( { "Property" : "PadddingTop" , "lastValue" : lastPropertyValue , "Value" : m_top });
        }
      }
  });
  Object.defineProperties( m_currentItem , {
    "OnPropertyChange":{
        get: function( ){ return e_OnPropertyChange ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnPropertyChange.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnPropertyChange.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  var __Init = function(){
    m_elementDOM = Configuration.Element ;
    m_id = __GetKey( 5 ,"jsNorCssPadding");
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
function jsNorCssSize(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var
    m_currentItem = this  ,
    m_elementDOM  = null  ,
    m_id          = ""    ,
    m_height      = ""    ,
    m_width       = ""    ;
  var
    e_OnReSize  = [];
  var _eOnReSize = function( pPARAMS ){
    for( var i = 0 ; i < e_OnReSize.length ; i++){
      e_OnReSize( m_currentItem , pPARAMS );
    }
  };
  Object.defineProperties( m_currentItem , {
    "ElementDOM":{ get: function( ){ return m_elementDOM ; }},
    "Height"    :{
        get: function( ){ return m_height ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_height;
          m_height = pAttributeValue;
          $( m_elementDOM ).css("height",m_height );
          _eOnReSize( { "Property" : "Height" , "lastValue" : lastPropertyValue , "Value" : m_height });
        }
      },
    "Width"     :{
        get: function( ){ return m_width ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_width;
          m_width = pAttributeValue;
          $( m_elementDOM ).css("width",m_width );
          _eOnReSize( { "Property" : "Width" , "lastValue" : lastPropertyValue , "Value" : m_width });
        }
      }
  });
  Object.defineProperties( m_currentItem , {
    "OnReSize":{
        get: function( ){ return e_OnReSize ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnReSize.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnReSize.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  var __Init = function(){
    m_elementDOM = Configuration.Element ;
    m_id = __GetKey( 5 ,"jsNorCssSize");
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};

function jsNorCssControler(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var // Propiedades de la clase CSS
    m_currentItem       = this  ,
    m_elementDOM        = null  ,
    m_backColor         = ""    ,
    m_backImage         = ""    ,
    m_backImagePosition = ""    ,
    m_backImageSize     = ""    ,
    m_backImageRepeat   = ""    ,
    m_border            = null  ,
    m_class             = []    ,
    m_color             = ""    ,
    m_font              = null  ,
    m_label             = ""    ,
    m_margin            = null  ,
    m_padding           = null  ,
    m_text              = ""    ,
    m_textDecoration    = ""    ,
    m_show              = true  ,
    m_scroll            = false ,
    m_size              = null  ,
    m_visible           = true  ;

  var // Evnetos de la clase
    e_OnDblClick        = [] ,
    e_OnClick           = [] ,
    e_onCompleted       = [] ,
    e_OnInit            = [] ,
    e_OnMouseHover      = [] ,
    e_OnMouserOut       = [] ,
    e_OnPropertyChange  = [] ,
    e_OnRemove          = [] ;
  var _eOnDblClick = function( pPARAMS ){
    for( var i = 0 ; i < e_OnDblClick.length ; i++){
      e_OnDblClick( m_currentItem , pPARAMS );
    }
  };
  var _eOnClick = function( pPARAMS ){
    for( var i = 0 ; i < e_OnClick.length ; i++){
      e_OnClick( m_currentItem , pPARAMS );
    }
  };
  var _eOnInit = function( pPARAMS ){
    for( var i = 0 ; i < e_OnInit.length ; i++){
      e_OnInit( m_currentItem , pPARAMS );
    }
  };
  var _eOnPropertyChange = function( pPARAMS ){
    for( var i = 0 ; i < e_OnPropertyChange.length ; i++){
      e_OnPropertyChange( m_currentItem , pPARAMS );
    }
  };

  Object.defineProperties( m_currentItem , {
    "ElementDOM":{ get: function( ){ return m_elementDOM ; } },
    "BackColor":{
        get: function( ){ return m_backColor ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_backColor;
          m_backColor = pAttributeValue;
          $( m_elementDOM ).css("background-color",m_backColor );
          _eOnPropertyChange( { "Property" : "BackColor" , "lastValue" : lastPropertyValue , "Value" : m_backColor });
        }
      },
    "BackImage":{
        get: function( ){ return m_backImage ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_backImage;
          m_backImage = pAttributeValue;
          if( m_backImage == null || m_backImage == '' ){
            $( m_elementDOM ).css("background-image","" );
          }
          else if( m_backImage.indexOf("data:image") == 0 ){
            $( m_elementDOM ).css("background-image",m_backImage );
          }
          else{
            $( m_elementDOM ).css("background-image","url("+ m_backImage +")");
          }
          _eOnPropertyChange( { "Property" : "BackImage" , "lastValue" : lastPropertyValue , "Value" : m_backImage });
        }
      },
    "BackImagePosition":{
        get: function( ){ return m_backImagePosition ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_backImagePosition;
          m_backImagePosition = pAttributeValue;
          $( m_elementDOM ).css("background-position",m_backImagePosition );
          _eOnPropertyChange( { "Property" : "BackImagePosition" , "lastValue" : lastPropertyValue , "Value" : m_backImagePosition });
        }
      },
    "BackImageSize":{
        get: function( ){ return m_backImageSize ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_backImageSize;
          m_backImageSize = pAttributeValue;
          $( m_elementDOM ).css("background-size",m_backImageSize );
          _eOnPropertyChange( { "Property" : "BackImageSize" , "lastValue" : lastPropertyValue , "Value" : m_backImageSize });
        }
      },
    "BackImageRepeat":{
        get: function( ){ return m_backImageRepeat ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_backImageRepeat;
          m_backImageRepeat = pAttributeValue;
          $( m_elementDOM ).css("background-repeat",m_backImageRepeat );
          _eOnPropertyChange( { "Property" : "BackImageRepeat" , "lastValue" : lastPropertyValue , "Value" : m_backImageRepeat });
        }
      },
    "Border":{
        get: function( ){ return m_border ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_border;
          if( pAttributeValue instanceof jsNorCssBorder ){
            m_border = pAttributeValue;
          }
          else{
            pAttributeValue["Element"] = m_elementDOM;
            pAttributeValue["OnPropertyChange"] = _eOnPropertyChange ;
            m_border = new jsNorCssBorder( pAttributeValue );
          }
          _eOnPropertyChange( { "Property" : "Border" , "lastValue" : lastPropertyValue , "Value" : m_border });
        }
      },
    "Class":{
        get: function( ){ return m_class ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_class;
          for( var i = 0 ; i < m_class.length ; i++){
            if( pAttributeValue == m_class[ i ] ){
              return;
            }
          }
          m_class.push( pAttributeValue );
          $( m_elementDOM ).addClass( pAttributeValue );
          _eOnPropertyChange( { "Property" : "ClassArray" , "lastValue" : lastPropertyValue , "Value" : m_class });
        }
      },
    "Color":{
        get: function( ){ return m_color ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_color;
          m_color = pAttributeValue;
          $( m_elementDOM ).css("color",m_color );
          _eOnPropertyChange( { "Property" : "Color" , "lastValue" : lastPropertyValue , "Value" : m_color });
        }
      },
    "Font":{
        get: function( ){ return m_font ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_font;
          if( pAttributeValue instanceof jsNorCssFont ){
            m_font = pAttributeValue;
          }
          else{
            pAttributeValue["Element"] = m_elementDOM;
            pAttributeValue["OnPropertyChange"] = _eOnPropertyChange ;
            m_font = new jsNorCssFont( pAttributeValue );
          }
          _eOnPropertyChange( { "Property" : "Font" , "lastValue" : lastPropertyValue , "Value" : m_font });
        }
      },
    "Label":{
        get: function( ){ return m_label ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_label;
          m_label = pAttributeValue ;
          _eOnPropertyChange( { "Property" : "Label" , "lastValue" : lastPropertyValue , "Value" : m_label });
        }
      },
    "Margin":{
        get: function( ){ return m_margin ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_margin;
          if( pAttributeValue instanceof jsNorCssMargin ){
            m_margin = pAttributeValue;
          }
          else{
            pAttributeValue["Element"] = m_elementDOM;
            pAttributeValue["OnPropertyChange"] = _eOnPropertyChange ;
            m_margin = new jsNorCssMargin( pAttributeValue );
          }
          _eOnPropertyChange( { "Property" : "Margin" , "lastValue" : lastPropertyValue , "Value" : m_margin });
        }
      },
    "Padding":{
        get: function( ){ return m_padding ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_padding;
          if( pAttributeValue instanceof jsNorCssPadding ){
            m_padding = pAttributeValue;
          }
          else{
            pAttributeValue["Element"] = m_elementDOM;
            pAttributeValue["OnPropertyChange"] = _eOnPropertyChange ;
            m_padding = new jsNorCssPadding( pAttributeValue );
          }
          _eOnPropertyChange( { "Property" : "Padding" , "lastValue" : lastPropertyValue , "Value" : m_padding });
        }
      },
    "Text":{
        get: function( ){ return m_text ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_text;
          m_text = pAttributeValue ;
          _eOnPropertyChange( { "Property" : "Text" , "lastValue" : lastPropertyValue , "Value" : m_text });
        }
      },
    "TextDecoration":{
        get: function( ){ return m_textDecoration ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_textDecoration;
          m_textDecoration = pAttributeValue ;
          _eOnPropertyChange( { "Property" : "TextDecoration" , "lastValue" : lastPropertyValue , "Value" : m_textDecoration });
        }
      },
    "Show":{
        get: function( ){ return m_show ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_show;
          m_show = pAttributeValue ;
          if( m_show ){
            $( m_elementDOM ).css("display","initial" );
          }
          else{
            $( m_elementDOM ).css("display","hidden" );
          }
          _eOnPropertyChange( { "Property" : "ShowDisplay" , "lastValue" : lastPropertyValue , "Value" : m_show });
        }
      },
    "Scroll":{
        get: function( ){ return m_scroll ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_scroll;
          m_scroll = pAttributeValue ;
          _eOnPropertyChange( { "Property" : "Scroll" , "lastValue" : lastPropertyValue , "Value" : m_scroll });
        }
      },
    "Size":{
        get: function( ){ return m_size ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_size;
          if( pAttributeValue instanceof jsNorCssSize ){
            pAttributeValue["Element"] = m_elementDOM;
            m_size = pAttributeValue;
          }
          else{
            pAttributeValue["Element"] = m_elementDOM;
            pAttributeValue["OnReSize"] = _eOnPropertyChange ;
            m_size = new jsNorCssSize( pAttributeValue );
          }
          _eOnPropertyChange( { "Property" : "Size" , "lastValue" : lastPropertyValue , "Value" : m_size });
        }
      },
    "Visible":{
        get: function( ){ return m_visible ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_visible;
          m_visible = pAttributeValue;
          if( m_visible ){
            $( m_elementDOM ).css("visibility","visible" );
          }
          else{
            $( m_elementDOM ).css("visibility","hidden" );
          }
          _eOnPropertyChange( { "Property" : "Visible" , "lastValue" : lastPropertyValue , "Value" : m_visible });
        }
      }
    });
  Object.defineProperties( m_currentItem , {
    "OnPropertyChange":{
        get: function( ){ return e_OnPropertyChange ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnPropertyChange.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnPropertyChange.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  var __Init = function(){
    m_elementDOM = Configuration.Element ;
    m_id = __GetKey( 5 ,"jsNorCssControler");
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
    if( m_border == null ){
      m_border = new jsNorCssBorder( { "Element" : m_elementDOM , "OnPropertyChange" : _eOnPropertyChange });
    }
    if( m_font == null ){
      m_font = new jsNorCssFont( { "Element" : m_elementDOM , "OnPropertyChange" : _eOnPropertyChange });
    }
    if( m_margin == null ){
      m_margin = new jsNorCssMargin( { "Element" : m_elementDOM , "OnPropertyChange" : _eOnPropertyChange });
    }
    if( m_padding == null ){
      m_padding = new jsNorCssPadding( { "Element" : m_elementDOM , "OnPropertyChange" : _eOnPropertyChange });
    }
    if( m_size == null ){
      m_size = new jsNorCssSize( { "Element" : m_elementDOM , "OnPropertyChange" : _eOnPropertyChange });
    }
  };
  __Init();
}
function jsNorLoading(){ // Clase que crea un panel de carga o de progreso
  var Configuration = arguments[0] ? arguments[0] : {};

  var // Propiedades de la clase
    m_currentItem   = this  ,
    m_elementDOM    = null  ,
    m_id            = ""    ,
    m_container     = null  ,
    m_show          = false ,
    m_style         = null  ,
    m_text          = ""    ,
    m_value         = 0     ;
      // Metodos
  var // Eventos de la Clase
    e_OnPropertyChange =  [];
  var _eOnPropertyChange = function( pPARAMS ){
    for( var i = 0 ; i < e_OnPropertyChange.length ; i++){
      e_OnPropertyChange( m_currentItem , pPARAMS );
    }
  };
  Object.defineProperties( m_currentItem , { // Propiedades
    "ElementDOM":{
        get: function( ){ return m_elementDOM ; }
    },
    "ID":{
        get: function( ){ return m_id ; }
    },
    "Style":{
        get: function( ){ return m_style ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_style;
          if( pAttributeValue instanceof jsNorCssControler ){
            m_style = pAttributeValue;
          }
          else{
            pAttributeValue["Element"] = m_elementDOM;
            pAttributeValue["OnPropertyChange"] = _eOnPropertyChange ;
            m_style = new jsNorCssControler( pAttributeValue );
          }
          _eOnPropertyChange( { "Property" : "Style" , "lastValue" : lastPropertyValue , "Value" : m_style });
        }
      },
    "Text":{
        get: function( ){ return m_text ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_text;
          m_text = pAttributeValue;
          $(m_elementDOM).html( "<span>" + m_text +"</span>" );
          _eOnPropertyChange( { "Property" : "Text" , "lastValue" : lastPropertyValue , "Value" : m_text });
        }
      },
    "Value":{
        get: function( ){ return m_value ; },
        set : function( pAttributeValue ){
          var lastPropertyValue = m_value;
          m_value = pAttributeValue;
          $(m_elementDOM).html( "<span>" + m_value +"</span>" );
          _eOnPropertyChange( { "Property" : "Value" , "lastValue" : lastPropertyValue , "Value" : m_value });
        }
      }
    });
  Object.defineProperties( m_currentItem , { // Eventos
    "OnPropertyChange":{
        get: function( ){ return e_OnPropertyChange ; },
        set : function( pEventFunction ){
          if( typeof pEventFunction == "function"){
            e_OnPropertyChange.push( pEventFunction );
          }
          else if ( pEventFunction.constructor == Array ){
            for( var i = 0 ; i <  pEventFunction.length ; i++ ){
              if( typeof pEventFunction[ i ] == "function"){
                e_OnPropertyChange.push( pEventFunction );
              }
            }
          }
        }
      }
  });
  m_currentItem.Show = function( pPARAMS ){
    m_show = pPARAMS;
    if( m_show ){
      m_currentItem.Style.Size.Height = "100%";
      m_currentItem.Style.Size.Width = "100%";
    }
    else{
      m_currentItem.Style.Size.Height = "0";
      m_currentItem.Style.Size.Width = "0";
    }
  };
  var __Init = function(){
    m_elementDOM = document.createElement("div");
    m_container  = Configuration.Element;
    m_id = __GetKey( 5 ,"jsNorLoading");
    Configuration.Style                   = Configuration.Style                   ? Configuration.Style                   : {};
    Configuration.Style.BackColor         = Configuration.Style.BackColor         ? Configuration.Style.BackColor         : "rgba(0,0,0,0.5)";
    Configuration.Style.BackImage         = Configuration.Style.BackImage         ? Configuration.Style.BackImage         : "";
    Configuration.Style.BackImageRepeat   = Configuration.Style.BackImageRepeat   ? Configuration.Style.BackImageRepeat   : "no-repeat";
    Configuration.Style.BackImagePosition = Configuration.Style.BackImagePosition ? Configuration.Style.BackImagePosition : "center center";
    $(m_container)
      .append( m_elementDOM );
    $(m_elementDOM).attr("id", m_id );
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
    if( m_style == null ){
      m_style = new jsNorCssControler( { "Element" : m_elementDOM , "OnPropertyChange" : _eOnPropertyChange });
    }
    $(m_elementDOM)
      .css({
        "position"        : "absolute"        ,
        "top"             : "0px"             ,
        "left"            : "0px"             ,
        "width"           : "0%"              ,
        "height"          : "0%"              ,
        "display"         : "table-cell"      ,
        "vertical-align"  : "middle"          ,
        "overflow"        : "hidden",
        "z-index"         : "20000",
        "text-align"      : "center"
      });
      $(m_elementDOM).append("<div class='sk-fading-circle'></div>");
    for( var i = 0 ; i <  12 ; i++){
        $(m_elementDOM).find("div.sk-fading-circle").append("<div class='sk-circle"+(i+1)+" sk-circle'></div>");
    }
  };
    __Init();
  };
function jsNorForm(){ // Clase que crea un construtor para diferentes tipos de datos
  var Configuration = arguments[0] ? arguments[0] : {};
  var //  Propiedades del elemento Form
    m_currentItem    = this  ,
    m_elementDOM     = null  , // elemento DOM que contiene el control
    m_id             = ""    , // Id del control
    m_data           = null  , // Datos o elemento que edita
    m_container      = null  , // elemento contenedor del formlario.
    m_controllerType = ControllerTypesOptions.Form ,
    m_editForm       = EditFormOptions.UNKNOW  , // forma en el cual se mostrara el formulario
    m_fields         = []    , // Lista de Campos que modifican dicho elemento
    m_fieldOptions   = []    , // Lista de Campos que modifican dicho elemento
    m_keys           = []    , // Lista de nombres de las proiedades que modificara
    m_template       = null  , // plantilla de ejemplo para convertir a formulario
    m_title          = ""    ; // Titulo para el formulario
  var // Eventos de la clase
    m_BeforeCreate   = [] , // Evento que se activa antes de que se crea el control
    m_BeforeDestroy  = [] , // Evento que se activa antes de que se destruya el control
    m_BeforeHide     = [] , // Evento que se activa antes de que se oculte el control
    m_BeforeShow     = [] , // Evento que se activa antes de que se muestre el control
    m_OnCreate       = [] , // Evento que se activa cuando se crea el control
    m_OnDestroy      = [] , // Evento que se activa cuando se destruye el control
    m_OnHide         = [] , // Evento que se activa cuando se oculta el control
    m_OnShow         = [] ; // Evento que se activa cuando se muetsra el control

  Object.defineProperties( m_currentItem , { // Propiedades de la clase
    "ElementDOM":{ get: function( ){ return m_elementDOM ; } },
    "ID"        :{ get: function( ){ return m_id ;         } },
    "Data"      :{
      get: function( ){ return m_data ; }    ,
      set : function( pAttributeValue ){
        m_data = pAttributeValue;
      }},
    "Container":{
      get: function( ){ return m_container ; }
    },
    "ControllerType":{
      get: function( ){ return m_controllerType ; }
    },
    "EditForm":{
      get: function( ){ return m_editForm ; },
      set : function( pAttributeValue ){
        m_editForm = pAttributeValue;
      }},
    "FieldOptions":{
      get: function( ){ return m_editForm ; },
      set : function( pAttributeValue ){
        m_editForm = pAttributeValue;
      }},
    "Keys":{
      get: function( ){ return m_editForm ; },
      set : function( pAttributeValue ){
        m_editForm = pAttributeValue;
      }},
    "Template":{
      get: function( ){ return m_template ; },
      set : function( pAttributeValue ){
        m_template = pAttributeValue;
      }},
    "Title":{
      get: function( ){ return m_editForm ; },
      set : function( pAttributeValue ){
        m_editForm = pAttributeValue;
      }}
  });
  Object.defineProperties( m_currentItem , { // Eventos de la Clase
    "BeforeCreate"  :{
      get: function( ){ return m_BeforeCreate ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_BeforeCreate.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_BeforeCreate.push( pEventFunction );
            }
          }
        }
      }},
    "BeforeDestroy" :{
      get: function( ){ return m_BeforeDestroy ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_BeforeDestroy.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_BeforeDestroy.push( pEventFunction );
            }
          }
        }
      }},
    "BeforeHide"    :{
      get: function( ){ return m_BeforeHide ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_BeforeHide.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_BeforeHide.push( pEventFunction );
            }
          }
        }
      }},
    "BeforeShow"    :{
      get: function( ){ return m_BeforeShow ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_BeforeShow.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_BeforeShow.push( pEventFunction );
            }
          }
        }
      }},
    "OnCreate"      :{
      get: function( ){ return m_OnCreate ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_OnCreate.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_OnCreate.push( pEventFunction );
            }
          }
        }
      }},
    "OnDestroy"     :{
      get: function( ){ return m_OnDestroy ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_OnDestroy.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_OnDestroy.push( pEventFunction );
            }
          }
        }
      }},
    "OnHide"        :{
      get: function( ){ return m_OnHide ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_OnHide.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_OnHide.push( pEventFunction );
            }
          }
        }
      }},
    "OnShow"        :{
      get: function( ){ return m_OnShow ; }    ,
      set : function( pEventFunction ){
        if( typeof pEventFunction == "function"){
          m_OnShow.push( pEventFunction );
        }
        else if ( pEventFunction.constructor == Array ){
          for( var i = 0 ; i <  pEventFunction.length ; i++ ){
            if( typeof pEventFunction[ i ] == "function"){
              m_OnShow.push( pEventFunction );
            }
          }
        }
      }}
  });
  /* funcion que se encarga de ejecutar los eventos
    - pEvents_array : Lista e eventos para ejecutar.
    - pPARAMS       : Parametros que envia dicho evento.
    - pIsCancel     : indica si el evento retorna un valor que pueda cancelar la ejecucion actual
    retorno
     [ bool , string ] : [ cancelacion del proceso y descripcion ] */
  var _CallEvents = function( pEvents_array ,  pPARAMS , pIsCancel ){
    for( var i = 0 ; i < pEvents_array.length ; i++){
      var l_RESULT = pEvents_array( m_currentItem , pPARAMS );
      if( pIsCancel && l_RESULT ){
        if( !l_RESULT[0] ){
          return l_RESULT;
        }
      }
    }
    return [true ,"" ];
  };
  var _CreateControl = function(){
    switch( m_editForm ){
      case EditFormOptions.FORM :{

      }break;
      case EditFormOptions.ROW :{

      }break;
      case EditFormOptions.INLINE :{

      }break;
      default:{

      }break;
    }
  };
  var __Init = function( ){
    _CallEvents( m_BeforeCreate , {} );
    m_id = __GetKey( 5 ,"jsNorForm");
    m_container = Configuration.Container ? Configuration.Container : $("body").get(0);
    for( propertyKey in Configuration ){
      if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
        m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
      }
    }
  };
  __Init();
};
//------------------------------------------------------------------------------
//-     Control Grid
//------------------------------------------------------------------------------
function jsNorGrid(){
  var Configuration = arguments[0] ? arguments[0] : {};
  var //Variables de enlace con eleentosDOMs y objectos diversos
    object_Fields   = []   , // Lista de Controles de los campos del formulario
    DOM_Body        = null , // Control que contiene los datos
    DOM_Footer      = null , // Control que contiene el pie de pagina de la tabla
    DOM_Form        = null , // Control de formulario parar agregar y editar datos
    DOM_Header      = null , // Control que contiene el encabezado de la tabla

   // Lista de Propiedades y Atriutos del elemento Grid
    m_currentItem       = this  ,
    m_elementDOM        = null  ,
    m_id                = ""    , //Id del Elemento
    m_buttons           = {}    , // Lista de Botones
    m_caption           = ""    ,
    /**
    * Contiene las caracteristicas de los datos a visualizar
    * @property viewOptions   
    * @description - Contiene la configuracion personalizada el la columna
    * @type {Object} 
        * 
        * @property Class   
        * @description - Clase que se añade al DIV que contiene el elemento
        * @type {String} 
        *
        * @property MaxLenght   
        * @description - Longitud maxima antes de truncar la cadena a visualizar
        * @type {int} 
        *
        * @property TrueValue   
        * @description - Define un dato personalizado para el valor de verdadero
        * @type {Object} 
        *
        * @property FalseValue   
        * @description - Define un dato personalizado para el valor de falso
        * @type {Object} 
        *
        * @property Format   
        * @description - define el formato de la vizualizacion de las fechas
        * @type {String} 
        *
        * @property MaxValue   
        * @description - valor maximo que puede tomar el elemento
        * @type {Float} 
        *
        * @property Downloadable   
        * @description - especifica si un archivo es descargable
        * @type {boolean} 
        *
        * @property Total   
        * @description - cuando son muchos elementos o valores dentro del control, puede imprimir la cantidad en vez de sus respectivos valores
        * @type {boolean}
        *
        * @property OptionsValues   
        * @description - Lista de valores posibles para el control
        * @type {Array} 
    *
    * @property width   
    * @description - Ancho que ocupa la columna
    * @type {Object} 
    *
    * @property index   
    * @description - nombre de la propieda o campo que contiene el valor
    * @type {String} 
    *
    * @property Label   
    * @description - Etiqueta que se muestra en el encabezado
    * @type {String} 
    *
    * @property Visible   
    * @description - Indica si la columna es visible en la vista desplegada
    * @type {boolean} 
    *
    * @property isRequired   
    * @description -Es necesario de editar
    * @type {boolean} 
    * 
    * @property m_columns
    * @type {Array}
    * @default []
    */
    m_columns           = []    , // Arreglo de las columnas de lo datos
    m_ColumnGrid        = 4     , // Arreglo de las columnas de lo datos
    m_controllerType    = ControllerTypesOptions.Grid ,
    m_data              = []    , // Componente que contiene los datos de la tabla
    m_dataDisplay       = ""    , // Indica la forma de display del elemento
    m_editForm          = ""    , // Forma de Editar los Datos { Ventana de Dialog o En mismo panel }
    m_editItem          = null  , // Item en edicion actual
    m_filters           = {}    , // Filtros aplicados en la consulta de datos
    m_indexRow          = -1    ,
    m_indexView         = 0    ,
    m_isZebra           = false , // Marca si el grid alternara entre colores
    m_loadingPanel      = null  , // Panel de Carga para procesos
    m_request           = new jsNorRequestGroup() , // Control que contiene las configuraccion para llamadas al servidor
    m_requestSendAll    = false ,
    m_rowsView          = -1    , // Marca la pagina actual cuando esta paginado
    m_rowsViewOption      = [ 20, 30 ,40]  , // Lista de Opciones para posibles cantidad de rows a ver
    m_size          = null  , //
    m_sortable      = false ,
    m_sourceType    = ""    ,
    m_title         = ""    , // Titulo de la tabla
    m_totalRows     = 0     ; // Esta propiedad solo se utiliza cuando los datos bienen desde AJAX_Request

  var
    e_BeforeClear       = []  , // Evento que se activa antes de limpiar el Grid por completo
    e_BeforeDelete      = []  , // Evento que se activa antes de eliminar un elemento
    e_BeforeDispose     = []  , // Evento que se activa antes de eliminar el control
    e_BeforeEdit        = []  , // Evento que se activa antes de editar un elemento
    e_BeforeInsert      = []  , // Evento que se activa antes de insertar un nuevo elemento
    e_BeforeShowForm    = []  , // Evento que se activa antes de mostrar cualquier formulario 
    e_OnClear           = []  , // Evento que se activa cuando se limpia el grid por completo
    e_OnCompleted       = []  , // Evento que se activa cuando se crea la tabla o Grid por completo
    e_OnCreateCell      = []  , // Evento que se activa cuando se crea una celda.
    e_OnCreateGrid      = []  , // Evento que se activa cuando se crea el grid
    e_OnCreateRow       = []  , // Evento que se activa cuando se crea un renglos de datos
    e_OnDataBind        = []  , // Evento que se activa cuando los datos se han cargado completamente pero aun no se crea la tabla
    e_OnDataReceived    = []  , // Evento que se dispara cuando se ha recivido informacion del Servidor
    e_OnDataValueChange = []  , // Evento que se activa cuando los datos se han cargado completamente pero aun no se crea la tabla
    e_OnDispose         = []  , // Evento que se activa cuando se elimina el control
    e_OnItemDeleted     = []  , // Evento que se actica cuando un dato fue eliminado
    e_OnItemEdited      = []  , // Evento que se activa cuando un dato fue editado
    e_OnItemInserted    = []  , // Evento que se activa cuando un dato fue insertado
    e_OnItemSelected    = []  , // Evento que se activa cuando se selecciona un elemento de la tabla o Grid
    e_OnUpdate          = []  ; // Evento que se activa cuando se actualiza los datos de la tabla o Grid

  Object.defineProperties( m_currentItem , { // Propiedades de la clase
    "ElementDOM":{
        get: function( ){ return m_elementDOM ; }
    },
    "ID":{
        get: function( ){ return m_id ; }
    },
    "Buttons":{
        get: function( ){ return m_buttons ; },
        set : function( pAttributeValue ){
          m_buttons = pAttributeValue;
        }
      },
    "Caption":{
        get: function( ){ return m_caption ; },
        set : function( param_AttributeValue ){
          m_caption = param_AttributeValue;
          $(DOM_Header).find("[data-role=headerTitle] small").html( m_caption );
        }
      },
    "Columns":{
        get: function( ){ return m_columns ; },
        set : function( pAttributeValue ){
          m_columns = pAttributeValue;
          for( i = 0 ; i < object_Fields.length ; i++){
            object_Fields[i].Dispose();
          }
          for( i = 0 ;  i < m_columns.length ; i++){
              
            var array_eventOnChange = [];
            if( !m_columns[i].editOptions ){
                m_columns[i].editOptions = {};
            }
            if( typeof m_columns[i].editOptions.OnChange == "function"){
                array_eventOnChange.push( function( param_propertyName , param_value ){
                    for( var i = 0 ; i < e_OnDataValueChange.length ; i++ ){
                        e_OnDataValueChange[i]( m_currentItem , m_editItem ,  m_currentItem.SelectedEditionFields );
                    }
                });
                array_eventOnChange.push( m_columns[i].editOptions["OnChange"] );
                m_columns[i].editOptions["OnChange"] = array_eventOnChange;
            }
            else{
                m_columns[i].editOptions["OnChange"] = function( param_propertyName , param_value ){
                    for( var i = 0 ; i < e_OnDataValueChange.length ; i++ ){
                        e_OnDataValueChange[i]( m_currentItem , m_editItem ,  m_currentItem.SelectedEditionFields , param_propertyName , param_value);
                    }
                }
            }
            var l_ControlBuiler = new jsNorControlBuilder( m_columns[ i ].index , m_columns[i].ControllerType , null , methodPrivate_UpdateEditItem , m_columns[i].editOptions );
            l_ControlBuiler.Editable = m_columns[ i ].editable != undefined && m_columns[ i ].editable != null ? m_columns[ i ].editable : true ;
            object_Fields.push( l_ControlBuiler );
          }
        }
      },
    "ColumnsGrid"   :{ get: function( ){ return m_ColumnGrid    ; }  , set : function( pAttributeValue ){ m_ColumnGrid = pAttributeValue; } },
    "ControllerType":{ get: function( ){ return m_controllerType ; } },
    "Data"          :{ get: function( ){ return m_data           ; }  , set : function( pAttributeValue ){
         m_data = pAttributeValue;
        m_currentItem.Refresh(); 
    } },
    "DataDisplay"   :{ get: function( ){ return m_dataDisplay    ; }  , set : function( pAttributeValue ){ m_dataDisplay = pAttributeValue; } },
    "EditForm"      :{ get: function( ){ return m_editForm       ; }  , set : function( pAttributeValue ){ m_editForm = pAttributeValue; } },
    "EditItem"      :{ get: function( ){ return m_editItem       ; } },
    "Filters"       :{ get: function( ){ return m_filters        ; }  , set : function( pAttributeValue ){ m_filters = pAttributeValue; } },
    "isZebra"       :{ get: function( ){ return m_isZebra        ; }  , set : function( pAttributeValue ){ m_isZebra = pAttributeValue; } },
    "Request" :{
        get: function( ){ return m_request ; },
        set : function( pAttributeValue ){
          if( pAttributeValue instanceof jsNorRequestGroup){
            m_request = pAttributeValue;
          }
          else{
            m_request = new jsNorRequestGroup( pAttributeValue );
          }
        }
      }, 
    "RequestSendAll" :{
        get: function( ){ return m_requestSendAll ; },
        set : function( pAttributeValue ){
            m_requestSendAll= pAttributeValue;
        }
      }, 
    "RowsView" :{
        get: function( ){ return m_rowsView ; },
        set : function( pAttributeValue ){
          m_rowsView = pAttributeValue;
            if( m_rowsView == -1 ){
                $(DOM_Footer).css("display","none");
            }
            else{
                $(DOM_Footer).css("display","block");
            }
            m_currentItem.Refresh();
        }
      },
    "RowsViewOption" :{
        get: function( ){ return m_rowsViewOption ; },
        set : function( pAttributeValue ){
          m_rowsViewOption = pAttributeValue;
          $(DOM_Footer).find("[data-role=control][data-type=rowsOption]").empty();
          for( var i = 0 ;  i < m_rowsViewOption.length ; i++ ){
            $(DOM_Footer).find("[data-role=control][data-type=rowsOption]").append("<option>" + m_rowsViewOption[i] +"</option>");
          }
          m_currentItem.Refresh();
        }
      },
    "SelectedEditionFields" :{
        get: function( ){ 
            var field_row = {};
            for( var i = 0; i < m_columns.length ; i++ ){
                field_row[ m_columns[i].index ] = object_Fields[i];
            }
            return field_row;
        }
      },
    "SelectedItem" :{
        get: function( ){ 
            if( m_indexRow != -1 ) 
                return m_data[ m_indexRow ] ; 
            return null;
        }
      },
    "SelectedIndexRow" :{
        get: function( ){ return m_indexRow ; },
        set : function( pAttributeValue ){
          m_indexRow = pAttributeValue;
        }
      },
    "SelectedIndexView" :{
        get: function( ){ return m_indexView ; },
        set : function( pAttributeValue ){
          m_indexView = pAttributeValue;
        }
      },
    "Size":{
        get: function( ){ return m_size ; },
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
    "Sortable":{
        get: function( ){ return m_sortable ; },
        set : function( pAttributeValue ){
          m_sortable = pAttributeValue;
          m_currentItem.Refresh();
        }
      },
    "SourceType":{
        get: function( ){ return m_sourceType ; },
        set : function( pAttributeValue ){
          m_sourceType = pAttributeValue;
        }
      },
    "Title":{
        get: function( ){ return m_title ; },
        set : function( param_AttributeValue ){
          m_title = param_AttributeValue;
          $(DOM_Header).find("[data-role=headerTitle] h1").html( m_title ).append("<small>"+m_caption+"</small>");
        }
      },
    "TotalRows":{
        get: function( ){ 
            return m_totalRows == -1 ? m_data.length : m_totalRows ; 
        },
      }
  });

  Object.defineProperties( m_currentItem , { // Eventos de la clase
    "BeforeClear"       :{ get: function( ){ return e_BeforeClear       ; }, set : function( param_event ){ e_BeforeClear.push(         param_event ); } },
    "BeforeDelete"      :{ get: function( ){ return e_BeforeDelete      ; }, set : function( param_event ){ e_BeforeDelete.push(        param_event ); } },
    "BeforeDispose"     :{ get: function( ){ return e_BeforeDispose     ; }, set : function( param_event ){ e_BeforeDispose.push(       param_event ); } },
    "BeforeEdit"        :{ get: function( ){ return e_BeforeEdit        ; }, set : function( param_event ){ e_BeforeEdit.push(          param_event ); } },
    "BeforeInsert"      :{ get: function( ){ return e_BeforeInsert      ; }, set : function( param_event ){ e_BeforeInsert.push(        param_event ); } },
    "BeforeShowForm"    :{ get: function( ){ return e_BeforeShowForm    ; }, set : function( param_event ){ e_BeforeShowForm.push(      param_event ); } },
    "OnClear"           :{ get: function( ){ return e_OnClear           ; }, set : function( param_event ){ e_OnClear.push(             param_event ); } },
    "OnCompleted"       :{ get: function( ){ return e_OnCompleted       ; }, set : function( param_event ){ e_OnCompleted.push(         param_event ); } },
    "OnCreateCell"      :{ get: function( ){ return e_OnCreateCell      ; }, set : function( param_event ){ e_OnCreateCell.push(        param_event ); } },
    "OnCreateGrid"      :{ get: function( ){ return e_OnCreateGrid      ; }, set : function( param_event ){ e_OnCreateGrid.push(        param_event ); } },
    "OnCreateRow"       :{ get: function( ){ return e_OnCreateRow       ; }, set : function( param_event ){ e_OnCreateRow.push(         param_event ); } },
    "OnDataBind"        :{ get: function( ){ return e_OnDataBind        ; }, set : function( param_event ){ e_OnDataBind.push(          param_event ); } },
    "OnDataReceived"    :{ get: function( ){ return e_OnDataReceived    ; }, set : function( param_event ){ e_OnDataReceived.push(      param_event ); } },
    "OnDataValueChange" :{ get: function( ){ return e_OnDataValueChange ; }, set : function( param_event ){ e_OnDataValueChange.push(   param_event ); } },
    "OnDispose"         :{ get: function( ){ return e_OnDispose         ; }, set : function( param_event ){ e_OnDispose.push(           param_event ); } },
    "OnItemDeleted"     :{ get: function( ){ return e_OnItemDeleted     ; }, set : function( param_event ){ e_OnItemDeleted.push(       param_event ); } },
    "OnItemEdited"      :{ get: function( ){ return e_OnItemEdited      ; }, set : function( param_event ){ e_OnItemEdited.push(        param_event ); } },
    "OnItemInserted"    :{ get: function( ){ return e_OnItemInserted    ; }, set : function( param_event ){ e_OnItemInserted.push(      param_event ); } },
    "OnItemSelected"    :{ get: function( ){ return e_OnItemSelected    ; }, set : function( param_event ){ e_OnItemSelected.push(      param_event ); } },
    "OnUpdate"          :{ get: function( ){ return e_OnUpdate          ; }, set : function( param_event ){ e_OnUpdate.push(            param_event ); } }
  });
  //======================================================================================
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Medio por el cual recibe la informacion del servidor*/
    function methodPrivate__AjaxGetRequest( p_requestType , p_ResponseData ){
        m_loadingPanel.Show(0);
        switch ( p_requestType ) {
            case 0:{ // Metodo select
                if( JSON.isJSON( p_ResponseData ) ){
                    var resultJSON = JSON.parse( p_ResponseData );
                    //=========//=========//=========//=========//=========
                    //  OnDataRecived
                    for( var i = 0 ; i < e_OnDataReceived.length ; i++ ){
                        e_OnDataReceived[i]( m_currentItem , resultJSON );
                    }
                    //=========//=========//=========//=========//=========
                    if( resultJSON.Columns ){
                        if( m_columns.length == 0 ){
                            m_currentItem.Columns = resultJSON.Columns;
                            $(DOM_Header)
                                .find("[data-name=header_"+m_id+"]" )
                                .append( $(_CreateHeader()).find("[data-name=header_"+m_id+"]").get(0).childNodes );
                            $(DOM_Header)
                                .find("[data-role=headerTitle"+m_id+"]" ).parent().attr("colspan", m_columns.length + 1);
                        }
                    } 
                     if( resultJSON.TotalRows ){
                        m_totalRows = resultJSON.TotalRows ;
                    }
                    else{
                        m_totalRows = -1;
                    }
                    if( resultJSON.Data && !resultJSON.Data.length ){
                        var index = 0;
                        m_data =  [];
                        while( resultJSON.Data[index] ){
                            m_data.push( resultJSON.Data[index] );
                            index++;
                        }
                    }
                    else if( resultJSON.Data){
                        m_data = resultJSON.Data ;
                    }
                    else{
                        if( !resultJSON.length ){
                            var index = 0;
                            m_data =  [];
                            while( resultJSON[index] ){
                                m_data.push( resultJSON[index] );
                                index++;
                            }
                        }
                        else{
                            m_data = resultJSON ;
                        }
                    }
                    methodPrivate_BuildingData();
                }
            }break;
            case 1:
            case 2:
            case 3:{
                methodPrivate__AjaxSendRequest(0);
            }break;
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Medio por el cual el grid envia y recibe informcion del Servidor */
    function methodPrivate__AjaxSendRequest( p_requestType ){
        m_loadingPanel.Show(1);
        switch ( p_requestType ) {
            case 0:{ // Metodo select
                l_tempParams = m_filters;
                l_tempParams = l_tempParams ? l_tempParams : {};
                for( propertyKey in m_request.Select.PARAMS ){
                    l_tempParams[ propertyKey ] = m_request.Select.PARAMS[ propertyKey ];
                }
                l_tempParams["__LIMITD__"] = m_rowsView;
                l_tempParams["__STARTD__"] = m_rowsView * m_indexView;
                Ajax_ServerRequest( m_request.Select.URL ,  m_request.Select.METHOD , l_tempParams , function( data ){  methodPrivate__AjaxGetRequest(p_requestType , data )});
            }break;
            case 1:{ // Metodo insert
                l_tempParams = m_request.Insert.PARAMS;
                l_tempParams = l_tempParams ? l_tempParams : {};
                l_tempParams.Data = [];
                //----------------------------------------------------------------------------------------------------------------------------------------------
                if( m_requestSendAll ){
                    for( var i = 0 ;  i < m_data.length ; i++ ){
                        dataSource_temp = {};
                        for( var col = 0 ; col < m_columns.length ; col++){
                            dataSource_temp[ m_columns[ col ].index  ] = m_data[i][ m_columns[ col ].index  ];
                        }
                        l_tempParams.Data.push( dataSource_temp );
                    }
                    l_tempParams.Data.push( m_editItem );
                }
                else{
                    for( propertyKey in m_editItem ){
                        l_tempParams[ propertyKey ] = m_editItem[ propertyKey ];
                    }
                }
                //----------------------------------------------------------------------------------------------------------------------------------------------
                Ajax_ServerRequest( m_request.Insert.URL ,  m_request.Insert.METHOD , l_tempParams , function( data ){  methodPrivate__AjaxGetRequest(p_requestType , data )});
            }break;
            case 2:{ // Metodo Edit
                l_tempParams = m_request.Edit.PARAMS;
                l_tempParams = l_tempParams ? l_tempParams : {};
                l_tempParams.Data = [];
                //----------------------------------------------------------------------------------------------------------------------------------------------
                if( m_requestSendAll ){
                    for( var i = 0 ;  i < m_data.length ; i++ ){
                        dataSource_temp = {};
                        for( var col = 0 ; col < m_columns.length ; col++){
                            if( i == m_indexRow ){
                                dataSource_temp[ m_columns[ col].index  ] = m_editItem[ m_columns[ col ].index  ];
                            }
                            else{
                                dataSource_temp[ m_columns[ col ].index  ] = m_data[i][ m_columns[ col ].index  ];
                            }
                        }
                        l_tempParams.Data.push( dataSource_temp );
                    }
                }
                else{
                    for( propertyKey in m_editItem ){
                        l_tempParams[ propertyKey ] = m_editItem[ propertyKey ];
                    }
                }
                //----------------------------------------------------------------------------------------------------------------------------------------------
                Ajax_ServerRequest( m_request.Edit.URL ,  m_request.Edit.METHOD , l_tempParams , function( data ){  methodPrivate__AjaxGetRequest(p_requestType , data )});
            }break;
            case 3:{ // Metodo Delete
                l_tempParams = m_request.Delete.PARAMS;
                l_tempParams = l_tempParams ? l_tempParams : {};
                l_tempParams.Data = [];
                //----------------------------------------------------------------------------------------------------------------------------------------------
                if( m_requestSendAll ){
                    for( var i = 0 ;  i < m_data.length ; i++ ){
                        dataSource_temp = {};
                        if( i == m_indexRow ){
                            dataSource_temp["__deleted__"] = true;
                        }
                        for( var col = 0 ; col < m_columns.length ; col++){
                            if( i == m_indexRow ){
                                dataSource_temp[ m_columns[ col].index  ] = m_editItem[ m_columns[ col ].index  ];
                            }
                            else{
                                dataSource_temp[ m_columns[ col ].index  ] = m_data[i][ m_columns[ col ].index  ];
                            }
                        }
                        l_tempParams.Data.push( dataSource_temp );
                    }
                }
                else{
                    for( propertyKey in m_editItem ){
                        l_tempParams[ propertyKey ] = m_editItem[ propertyKey ];
                    }
                }
                //----------------------------------------------------------------------------------------------------------------------------------------------
                Ajax_ServerRequest( m_request.Delete.URL ,  m_request.Delete.METHOD , l_tempParams , function( data ){  methodPrivate__AjaxGetRequest(p_requestType , data )});
            }break;
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* funcion que manda a llamar al respectivo constructor del grid  */
    function methodPrivate_BuildingData( ){
        for( var i = 0 ; i < e_OnDataBind.length ; i++ ){
            e_OnDataBind[i]( m_currentItem , m_data );
        }
        //-------------------------------------------------------------
        // Selecciona entre los diferentes forma de visualizar el grid
        if( m_dataDisplay == "ROWS"){
            //-------------------------------------------------------------
            // Diferencia si esta habiliado el ordenamiento o no
            if( !m_sortable ){
                methodPrivate_CreateBody();
            }
            else{ 
                methodPrivate_CreateList(); 
            }
        }
        else if( m_dataDisplay == "GRID"){
            methodPrivate_CreateGrid();
        }
        //-------------------------------------------------------------
        for( var i = 0; i < e_OnCompleted.length ; i++){
            e_OnCompleted[i]( m_currentItem , this );
        }
        methodPrivate_OnUpdate();
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Crea un arrreglo que contiene las longitudes de los campos  */
    function methodPrivate_CreateArraySizes( isEdicion  , elementWidth ){
        var array_sizes = [];
        var size_body = elementWidth ? elementWidth : $(m_elementDOM).width();
        var empty_columns = 0;
        for( var i = 0 ; i < m_columns.length ; i++){
            
            if( isEdicion && m_columns[i].hidden ){
                array_sizes.push(-1);
                empty_columns++;
                continue;
            }
            else if( !isEdicion && m_columns[i].visible != undefined && m_columns[i].visible != null && !m_columns[i].visible ){
                array_sizes.push(-1);
                empty_columns++;
                continue;
            }
            if( !m_columns[i].width ){
                array_sizes.push(-1);
            }
            else if( m_columns[i].width.indexOf("%") == -1 ){
                array_sizes.push( parseInt(m_columns[i].width) );
                size_body+= -parseInt(m_columns[i].width);
            }
            else{
                array_sizes.push( $(m_elementDOM).width()*(parseInt(m_columns[i].width)/100 ) );
                size_body+= -( $(m_elementDOM).width()*(parseInt(m_columns[i].width)/100 ));
            }
        }
        return { "ArraySize" : array_sizes  ,"EmptyColumns" : m_columns.length - empty_columns  - 1 , "SizeBody": size_body };
    }
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Limpia los controles de los formularios */
  function methodPrivate_ClearFormFields(){
    for( var i = 0 ; i < object_Fields.length ; i++){
        object_Fields[i].Clear();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  /*    */
    function methodPrivate_CreateBody( ){
        $(DOM_Body).find("[data-row-index]").remove();
        var row_counter = 0;
        var row_views_counter = 0;
        for( var i = 0 ; i < m_data.length ; i++){
            var itemRow = methodPrivate_CreateRow( m_data[i] );
            $(itemRow)
                .find("[data-role=command-controller]")
                .attr("data-row-index", i );
            if( m_isZebra && i % 2 == 0 ){
                $(itemRow).addClass("jsNorGrid-Row-On"); 
            }
            else if( m_isZebra && i % 2 != 0 ){
                $(itemRow).addClass("jsNorGrid-Row-Off"); 
            }
            $(itemRow)
                .addClass("jsNorGrid-Row")
                .attr("data-row-index", i )
                .click(function(){
                    if( m_editItem["__op__"] ){
                        return;
                    }
                    $(DOM_Body).find("[data-row-index]").removeClass("jsNorGrid-Row-Selected");
                    $( this ).addClass("jsNorGrid-Row-Selected");
                    m_currentItem.SelectedIndexRow = parseInt( $(this).attr("data-row-index")); 
                    for( var c = 0 ;  c < e_OnItemSelected.length ; c++ ){
                        e_OnItemSelected[c]( m_currentItem , m_data[ m_currentItem.SelectedIndexRow ] );
                    }
                });

            if( m_rowsView != -1 ){
                $(itemRow).attr("data-row-view", row_views_counter );
                row_counter++;
                if( row_counter >= m_rowsView ){
                    row_views_counter++;
                    row_counter = 0;
                }
            }
            $(DOM_Body).append( itemRow );
            methodPrivate_DataBindRow( m_data[i] , i , itemRow );
        }
        m_loadingPanel.Show(0);
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Creacion del elemento base que se visualiza en el grid */
    function methodPrivate_CreateCell( param_DataCell , param_viewOptions  , param_columnIndex , param_DataRow ){
        var customizeDOM = null;
        for( var i = 0 ;  i < e_OnCreateCell.length ; i++ ){
            customizeDOM = e_OnCreateCell[i]( m_columns[ param_columnIndex ].index , param_DataCell , param_viewOptions , param_DataRow );
        }
        var elementDIV_Celda = customizeDOM ? customizeDOM : document.createElement("div");
        $(elementDIV_Celda).attr("data-role","jsNorGrid-Cell");
        //-----------------------------------------------------------------------------
        if( customizeDOM != null ){
            return customizeDOM;
        }
        //-----------------------------------------------------------------------------
        // Si el valor no esta definido o esta en vacio , colocamos un especio en blanco
        if( param_DataCell== null || param_DataCell == undefined || param_DataCell.length == 0 ){
            $(elementDIV_Celda).html("&nbsp");
            return elementDIV_Celda;
        }
        $(elementDIV_Celda).css("text-align","center");
        //-----------------------------------------------------------------------------
        // Para eviar varias comparaciones , si no esta inializado el elemento 'param_viewOptions', lo creamos vacio
        if( !param_viewOptions ){
            param_viewOptions = {};
        }
        //---------------------
        // Agregamos una clase 
        if( param_viewOptions.Class ){
            $(elementDIV_Celda).addClass( param_viewOptions.Class  );
        }
        //----------------------------------------------------
        // Renderiza el valor dependiendo al tipo especificado
        switch ( parseInt( param_viewOptions.ControllerType ) ){
            case ControllerTypesOptions.Int       : // Entero
            case ControllerTypesOptions.Float     :{ // Decimal
                $(elementDIV_Celda).append("<span >"+ param_DataCell+"</span>");
            }break;
            case ControllerTypesOptions.Text      : // Texto
            case ControllerTypesOptions.String    :{ // Cadena
                if( param_viewOptions.MaxLenght ){
                    $(elementDIV_Celda).append("<span>"+ param_DataCell.substr(0 , param_viewOptions.MaxLenght)+"...</span>");
                }
                else{
                    $(elementDIV_Celda).append("<span>"+ param_DataCell+"</span>");
                }
            }break;
            case ControllerTypesOptions.BinaryRadio   :// BinarioRadio
            case ControllerTypesOptions.Binary        :{ // checkbox
                //----------------------------------------------------
                // Evalua los posibles valores , para diferenciar (TRUE | FALSE )
                param_DataCell = param_DataCell == 'Y' ? true  : param_DataCell;
                param_DataCell = param_DataCell == 'True' ? true  : param_DataCell;
                param_DataCell = param_DataCell == 'N' ? false : param_DataCell;
                param_DataCell = param_DataCell == 'on' ? true : param_DataCell;
                param_DataCell = param_DataCell == 'False' ? false : param_DataCell;
                param_DataCell = param_DataCell == 'off' ? false : param_DataCell;
                param_DataCell = param_DataCell.length == 0? false : param_DataCell;

                if( param_viewOptions.TrueValue && JSON.parse(param_DataCell) ){
                    $(elementDIV_Celda).append("<span>"+ param_viewOptions.TrueValue+"</span>");
                }
                else if( param_viewOptions.FalseValue && !JSON.parse(param_DataCell)){
                    $(elementDIV_Celda).append("<span>"+ param_viewOptions.FalseValue+"</span>");
                }
                else if( JSON.parse(param_DataCell) ){
                    $(elementDIV_Celda).append("<span class='glyphicon glyphicon-check' style='color: rgb(100,200,10);'></span>");
                }
                else{
                    $(elementDIV_Celda).append("<span class='glyphicon glyphicon-unchecked' style='color: rgb(200,10,10);'></span>");
                }
            }break;
            case ControllerTypesOptions.Image         :{ // Image
                //----------------------------------------------------
                // Verifica la existencia de la imagen, en caso contrario coloca un espacio en blanco
                imageExists( param_DataCell +"?"+ (new Date().getTime()), function(pRESULT){
                    if(pRESULT){
                        $(elementDIV_Celda).append("<span><img src='"+ param_DataCell +"?"+ new Date().getTime() +"' style='max-height: 100px;'></span>");
                    }
                    else {
                        $(elementDIV_Celda).append("<span><img src='' style='max-height: 100px;'></span>");
                    }
                });
            }break;
            case ControllerTypesOptions.Money         :{ // Moneda
                $(elementDIV_Celda).append("<span>$"+ param_DataCell+"</span>");
            }break;
            case ControllerTypesOptions.Autocomplete         :{ // Moneda
                $(elementDIV_Celda).append("<span>$"+ param_DataCell+"</span>");
            }break;
            case ControllerTypesOptions.Date          : // Fecha
            case ControllerTypesOptions.DateTime:{ /* Hora y Fecha */
                //----------------------------------------------------
                // Define los valores de fecha con un formato dato
                if( param_viewOptions.Format ){
                    var l_dateValue = $.datepicker.formatDate( param_viewOptions.Format , new Date( param_DataCell ));
                    $(elementDIV_Celda).append("<span>"+ l_dateValue+"</span>");
                }
                else{
                    $(elementDIV_Celda).append("<span>"+ param_DataCell+"</span>");
                }
            }break;
            case ControllerTypesOptions.Ranking       :{ // Ranking
                if( param_viewOptions.MaxValue ){
                    $(elementDIV_Celda).append("<span><div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='"+param_DataCell+"' aria-valuemin='0' aria-valuemax='"+param_viewOptions.MaxValue+"' style='width: "+(100*param_DataCell/param_viewOptions.MaxValue)+"%;'>"+(100 * param_DataCell/param_viewOptions.MaxValue)+"%</div></div></span>");
                }
                else{
                    $(elementDIV_Celda).append("<span>"+ param_DataCell+"</span>");
                }
            }break;
            case ControllerTypesOptions.File          :{// File
                if( param_viewOptions.MaxValue ){
                    $(elementDIV_Celda).append("<span><a href='"+param_DataCell+"' download target='_blank'>"+ param_DataCell+"</a></span>");
                }
                else{
                    $(elementDIV_Celda).append("<span>"+ param_DataCell+"</span>");
                }
            }break;
            case ControllerTypesOptions.DateRange     :{ /* Rango Fechas */
                $(elementDIV_Celda).append("<span>"+ param_DataCell+"</span>");
            }break;
            case ControllerTypesOptions.Grid          :{// Grid
                if( param_viewOptions.Total ){
                    $(elementDIV_Celda).append("<span class='badge'>"+ param_DataCell.length+" units</span>");
                }
                else if( param_viewOptions.IndexColumn ){
                    for( var i = 0 ; i < param_DataCell.length ; i++){
                        $(elementDIV_Celda).append("<span class='badge'>"+ param_DataCell[i][ param_viewOptions.IndexColumn ]+"</span>");
                    }
                }
            }break;
            case ControllerTypesOptions.Select    :{// Select
                //----------------------------------------------------------------
                // Si la columna no tiene definina los valores, los vamos a buscar
                if( !param_viewOptions.OptionsValues ){
                    param_viewOptions.OptionsValues = {};
                    var l_TempID = __GetKey( 6 , "TempItem" );
                    param_viewOptions.OnCompleted = function( sender){
                        param_viewOptions.OptionsValues = sender.Configuration.OptionsValues;
                        $(elementDIV_Celda).find("span").html(sender.Text);
                    };
                    var l_TempFIELD = new jsNorControlBuilder( l_TempID , ControllerTypesOptions.Select , param_DataCell , null , param_viewOptions);
                    $(elementDIV_Celda).append("<span></span>");
                }
                //----------------------------------------------------------------------
                // Si la columna tiene definina los valores solo buscamos el mas adecuado
                else{
                    var l_loop = function( p_elementReference , p_optionsArray , p_indexValue ){
                        if( !p_optionsArray.OptionsValues[p_indexValue] ){
                            setTimeout(function(){
                                l_loop(p_elementReference , p_optionsArray ,p_indexValue );
                            },100);
                        }
                        else{
                            $(p_elementReference).append("<span>"+p_optionsArray.OptionsValues[p_indexValue]+"</span>");
                        }
                    };
                    l_loop( elementDIV_Celda, param_viewOptions , param_DataCell );
                }
            }break;
            default:{
                if( param_DataCell.Text ){
                    $(elementDIV_Celda).append("<span style='font-size: 12px; '>" + param_DataCell.Text + "</span>");
                }
                else{
                    $(elementDIV_Celda).append("<span style='font-size: 12px; '>" + param_DataCell + "</span>");
                }
            }
        }
        return elementDIV_Celda;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate_CreateColumnsHeader( p_ColumnHeader ){
        var elementTH = document.createElement("th");
        var elementLabel = document.createElement("h5");
        $(elementLabel)
            .css("margin-bottom","0px")
            .html( p_ColumnHeader.label );
        $(elementTH).append( elementLabel );

        if( p_ColumnHeader.width ){
            $(elementTH).css("width" , p_ColumnHeader.width );
        }
        if( p_ColumnHeader.sortable ){
            $(elementLabel).html("");
            $(elementLabel)
                .append(function(){
                    var elementBUTTON = document.createElement("button");
                    $(elementBUTTON)
                        .css("float","right")
                        .addClass("btn")
                        .addClass("btn-default")
                        .append( p_ColumnHeader.label +"  ")
                        .append("<span class='glyphicon glyphicon-chevron-up' data-sortable='down' ></span>");
                    return elementBUTTON;
                });
        }
        if( p_ColumnHeader.search ){
            $(elementTH)
                .append("<br/>")
                .append(function(){
                    var elementDIV_GROUP = document.createElement("div");
                    $(elementDIV_GROUP)
                        .addClass("input-group")
                        .append(function(){
                            var elementSPAN = document.createElement("span");
                            $(elementSPAN)
                                .addClass("input-group-btn")
                                .append("<button class='btn btn-default' type='button'>X</button>");
                            return elementSPAN;
                        })
                        .append(function(){
                            var elementINPUT = document.createElement("input");
                            $(elementINPUT)
                                .attr("type","text")
                                .addClass("form-control");
                            return elementINPUT;
                        });
                    return elementDIV_GROUP;
                });
        }
        return elementTH;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* funcion que un control de boton  */
    function methodPrivate_CreateCommandButton( param_buttonText , param_buttonType  , param_buttonICO , param_buttonClick ){
        var elementBUTTON = document.createElement("button");
        $(elementBUTTON)
            .attr("type","button")
            .attr("data-role","command-controller")
            .addClass("btn btn-sm")
            .addClass( param_buttonType )
            .append( param_buttonICO    )
            .append( param_buttonText   )
            .click( param_buttonClick   );
        return elementBUTTON;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* funcion que crea los controles para editar y eliminar un elemento  */
    function methodPrivate_CreateCommandsButtons( ){
        if( typeof m_buttons == "boolean" && !m_buttons ){
            return;
        }
        var elementDIV_GROUP = document.createElement("div");
        //-------------------------------------------------------------
        // Creacion del comando para Editar un elemento
        if( m_buttons.Edit ){
            var buttonICON   = m_buttons.Edit.Icon    ? m_buttons.Edit.Icon   : "glyphicon glyphicon-pencil";
            var buttonCLASS  = m_buttons.Edit.Class   ? m_buttons.Edit.Class  : "btn-info";
            var buttonTEXT   = m_buttons.Edit.Text    ? m_buttons.Edit.Text   : "";
            var buttonCLICK  = m_buttons.Edit.Click   ? function(){ m_currentItem.ReadEditItem( m_buttons.Edit.Click , this  );  } : m_currentItem.ReadEditItem ;

            if( !m_buttons.Edit.Hidden ){
                $( elementDIV_GROUP ).append( methodPrivate_CreateCommandButton( buttonTEXT , buttonCLASS  , "<span class='"+buttonICON+"'></span>" , buttonCLICK ) );
            }
        }
        else{
            $( elementDIV_GROUP ).append( methodPrivate_CreateCommandButton( "" , "btn-info"  , "<span class='glyphicon glyphicon-pencil'></span>" , m_currentItem.ReadEditItem  ) );
        }
        //-------------------------------------------------------------
        // Creacion del comando para Eliminar un elemento
        if( m_buttons.Delete ){
            var buttonICON   = m_buttons.Delete.Icon  ? m_buttons.Delete.Icon  : "glyphicon glyphicon-trash";
            var buttonCLASS  = m_buttons.Delete.Class ? m_buttons.Delete.Class  : "btn-danger";
            var buttonTEXT   = m_buttons.Delete.Text  ? m_buttons.Delete.Text  : "";
            var buttonCLICK  = m_buttons.Delete.Click ? function(){ m_currentItem.DeleteEditItem( m_buttons.Delete.Click , this );  } : m_currentItem.DeleteEditItem ;

            if( !m_buttons.Delete.Hidden ){
                $( elementDIV_GROUP ).append( methodPrivate_CreateCommandButton( buttonTEXT , buttonCLASS  , "<span class='"+buttonICON+"'></span>" , buttonCLICK ) );
            }
        }
        else{
            $( elementDIV_GROUP ).append( methodPrivate_CreateCommandButton( "" , "btn-danger"  , "<span class='glyphicon glyphicon-trash'></span>" , m_currentItem.DeleteEditItem ) );
        }
        
        return elementDIV_GROUP;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateFooters(){
        var l_elementTFOOT = document.createElement("tfoot");
        $(l_elementTFOOT)
            .attr("data-name","footer_"+m_id)
            .css({
                "width": m_size ? m_size.Width : ""
            })
            .append(function(){
                var l_elementTR = document.createElement("tr");
                $(l_elementTR).append(function(){
                    var l_elementTD = document.createElement("td");
                    $(l_elementTD)
                        .attr("colspan" , m_columns.length )
                        .attr("align","center")
                        .append(function(){
                            var l_elementDIV_Container = document.createElement("div");
                            $(l_elementDIV_Container)
                                .addClass("input-group")
                                .append(function(){ // Contenedor de Navegador Before
                                    var l_elementDIV = document.createElement("div");
                                    $(l_elementDIV)
                                        .addClass("input-group-btn")
                                        .append(function(){// Boton de navegacion hasta el inicio
                                        var l_elementBUTTON = document.createElement("button");
                                        $(l_elementBUTTON)
                                            .addClass("btn")
                                            .addClass("btn-default")
                                            .css({
                                                "height":"34px"
                                            })
                                            .append("<span class='glyphicon glyphicon-fast-backward'></span>")
                                            .click(function(){
                                                m_indexView =  0 ; 
                                                m_currentItem.Refresh();
                                            });
                                        return l_elementBUTTON;
                                        })
                                        .append(function(){// Boton de navegacion anterior
                                        var l_elementBUTTON = document.createElement("button");
                                        $(l_elementBUTTON)
                                            .addClass("btn")
                                            .addClass("btn-default")
                                            .css({
                                                "height":"34px"
                                            })
                                            .append("<span class='glyphicon glyphicon-step-backward'></span>")
                                            .click(function(){
                                                m_indexView--; 
                                                if( m_indexView < 0 ){
                                                    m_indexView = 0;
                                                }
                                                m_currentItem.Refresh();
                                            });
                                        return l_elementBUTTON;
                                        });
                                    return l_elementDIV;
                                })
                                .append(function(){ // Contenedor de Navegador Pages
                                    var l_elementINPUT = document.createElement("input");
                                    $(l_elementINPUT)
                                        .attr("type","text")
                                        .attr("data-role","label")
                                        .attr("data-type","current-view")
                                        .addClass("form-control text-center")
                                        .change(function(){
                                            if(  isNaN( parseInt( $(this).val()) ) || parseInt( $(this).val()) < 0 ){
                                                return;
                                            }
                                            m_indexView =  parseInt( $(this).val() ) -1 ; 
                                            m_currentItem.Refresh();
                                        })
                                        .css({
                                            "margin-left":"20%",
                                            "width":"30%"
                                        }); 
                                    return l_elementINPUT;
                                })
                                .append(function(){ // Contenedor de Navegador Pages
                                    var l_elementINPUT = document.createElement("label");
                                    $(l_elementINPUT)
                                        .attr("data-role","label")
                                        .attr("data-type","total-views")
                                        .addClass("form-control")
                                        .html(" de " + m_data.length )
                                        .css({
                                            "background-color":"transparet",
                                            "border":"none",
                                            "width":"30%"
                                        }); 
                                    return l_elementINPUT;
                                })
                                .append(function(){ // Contenedor de Navegador After
                                    var l_elementDIV = document.createElement("div");
                                    $(l_elementDIV)
                                        .addClass("input-group-btn")
                                        .append(function(){// Boton de navegacion siguiete
                                            var l_elementBUTTON = document.createElement("button");
                                            $(l_elementBUTTON)
                                            .addClass("btn")
                                            .addClass("btn-default")
                                            .css({
                                                "height":"34px"
                                            })
                                            .append("<span class='glyphicon glyphicon-step-forward'></span>")
                                            .click(function(){
                                                m_indexView++;
                                                var max_indexView = 0;
                                                if( m_totalRows == -1){
                                                     max_indexView = Math.ceil( m_data.length / m_rowsView )  -1; 
                                                }
                                                else{
                                                     max_indexView = Math.ceil( m_totalRows / m_rowsView ) -1; 
                                                }
                                                if(m_indexView >= max_indexView){
                                                    m_indexView = max_indexView;
                                                } 
                                                m_currentItem.Refresh();
                                            });
                                            return l_elementBUTTON;
                                        })
                                        .append(function(){// Boton de navegacion hasta el final
                                            var l_elementBUTTON = document.createElement("button");
                                            $(l_elementBUTTON)
                                            .addClass("btn")
                                            .addClass("btn-default")
                                            .css({
                                                "height":"34px"
                                            })
                                            .append("<span class='glyphicon glyphicon-fast-forward'></span>")
                                            .click(function(){
                                                var max_indexView = 0;
                                                if( m_totalRows == -1){
                                                     max_indexView = Math.ceil( m_data.length / m_rowsView )  -1; 
                                                }
                                                else{
                                                     max_indexView = Math.ceil( m_totalRows / m_rowsView ) -1; 
                                                }
                                                m_indexView = max_indexView; 
                                                m_currentItem.Refresh();
                                            });
                                            return l_elementBUTTON;
                                        });
                                    return l_elementDIV;
                                })
                                .append(function(){ // Select
                                    var l_elementDIV_fixed = document.createElement("div");
                                    $(l_elementDIV_fixed)
                                        .addClass("input-group-btn")
                                        .append(function(){
                                            var l_elementSELECT = document.createElement("select");
                                            $(l_elementSELECT)
                                                .attr("data-role","control")
                                                .attr("data-type","rowsOption")
                                                .addClass("form-control")
                                                .css({
                                                    "width":"100px"
                                                })
                                                .change(function(){
                                                    m_rowsView = $(this).val();
                                                    var max_indexView = parseInt( m_data.length / m_rowsView ) - 1; 
                                                    if( m_indexView > max_indexView){
                                                        m_indexView = max_indexView ;
                                                    }
                                                    m_currentItem.Refresh();
                                                });
                                                for( var i_op = 0 ; i_op < m_rowsViewOption.length ;  i_op++ ){
                                                    $(l_elementSELECT).append("<option>"+ m_rowsViewOption[i_op] +"</option>");
                                                }
                                            return l_elementSELECT;
                                        });
                                    return l_elementDIV_fixed;
                                })
                                .append(function(){ // Contenedor de Navegador Pages
                                    var l_elementINPUT = document.createElement("label");
                                    $(l_elementINPUT)
                                        .attr("data-role","label")
                                        .attr("data-type","total-records")
                                        .addClass("form-control")
                                        .html( m_data.length +" items ")
                                        .css({
                                            "border":"none",
                                            "background-color":"transparet",
                                        }); 
                                    return l_elementINPUT;
                                });
                            return l_elementDIV_Container;
                        });
                    return l_elementTD;
                });
                return l_elementTR;
            });
        return l_elementTFOOT;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateForm(){
        var elementDIV_FORM = document.createElement("div");
        $(elementDIV_FORM)
            .append(function(){
                var elementFORM = document.createElement("form");
                for( var i = 0 ; i < m_columns.length ; i++ ){
                    if( m_columns[ i ].hidden ){
                        continue;
                    }
                    $( object_Fields[i].ElementDOM )
                        .addClass("form-group")
                        .prepend("<label style='width:100%;' for='"+ m_columns[ i ].index +"' >"+ m_columns[ i ].label +"</label>");
                    $(elementFORM).append( object_Fields[i].ElementDOM  );
                }
                return elementFORM;
            })
            .dialog({
                autoOpen  : false,
                draggable : false,
                resizable : false,
                width     : ( $(window).width()*0.5 ),
                modal     : true ,
                title     : "Edicion",
                create: function( event, ui ) {
                    var array_buttons = $(".ui-dialog-buttonset").find("button:not(.btn)");
                    $(".ui-dialog-titlebar-close:not(.btn)")
                        .addClass("btn btn-danger")
                        .append("<span class='glyphicon glyphicon-remove' ></span>");
                    for( i = 0 ; i < array_buttons.length ; i++ ){
                        if( $(array_buttons[i]).html() == "Aceptar"){
                            $(array_buttons[i]).addClass("btn btn-success");
                        }
                        else{
                            $(array_buttons[i]).addClass("btn btn-danger");
                        }
                    }
                },
                buttons   :{
                    Aceptar: function() {
                        if( m_currentItem.SaveEditItem() ){
                            $(elementDIV_FORM).dialog( "close" );
                        }
                    },
                    Cancel: function() {
                        m_currentItem.HideForm();
                        $(elementDIV_FORM).dialog( "close" );
                    }
                }
            });
        return DOM_Form = elementDIV_FORM;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateFormLi( ){
        var elementTR_FORM = document.createElement("li");
        var existImage = false;
        for( var i = 0 ; i < m_columns.length ; i++){
            if( m_columns[ i ].ControllerType == ControllerTypesOptions.Image ){
                existImage = true;
                break;
            }
        }
        $(elementTR_FORM)
            .css({
                "height": ( existImage ? "125px": "70px")
            })
            .append(function(){
                var elementDIV_GROUP = document.createElement("div");
                $(elementDIV_GROUP)
                    .css({
                        "float":"left",
                        "margin-left":"-50px"
                    })
                    .addClass("btn-group-vertical")
                    .append( methodPrivate_CreateCommandButton( "" , "btn-warning"  , "<span class='glyphicon glyphicon-floppy-disk'></span>" , m_currentItem.SaveEditItem  ) )
                    .append( methodPrivate_CreateCommandButton( "" , "btn-danger"  , "<span class='glyphicon glyphicon-remove'></span>" , m_currentItem.HideForm  ) );
                return elementDIV_GROUP;
            });
            
        var dimensionJSON = methodPrivate_CreateArraySizes( true );
        var array_sizes = dimensionJSON.ArraySize;
        var size_body = dimensionJSON.SizeBody;
        var empty_columns = dimensionJSON.EmptyColumns;
        empty_columns = empty_columns > 0 ? empty_columns + 1 : 1;
        //-----------------------------------------------------------
        // Recorremos las columnas para crear cada campo
        for( var i = 0 ; i < m_columns.length ; i++){
            if( m_columns[ i ].hidden ){
                continue;
            }
            var elementTD_FORM = document.createElement("td");
            $( object_Fields[i].ElementDOM )
                .css({ "padding-left":"0px" })
                .addClass("form-group");

            if( array_sizes[i] != -1){
                $(elementTD_FORM).css("width",array_sizes[i]);
            }
            else{
                $(elementTD_FORM).css("width", parseInt( size_body / empty_columns));
            }
            
            $( elementTD_FORM )
                .css({
                    "float"         : "left" ,
                    "padding-left"  : "10px",
                    "vertical-align":"top"
                })
                .append( object_Fields[i].ElementDOM  );
            $( elementTR_FORM ).append( elementTD_FORM  );
        }
        DOM_Form = elementTR_FORM;
        $(DOM_Form)
            .attr("id", __GetKey(5 ,"FormRow"))
            .css("display","none");
        if( m_indexRow == -1 ){
            $(DOM_Body).find("ul").append( DOM_Form );
        }
        else{
            $(DOM_Form).insertBefore("li[data-row-index="+m_indexRow+"]");
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateFormPanel( param_DataRow ){
        var elementDIV = document.createElement("div");
        var sizeCounter = 0;
        var sizeCounterImage = 0;
        for(var i = 0 ; i < m_columns.length ; i++ ){
            if( m_columns[i].hidden){
                continue;
            }
            if( m_columns[i].ControllerType == ControllerTypesOptions.Image ){
                sizeCounter+= 3;
            }
            else{
                sizeCounter++;
            }
        }
        $(elementDIV)
            .css({
                "height"   :  sizeCounter * 68
            })
            .addClass("panel panel-primary col-sm-" + m_ColumnGrid );
            
        var dimensionJSON = methodPrivate_CreateArraySizes( false ,  $(m_elementDOM).width()*( m_ColumnGrid / 12 ) );
        var array_sizes = dimensionJSON.ArraySize;
        var size_body = dimensionJSON.SizeBody;
        var empty_columns = dimensionJSON.EmptyColumns;
        empty_columns = empty_columns > 0 ? empty_columns + 1 : 1;
        //-----------------------------------------------------------
        // Recorremos las columnas para crear cada campo
        for( var i = 0 ; i < m_columns.length ; i++){
            var itemCell = object_Fields[i].ElementDOM ;
            if( m_columns[i].hidden ){
                continue;
            }
            $(itemCell).prepend("<h4 class='text-left'><small>"+ m_columns[i].label +"</small></h4>")
                .css("width","100%");
            if( array_sizes[i] != -1){
                $(itemCell).css("width",array_sizes[i]);
            }
            else if(  m_columns[i].width ){
                $(itemCell).css("width", m_columns[i].width  );
            }
            $(elementDIV).append( itemCell );
        }
        DOM_Form = elementDIV;
        $(DOM_Form)
            .attr("id", __GetKey(5 ,"FormPanel"))
            .css("display","none")
            .append(function(){
                var elementDIV_GROUP = document.createElement("div");
                $(elementDIV_GROUP)
                    .css({
                        "width":"100%",
                        "margin-top":"20px"
                    })
                    .addClass("btn-group")
                    .append( methodPrivate_CreateCommandButton( "" , "btn-warning col-xs-6 col-sm-6"  , "<span class='glyphicon glyphicon-floppy-disk'></span>" , m_currentItem.SaveEditItem  ) )
                    .append( methodPrivate_CreateCommandButton( "" , "btn-danger col-xs-6 col-sm-6"  , "<span class='glyphicon glyphicon-remove'></span>" , m_currentItem.HideForm  ) );
                return elementDIV_GROUP;
            });;
            
        if( m_indexRow == -1 ){
            $(DOM_Body).prepend(DOM_Form);
        }
        else{
            $(DOM_Form).insertBefore(".panel[data-row-index="+m_indexRow+"]");
        }
        return elementDIV;
    }
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateFormRow( ){
        var elementTR_FORM = document.createElement("tr");
        $(elementTR_FORM).append(function(){
        var elementTD_GROUP = document.createElement("td");
        $(elementTD_GROUP)
            .append(function(){
            var elementDIV_GROUP = document.createElement("div");
            $(elementDIV_GROUP)
                .addClass("btn-group-vertical")
                .append( methodPrivate_CreateCommandButton( "" , "btn-warning"  , "<span class='glyphicon glyphicon-floppy-disk'></span>" , m_currentItem.SaveEditItem  ) )
                .append( methodPrivate_CreateCommandButton( "" , "btn-danger"  , "<span class='glyphicon glyphicon-remove'></span>" , m_currentItem.HideForm  ) );
            return elementDIV_GROUP;
            });
        return elementTD_GROUP;
        });
        var dimensionJSON = methodPrivate_CreateArraySizes( true );
        var array_sizes = dimensionJSON.ArraySize;
        var size_body = dimensionJSON.SizeBody;
        var empty_columns = dimensionJSON.EmptyColumns;
        for( var i = 0 ; i < m_columns.length ; i++){
            if( m_columns[ i ].hidden ){
                continue;
            }
            var elementTD_FORM = document.createElement("td");
            $( object_Fields[i].ElementDOM )
                .css({"padding-left":"0px"})
                .addClass("form-group");

            if( array_sizes[i] != -1){
                $(elementTD_FORM).css("width",array_sizes[i]);
            }
            else{
                $(elementTD_FORM).css("width", size_body / empty_columns);
            }
            
            $( elementTD_FORM )
                .css({"padding-left":"0px"})
                .append( object_Fields[i].ElementDOM  );
            $( elementTR_FORM ).append( elementTD_FORM  );
        }
        DOM_Form = elementTR_FORM;
        $(DOM_Form)
            .attr("id", __GetKey(5 ,"FormRow"))
            .css("display","none");
        if( m_indexRow == -1 ){
            $(DOM_Body).append( DOM_Form );
        }
        else{
            $(DOM_Form).insertBefore("tr[data-row-index="+m_indexRow+"]");
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateGrid(){
        $(DOM_Body).find(".data-containerPanel").find(".panel[data-row-index]").remove();
        if( $(DOM_Body).find(".data-containerPanel").length == 0 ){
            $(DOM_Body)
                .append(function(){
                    var elementTR = document.createElement("tr");
                    $(elementTR).append(function(){
                        var elementTD = document.createElement("td");
                        $(elementTD)
                        .attr("align","center")
                        .css("width", $(m_elementDOM).width() )
                        .attr("colspan", m_columns.length + 1 )
                        .append(function(){
                            var elementDIV = document.createElement("div");
                            $(elementDIV).addClass("data-containerPanel");
                            return elementDIV;
                        });
                        return elementTD;
                    });
                    return elementTR;
            });
        }
        var sizeCounter = 0;
        for(var i = 0 ; i < m_columns.length ; i++ ){
            if( !m_columns[i].visible && m_columns[i].visible != null && m_columns[i].visible!= undefined){
                continue;
            }
            else if( m_columns[i].ControllerType == ControllerTypesOptions.Image ){
                sizeCounter+= 2;
            }
            else{
                sizeCounter++;
            }
        }
        for( var i = 0 ; i < m_data.length ; i++){
            var itemRow = methodPrivate_CreatePanel( m_data[i] );
                
            $(itemRow)
                .css({
                    "height"   :  sizeCounter* 55 ,
                    "position" : "relative"
                })
                .addClass("jsNorGrid-Row")
                .attr("data-row-index", i )
                .append(function(){
                    var elementDIV_GROUP = methodPrivate_CreateCommandsButtons();
                    $(elementDIV_GROUP)
                    .css({
                        "width":"100%",
                        "position":"absolute",
                        "bottom":"2px",
                        "left":"0.5px"
                    })
                    .addClass("btn-group")
                    return elementDIV_GROUP;
                })
                .click(function(){
                    if( m_editItem["__op__"] ){
                        return;
                    }
                    $(DOM_Body).find("[data-row-index]").removeClass("jsNorGrid-Row-Selected");
                    $( this ).addClass("jsNorGrid-Row-Selected");
                    m_currentItem.SelectedIndexRow = parseInt( $(this).attr("data-row-index")); 
                    for( var c = 0 ;  c < e_OnItemSelected.length ; c++ ){
                        e_OnItemSelected[c]( m_currentItem , m_data[ m_currentItem.SelectedIndexRow ] );
                    }
                });
                
            $(itemRow)
                .find("[data-role=command-controller]")
                .attr("data-row-index", i );   
            if( m_sortable ){
            $(itemRow)
            .append( function(){
                var elementSPAN = document.createElement("span");
                $(elementSPAN)
                .css({
                    "position":"absolute",
                    "top":"2px",
                    "left":"2px"
                })
                .addClass("glyphicon glyphicon-move")
                .addClass("btn btn-default")
                .addClass("handleSortable");
                return elementSPAN;
            });
            }
            $(DOM_Body).find(".data-containerPanel").append( itemRow );
            methodPrivate_DataBindRow( m_data[i] , i , itemRow );
        }
        if( m_sortable ){
           $(DOM_Body).find(".data-containerPanel").sortable({
                handle : ".handleSortable" ,
                update : function( event , ui ){ 
                    m_currentItem.HideForm();
                    m_currentItem.UpdateItems(); 
                }
            });
        }
        m_loadingPanel.Show(0);
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*   */
    function methodPrivate_CreateHeader(){
        var l_elementTHEAD = document.createElement("thead");
        $(l_elementTHEAD)
            .append(function(){
                var elementTR = document.createElement("tr");
                $(elementTR)
                    .append(function(){
                        var elementTH = document.createElement("th");
                        $(elementTH)
                            .attr("colspan", m_columns.length + 1 )
                            .css({
                                "border":"none",
                                "width" : m_size ? m_size.Width : ""
                            })
                            .append( function(){
                                var elementDIV_HEADER = document.createElement("div");
                                $(elementDIV_HEADER)
                                    .attr("data-role","headerTitle" + m_id )
                                    .append( function(){
                                        if( typeof m_buttons == "boolean" && !m_buttons ){
                                            return;
                                        }
                                        var buttonTEXT = "Agregar "+m_title ;
                                        var buttonCLICK = function(){
                                            if( m_indexRow != -1){
                                                m_currentItem.HideForm();
                                            }
                                            
                                            m_editItem = {};
                                            for( var i = 0 ; i < m_columns.length ; i++ ){
                                                m_editItem[ m_columns[i].index ] = null;
                                                object_Fields[ i ].Clear();
                                            }
                                            m_indexRow = -1;
                                            m_editItem["__op__"] = "INSERT";
                                            methodPrivate_ClearFormFields();
                                            m_currentItem.ShowForm();
                                        };
                                        if( m_buttons.Insert ){
                                            var buttonICON  = m_buttons.Insert.Icon  ? m_buttons.Insert.Icon  : "glyphicon glyphicon-plus";
                                            buttonTEXT      = m_buttons.Insert.Text  ? m_buttons.Insert.Text  : buttonTEXT;
                                            buttonCLICK     = m_buttons.Insert.Click ? m_buttons.Insert.Click : buttonCLICK;
                                            if( !m_buttons.Insert.Hidden ){
                                                var  buttonFIXED_Position = methodPrivate_CreateCommandButton( buttonTEXT , "btn-success"  , "<span class='"+buttonICON+"'></span>" , buttonCLICK );
                                                $(buttonFIXED_Position).css("float","left");
                                                
                                                return buttonFIXED_Position;
                                            }
                                            return null;
                                        }
                                        var  buttonFIXED_Position = methodPrivate_CreateCommandButton( buttonTEXT , "btn-success"  , "<span class='glyphicon glyphicon-plus'></span> " , buttonCLICK  );
                                        $(buttonFIXED_Position).css("float","left");
                                        return buttonFIXED_Position;
                                    })
                                    .append("<h3 style='margin:0px; margin-left: 50px; float:left;'>"+ m_title +" <small> "+ m_caption +" </small></h3>")
                                    .append( $(methodPrivate_CreateCommandButton( "" , "btn-default" , "<span class='glyphicon glyphicon-refresh'></span>" , function(){
                                        m_currentItem.Refresh();
                                    })).css("float","right") )
                                    .append( $(methodPrivate_CreateCommandButton( "" , "btn-default" , "<span class='glyphicon glyphicon-download'></span>" , function(){
                                        m_currentItem.DownloadData();
                                    })).css("float","right") );
                                return elementDIV_HEADER;
                            });
                        return elementTH;
                    });
                return elementTR;
        })
        .append(function(){
            var elementTR = document.createElement("tr");
            $(elementTR)
                .attr("data-name","header_"+m_id)
                .append(function(){
                    var dimensionJSON = methodPrivate_CreateArraySizes( false );
                    var array_sizes = dimensionJSON.ArraySize;
                    var size_body = dimensionJSON.SizeBody;
                    var empty_columns = dimensionJSON.EmptyColumns;
                    
                    var array_columnsHeader = [];
                    array_columnsHeader.push( document.createElement("td") );
                    for( var i = 0; i < m_columns.length ; i++){
                        var itemColumn = methodPrivate_CreateColumnsHeader( m_columns[ i ] );
                        $(itemColumn)
                            .attr("data-column",m_id+"_"+m_columns[ i ].index )
                            .find("[data-sortable]")
                            .attr("data-column",m_id+"_"+m_columns[ i ].index )
                            .click( function(){ 
                                var data_column = $(this).attr("data-column").split("_");
                                var direccion = $(this).attr("data-sortable") == "down";
                                methodPrivate__SortDataSource( data_column[ data_column.length - 1 ]  , direccion ); 
                                if( direccion ){
                                    $(this).attr("data-sortable" , "up");
                                }
                                else{
                                    $(this).attr("data-sortable" , "down");
                                }
                            });
                        if(  m_columns[i].visible != undefined && m_columns[i].visible != null && !m_columns[i].visible ){
                            $(itemColumn).css("display","none");
                        }
                        
                        if( array_sizes[i] != -1){
                            $(itemColumn).css("width",array_sizes[i]);
                        }
                        else{
                            $(itemColumn).css("width", size_body / empty_columns);
                        }
                        $(itemColumn).css("text-align","center");
                        array_columnsHeader.push( itemColumn );
                    }
                    return array_columnsHeader;
                });
            return elementTR;
        });
        return l_elementTHEAD;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Creacion del elemnto base que se visualiza en el grid */
    function methodPrivate_CreateLI( param_DataRow ){
        var elementLI = document.createElement("li");
        $(elementLI)
            .css({
                "width": $(m_elementDOM).width() ,
                "height":"70px"
            })
            .append(function(){
                var elementDIV_GROUP = methodPrivate_CreateCommandsButtons();
                $(elementDIV_GROUP)
                    .addClass("btn-group-vertical")
                    .css({
                    "float":"left",
                    "margin-left":"-50px"
                    })
                    .append( function(){
                        var elementSPAN = document.createElement("span");
                        $(elementSPAN)
                            .addClass("glyphicon glyphicon-move")
                            .addClass("btn btn-default btn-xs")
                            .addClass("handleSortable");
                        return elementSPAN;
                    });
                return elementDIV_GROUP;
            });
            
        //-----------------------------------------------------------
        // Procedimiento para calcular el ancho de cada columna
        var dimensionJSON = methodPrivate_CreateArraySizes( false );
        var array_sizes = dimensionJSON.ArraySize;
        var size_body = dimensionJSON.SizeBody - 50;
        var empty_columns = dimensionJSON.EmptyColumns;
        empty_columns = empty_columns > 0 ? empty_columns + 1 : 1;
        //-----------------------------------------------------------
        // Recorremos las columnas para crear cada campo
        for( var i = 0 ; i < m_columns.length ; i++){
            var itemCell = methodPrivate_CreateCell( param_DataRow[ m_columns[i].index ] , m_columns[i].viewOptions , i , param_DataRow );
            $(itemCell)
                .css({
                    "height"        : "100%"        ,
                    "float"         : "left"        ,
                    "padding-right" : "10px"
                });
            $(itemCell).attr("name", m_columns[i].index );    
            if( m_columns[i].visible != undefined && m_columns[i].visible != null && !m_columns[i].visible ){
                $(itemCell).css("display","none");
            }
            if( array_sizes[i] != -1){
                $(itemCell).css("width",array_sizes[i]);
            }
            else{
                $(itemCell).css("width", parseInt( size_body / empty_columns));
            }
            $(elementLI).append( itemCell );
        }
        return elementLI;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Crea a el grid de forma que se puede alterar el orden de los elementos */
    function methodPrivate_CreateList(){
        $(DOM_Body).find("[data-row-indexControll]").remove();
        if( $(DOM_Body).find("ul.data-containerPanel").length == 0 ){
            $(DOM_Body)
                .append(function(){
                    var elementTR = document.createElement("tr");
                    $(elementTR)
                            .attr("data-row-indexControll", "TRUE" )
                            .append(function(){
                                var elementTD = document.createElement("td");
                                $(elementTD)
                                    .attr("colspan", m_columns.length + 1 )
                                    .append(function(){
                                        var elementUL = document.createElement("ul");
                                        $(elementUL)
                                            .addClass("data-containerPanel")
                                            .css({"list-style-type": "none"});
                                        return elementUL;
                                    });
                            return elementTD;
                        });
                    return elementTR;
                });
            
        }
            var row_counter = 0;
            var row_views_counter = 0;
            for( var i = 0 ; i < m_data.length ; i++){
                var itemRow = methodPrivate_CreateLI( m_data[i] );
                $(itemRow)
                    .addClass("jsNorGrid-Row")
                    .attr("data-row-index", i )
                    .click(function(){
                        if( m_editItem["__op__"] ){
                            return;
                        }
                        $(DOM_Body).find("[data-row-index]").removeClass("jsNorGrid-Row-Selected");
                        $( this ).addClass("jsNorGrid-Row-Selected");
                        m_currentItem.SelectedIndexRow = parseInt( $(this).attr("data-row-index")); 
                        for( var c = 0 ;  c < e_OnItemSelected.length ; c++ ){
                            e_OnItemSelected[c]( m_currentItem , m_data[ m_currentItem.SelectedIndexRow ] );
                        }
                    });
                $(itemRow)
                    .find("[data-role=command-controller]")
                    .attr("data-row-index", i );
                    
                if( m_isZebra && i % 2 == 0 ){
                    $(itemRow).addClass("jsNorGrid-Row-On"); 
                }
                else if( m_isZebra && i % 2 != 0 ){
                    $(itemRow).addClass("jsNorGrid-Row-Off"); 
                }
                
                $(DOM_Body).find("ul.data-containerPanel").append( itemRow );
                methodPrivate_DataBindRow( m_data[i] , i , itemRow );
            }
            $(DOM_Body).find("ul.data-containerPanel")
                .sortable({
                    handle : ".handleSortable" ,
                    update : function( event , ui ){
                        m_currentItem.HideForm();
                        m_currentItem.UpdateItems(); 
                    }
                });
    }
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate_CreatePanel( param_DataRow ){
        var elementDIV = document.createElement("div");
        $(elementDIV)
            .addClass("panel panel-primary col-sm-" + m_ColumnGrid );
            
        var dimensionJSON = methodPrivate_CreateArraySizes( false ,  $(m_elementDOM).width()*( m_ColumnGrid / 12 ) );
        var array_sizes = dimensionJSON.ArraySize;
        var size_body = dimensionJSON.SizeBody;
        var empty_columns = dimensionJSON.EmptyColumns;
        empty_columns = empty_columns > 0 ? empty_columns + 1 : 1;
        //-----------------------------------------------------------
        // Recorremos las columnas para crear cada campo
        for( var i = 0 ; i < m_columns.length ; i++){
            var itemCell = methodPrivate_CreateCell( param_DataRow[ m_columns[i].index ] , m_columns[i].viewOptions , i , param_DataRow );
            if( m_columns[i].visible != undefined && m_columns[i].visible != null && !m_columns[i].visible ){
                continue;
            }
            $(itemCell).css({
                "width":"100%",
                "height": (100 / (empty_columns + 1))+"%"
            });
            $(itemCell).attr("name", m_columns[i].index );
            if( array_sizes[i] != -1){
                $(itemCell).css("width",array_sizes[i]);
            }
            else if(  m_columns[i].width ){
                $(itemCell).css("width", m_columns[i].width  );
            }
            $(elementDIV).append( itemCell );
        }
        return elementDIV;
    }
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate_CreateRow( param_DataRow ){
        var elementTR = document.createElement("tr");
        $(elementTR)
            .append(function(){
                var elementTD_GROUP = document.createElement("td");
                $(elementTD_GROUP)
                    .append(function(){
                        var elementDIV_GROUP = methodPrivate_CreateCommandsButtons();
                        $(elementDIV_GROUP).addClass("btn-group-vertical");
                        return elementDIV_GROUP;
                    });
                return elementTD_GROUP;
            });
        
        var dimensionJSON = methodPrivate_CreateArraySizes( false );
        var array_sizes = dimensionJSON.ArraySize;
        var size_body = dimensionJSON.SizeBody;
        var empty_columns = dimensionJSON.EmptyColumns;
        empty_columns = empty_columns > 0 ? empty_columns : 1;
        
        for( var i = 0 ; i < m_columns.length ; i++){
            var itemCell = document.createElement("td");
            $(itemCell).append( methodPrivate_CreateCell( param_DataRow[ m_columns[i].index ] , m_columns[i].viewOptions , i , param_DataRow ));
            $(itemCell).find("[data-role=jsNorGrid-Cell]").attr("name", m_columns[i].index );
            if( m_columns[i].visible != undefined && m_columns[i].visible != null && !m_columns[i].visible ){
                $(itemCell).css("display","none");
            }
            if( array_sizes[i] != -1){
                $(itemCell).css("width",array_sizes[i]);
            }
            else{
                $(itemCell).css("width", size_body / empty_columns);
            }
            $(elementTR).append( itemCell );
        }
        return elementTR;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate_DataBindRow( param_dataRow ,  param_indexRow , param_elementDOM ){
        for( var i = 0; i < e_OnCreateRow.length ; i++ ){
            e_OnCreateRow[i]( m_currentItem , param_dataRow , param_indexRow , param_elementDOM);
        }
    }
    function methodPrivate_DownloadData( param_data ) {
        var file_csv = "";
        for( var i = 0 ; i < m_columns.length ; i++ ){
            if( i >0 ){
               file_csv +=","; 
            }
            file_csv += m_columns[i].label;
        }
        for( var k = 0 ; k < param_data.length ; k++ ){
            file_csv +="\n"; 
            for( var i = 0 ; i < m_columns.length ; i++ ){
                if( i >0 ){
                    file_csv +=","; 
                }
                file_csv += param_data[k][ m_columns[i].index ];
            }
        }
        var blob = new Blob([file_csv ], {type: 'text/csv'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, m_title+".csv" );
        }
        else{
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download =  m_title+".csv" ;        
            document.body.appendChild(elem)
            elem.click();        
            document.body.removeChild(elem);
        }
    }
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate__SortDataSource( param_column  , param_direccion ){
        temp_source = {};
        for( var i = 0 ; i < m_data.length -1 ; i++){
            for( var i_1 = i +1  ; i_1 < m_data.length  ; i_1++){
                if( m_data[i][ param_column] > m_data[ i_1 ][ param_column] && param_direccion ){
                    temp_source =  m_data[i];
                    m_data[i] =  m_data[i_1];
                    m_data[i_1] =  temp_source;
                }
                else if( m_data[i][ param_column] < m_data[ i_1 ][ param_column] && !param_direccion ){
                    temp_source =  m_data[i];
                    m_data[i] =  m_data[i_1];
                    m_data[i_1] =  temp_source;
                }
            }
        }
        methodPrivate_BuildingData();
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate_OnUpdate(){
        for( var i = 0; i < e_OnUpdate.length ; i++){
            e_OnUpdate[i]( m_currentItem , this );
        }
        
        
        $(DOM_Footer).find("[data-role=label][data-type=current-view]").val( m_indexView  + 1 );
        if( m_totalRows == -1 ){
            $(DOM_Footer).find("[data-role=label][data-type=total-views]").html("de "+  Math.ceil( m_data.length / m_rowsView ) );
            $(DOM_Footer).find("[data-role=label][data-type=total-records]").html( m_data.length +" registros ");
            $(DOM_Body).find("[data-row-view]").hide();
            $(DOM_Body).find("[data-row-view="+ m_indexView +"]").show();
        }
        else{
            $(DOM_Footer).find("[data-role=label][data-type=total-views]").html("de "+  Math.ceil( m_totalRows / m_rowsView ) );
            $(DOM_Footer).find("[data-role=label][data-type=total-records]").html( m_totalRows +" registros ");
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /*  */
    function methodPrivate_UpdateEditItem( p_Property , p_Value ){
        for(var i = 0 ; i < m_columns.length ; i++){
            if( m_columns[i].index == p_Property ){
                switch( parseInt( m_columns[i].ControllerType ) ){
                    case ControllerTypesOptions.Autocomplete : {
                        m_editItem[ p_Property ] = p_Value.Data ;
                    }break;
                    default:{
                        m_editItem[ p_Property ] = p_Value;
                    }
                }
            }
        }
    }
  // ======================================================================================
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Funcion que Elimina el contenido de la tabla */
    m_currentItem.Clear = function(){
        // Mandamos a llamar los eventos antes de limpiar el control
        for( var i = 0 ; i < e_BeforeClear.length ; i++ ){
            var event_result = e_BeforeClear[i]( m_currentItem );
        }
        //-------------------------------------------------------------
        // Limpiamos todos los elementos que puede tener , exceptuando los formularios
        $(DOM_Body).find("[data-row-index]").remove();
        m_data = [];
        //-------------------------------------------------------------
        // Mandamos a llamar los eventos despues de limpiar el control
        for( var i = 0 ; i < e_OnClear.length ; i++ ){
            var event_result = e_OnClear[i]( m_currentItem );
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Funcion que elimina el elemento seleccionado */
    m_currentItem.DeleteEditItem = function( param_event , param_sender ){
        // Mandamos a llamar los eventos antes de limpiar el control
        for( var i = 0 ; i < e_BeforeDelete.length ; i++ ){
            var event_result = e_BeforeDelete[i]( m_currentItem );
        }
        m_indexRow = parseInt( $(this).attr("data-row-index") );
        for( var i = 0 ; i < m_columns.length ; i++ ){
            m_editItem[ m_columns[i].index ] = m_data[ m_indexRow ][ m_columns[i].index ];
        }
        
        //-------------------------------------------------------------
        // Eliminacion mediente peticion a servidor
        if( m_sourceType == "AJAX" ){
            methodPrivate__AjaxSendRequest(3);
            m_editItem = {};
            return;
        }
        //-------------------------------------------------------------
        // Eliminacion mediante datos locales
        var l_data = [];
        for( var i = 0; i < m_data.length ; i++){ 
            if( i != m_indexRow){ 
                l_data.push( m_data[i] ); 
            } 
        }
        m_data      = l_data;
        m_editItem  = {};
        m_currentItem.Refresh();
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Funcion que remueve el Grid y todos sus componentes */
    m_currentItem.Dispose = function(){
        // Mandamos a llamar los eventos antes de eliminar el control
        for( var i = 0 ; i < e_BeforeDispose.length ; i++ ){
            var event_result = e_BeforeDispose[i]( m_currentItem );
        }
        //-------------------------------------------------------------
        // Eliminamos los controles que utilizamos para editar los datos
        for(var i = 0; i < object_Fields.length ; i++){
            object_Fields[i].Dispose();
        }
        //-------------------------------------------------------------
        // Vaciamos el control y eliminamos el elementoDOM 
        $(m_elementDOM).empty();
        $(m_elementDOM).remove();
        // Mandamos a llamar los eventos despues de eliminar el control
        for( var i = 0 ; i < e_OnDispose.length ; i++ ){
            var event_result = e_OnDispose[i]( m_currentItem );
        }
    };
    m_currentItem.DownloadData = function(){  
        l_tempParams = m_filters;
        l_tempParams = l_tempParams ? l_tempParams : {};
        for( propertyKey in m_request.Select.PARAMS ){
            l_tempParams[ propertyKey ] = m_request.Select.PARAMS[ propertyKey ];
        }
        Ajax_ServerRequest( m_request.Select.URL ,  m_request.Select.METHOD , l_tempParams , function( data ){  
            methodPrivate_DownloadData( JSON.parse( data ) );
        });
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Funcion que oculta el formulario de edicion */
    m_currentItem.HideForm = function(){
        $(DOM_Form).hide();
        $(DOM_Body).find("[data-row-index]").show();
        //m_currentItem.Refresh();
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* funcion que lee los datos del elemento del grid */
    m_currentItem.ReadEditItem = function( param_event , param_sender ){
        // Si hay un elemento oculto en edicion , lo mostramos
        if( m_indexRow != -1){
            m_currentItem.HideForm();
        }
        
        if( m_editForm.toUpperCase() == "INLINE" ){
            if( DOM_Form == null && !m_sortable && m_dataDisplay == "ROWS"){
                methodPrivate_CreateFormRow();
            }
            else if(  DOM_Form == null && m_sortable && m_dataDisplay == "ROWS"){
                methodPrivate_CreateFormLi();
            }
            else if(  DOM_Form == null && m_dataDisplay == "GRID"){
                methodPrivate_CreateFormPanel();
            }
        }
        else if( DOM_Form == null ){
            methodPrivate_CreateForm();
        }
        
        m_indexRow = parseInt( $(this).attr("data-row-index") );
        m_editItem = {};
        m_editItem["__op__"] = "EDIT";
        if( !isNaN( m_indexRow ) ){
            for( var i = 0 ; i < m_columns.length ; i++ ){
                m_editItem[ m_columns[i].index ] = m_data[ m_indexRow ][ m_columns[i].index ];
                object_Fields[ i ].Value = m_data[ m_indexRow ][ m_columns[i].index ];
            }
        }
        else{
            for( var i = 0 ; i < m_columns.length ; i++ ){
                m_editItem[ m_columns[i].index ] = null;
                object_Fields[ i ].Clear();
            }
        }
        if( m_editForm == "INLINE"){
            $(DOM_Body).find("[data-row-index="+m_indexRow+"]").hide();
        };
        if( typeof pFunction == "function" ){
            pFunction( m_editItem );
            return;
        }
        m_currentItem.ShowForm();
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* refresca los datos del grid  */
    m_currentItem.Refresh = function(){
        m_currentItem.HideForm();
        m_editItem = {};
        m_indexRow = -1;
        if( m_sourceType == "AJAX" ){
            methodPrivate__AjaxSendRequest(0);
        }
        else{
            methodPrivate_BuildingData();
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* funcion que manda a guardar los datos del elemento en edicion */
    m_currentItem.SaveEditItem = function(){
        m_editItem["__edited__"] = true;
        if( m_indexRow == -1 ){
            for( var i = 0 ; i< e_BeforeInsert.length ; i++ ){
                var event_Stop = e_BeforeInsert[i]( m_currentItem , m_editItem );
                if( event_Stop ){
                    return false;
                }
            }
        }
        else{
            for( var i = 0 ; i< e_BeforeEdit.length ; i++ ){
                var event_Stop = e_BeforeEdit[i]( m_currentItem , m_editItem );
                if( event_Stop ){
                    return flase;
                }
            }
        }
        for( var i = 0 ; i < m_columns.length ; i++ ){
            if( m_columns[i].isRequired && ( object_Fields[i].Value == null || object_Fields[i].Value == "" )){
                var __mensageAlert = new jsNorAlert("El campo ("+ m_columns[i].label+") es requerido" ,"Dato incorrecto" , "<span style='font-size:50px; color:rgba(255,0,0,0.7);' class='glyphicon glyphicon-info-sign'></span>", "label-danger", function(){
                    $(object_Fields[i].ElementDOM ).find("input,select").focus();
                });
                __mensageAlert.Open();
                return false;
            }
            m_editItem[ m_columns[i].index ] = object_Fields[i].Value ;
        }
        if( m_sourceType == "AJAX" ){
            if( m_indexRow == -1 || isNaN( m_indexRow )){
                methodPrivate__AjaxSendRequest(1);
            }
            else{ 
                methodPrivate__AjaxSendRequest(2); 
            }
            return true;
        }
        else{
            if( m_indexRow == -1 ){ 
                m_data.push( m_editItem); 
            }
            else{
                for( var i = 0 ; i < m_columns.length ; i++ ){
                    m_data[ m_indexRow ][ m_columns[i].index ] = m_editItem[ m_columns[i].index ];
                }
                m_data[ m_indexRow ]["__edited__"] = true;
            }
        }
        m_editItem = {};
        m_currentItem.HideForm();
        m_currentItem.Refresh();
        return true;
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* Funcion que muestra el formulario de edicion */
    m_currentItem.ShowForm = function( ){
        //-----------------------------------------------------------
        // Mandamos a llamar el evento antes de mostrar el formulario
        for( var i = 0 ; i < e_BeforeShowForm.length; i++){ 
            var stop_event =  e_BeforeShowForm[i]( m_currentItem , m_editItem["__op__"] ); 
            if( stop_event!= undefined && stop_event != null && !stop_event ){
                return;
            }
        }
        //----------------------------------------------------------------------------------------------------
        // Si la edicion 'INLINE' esta habilitada , ocultamos el elemento acutal en edicion , si es que existe
        if( m_editForm.toUpperCase() == "INLINE" ){
            if( m_dataDisplay == "ROWS" && m_sortable ){
                if( DOM_Form == null ){
                    methodPrivate_CreateFormLi();
                }
                if( m_indexRow != -1 && m_sortable){
                    $(DOM_Form).insertBefore( $("li[data-row-index="+m_indexRow+"]"));
                }
                else if( m_sortable ){
                    $(DOM_Form).insertBefore( $("li[data-row-index=0]"));
                }
            }
            else if( m_dataDisplay == "ROWS" && !m_sortable ){
                if( DOM_Form == null ){
                    methodPrivate_CreateFormRow();
                }
                if( m_indexRow != -1 && !m_sortable){
                    $(DOM_Form).insertBefore( $("tr[data-row-index="+m_indexRow+"]"));
                }
                else if( !m_sortable ){
                    $(DOM_Form).insertBefore( $("tr[data-row-index=0]"));
                }
            }
            else if( m_dataDisplay == "GRID" ){
                if( DOM_Form == null ){
                    methodPrivate_CreateFormPanel();
                }
                if( m_indexRow != -1 ){
                    $(DOM_Form).insertBefore( $(".panel[data-row-index="+m_indexRow+"]"));
                }
                else {
                    $(DOM_Form).insertBefore( $(".panel[data-row-index=0]"));
                }
            }
            
            $(DOM_Form).show();
        }
        else{
            if( DOM_Form == null ){
                methodPrivate_CreateForm();
            }
            //------------------------------------------------------------------------
            // Diferenciamos entre el formulario , para seleccionar el titulo adecuado
            if( m_editItem["__op__"] == "INSERT" ){
                $(DOM_Form).dialog( "option", "title", "Nuevo " + m_title );
            }
            else{
                $(DOM_Form).dialog( "option", "title", "Edicion " + m_title );
            }
            $(DOM_Form).dialog( "open" );
        }
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* actualiza los elementos */
    m_currentItem.UpdateItems = function(){
        if( m_dataDisplay == "ROWS"){
            var array_li = $(DOM_Body).find("li");
            var tempData = null;
            for(var i = 0 ; i < array_li.length ; i++ ){
                var index_row = parseInt( $(array_li[i]).attr("data-row-index") );
                if( index_row != i && tempData == null ){
                    tempData            = m_data[ i ];
                    m_data[ i ]         = m_data[ index_row ];
                    m_data[ index_row ] = tempData;
                }
            }
        }
        else if( m_dataDisplay == "GRID"){
            
        }
        m_currentItem.Refresh();
    };
  ////////////////////////////////////////////////////////////////////////////////////////
  /* actualiza los elementos */
    m_currentItem.UpdateEditItem = function( param_values ){
        for( var i = 0 ; i < m_columns.length ; i++ ){
            if( param_values[ m_columns[i].index ] == null || param_values[ m_columns[i].index ] == undefined ){
                continue;
            }
            m_editItem[ m_columns[i].index ] = param_values[ m_columns[i].index ];
            object_Fields[ i ].Value = param_values[ m_columns[i].index ];
        }
    }
  // ======================================================================================
  ////////////////////////////////////////////////////////////////////////////////////////
    function __Init (){
        m_elementDOM = Configuration.Container;
        m_id = __GetKey( 5 ,"jsNorGrid");
        l_elementTABLE = document.createElement("table");
        m_loadingPanel = new jsNorLoading({ Element :  l_elementTABLE });
        m_dataDisplay = "ROWS";
        $(m_elementDOM)
            .css("position","relative")
            .append( l_elementTABLE );

        for( propertyKey in Configuration ){
            if( Configuration[ propertyKey ] != null && Configuration[ propertyKey ] != undefined ){
                m_currentItem[ propertyKey ] = Configuration[ propertyKey ];
            }
        }
        m_elementDOM.style.height = null;
        $( l_elementTABLE )
            .attr("id" , m_id )
            .addClass("table")
            .append( DOM_Header = methodPrivate_CreateHeader() )
            .append( DOM_Body   = document.createElement("tbody") )
            .append( DOM_Footer = methodPrivate_CreateFooters() );
        m_currentItem.Refresh();

        $([DOM_Header,DOM_Body])
            .css({
                "display" : m_size ? "block" :"" ,
                "width"   : m_size ? m_size.Width : ""
            });
        $(DOM_Body)
            .css({
                "overflow-y":"auto",
                "overflow-x":"hidden",
                "height"   :  m_size ? m_size.Height : ""
            });
        if( m_rowsView == -1 ){
            $(DOM_Footer).css("display","none");
        }
        else{
            m_indexView = 0 ;
        }
    };
  // ======================================================================================
  ////////////////////////////////////////////////////////////////////////////////////////
    __Init();
}


/*********************************************************************************************************
* @constructor jsNorWindow
* @param
* @description
**********************************************************************************************************/
function jsNorWindow() {
    var param_ControlConfiguration = arguments[0] ? arguments[0] : {};
    var // Propieades del Widget          ==============================
        obj_currentItem     = {} ,
        m_loadingPanel      = null ,
        property_content    = null ,
        property_callBack   = null ,
        property_draggable  = true,
        property_resize     = true,
        property_Status     = WindowStateOptions.WINDOW ,
        property_modal      = false,
        property_height     =  600 ,
        property_width      = 400 ,
        property_position   = null ,
        property_title      = "" ,
        property_url        = "" ;
        
    // ======================== // ======================== // ======================== // ======================== //
    // ======================================================================================
    //          Definicion de Propiedades 
    // ======================== // ======================== // ======================== // ======================== //
    Object.defineProperties( obj_currentItem ,{
        "Url" : {
            get: function(){
                return property_url;
            },
            set : function( param_AttributeValue ){
                property_url = param_AttributeValue;
                if( $( obj_currentItem.ElementDOM ).find("iframe").length  ){
                    
                    m_loadingPanel.Show(1);
                    $( obj_currentItem.ElementDOM ).find("iframe").attr("src",property_url );
                    //$( obj_currentItem.ElementDOM ).find("iframe").get(0).contentWindow.location.reload();
                }
            }
        }
    });
    // ======================== // ======================== // ======================== // ======================== //
    // ======================== // ======================== // ======================== // ======================== //
    //          Definicion de Eventos
    // ======================== // ======================== // ======================== // ======================== //
    var 
        e_BeforeOnClose       = [] , // Evento antes de cierra la ventana
        e_BeforeOnDragged     = [] , // Evento antes de mueve la ventana
        e_BeforeOnMaximize    = [] , // Evento antes de maximiza la ventana
        e_BeforeOnMinimize    = [] , // Evento antes de minimiza la ventana
        e_BeforeOnMove        = [] , // Evento antes de mueve la ventana
        e_BeforeOnOpen        = [] , // Evento antes de abre la ventana
        e_BeforeOnResized     = [] , // Evento antes de cambia el tamaño de la ventana

        e_OnClose       = [] , // Evento cuando se cierra la ventana
        e_OnDragged     = [] , // Evento cuando se mueve la ventana
        e_OnMaximize    = [] , // Evento cuando se maximiza la ventana
        e_OnMinimize    = [] , // Evento cuando se minimiza la ventana
        e_OnMove        = [] , // Evento cuando se mueve la ventana
        e_OnOpen        = [] , // Evento cuando se abre la ventana
        e_OnResized     = [] ; // Evento cuando cambia el tamaño de la ventana

    Object.defineProperties( obj_currentItem ,{
        "BeforeOnClose"       : { get: function(){ return e_BeforeOnClose ;     } , set : function( param_eventFunction ){ e_BeforeOnClose.push( param_eventFunction );       } },
        "BeforeOnDragged "    : { get: function(){ return e_BeforeOnDragged ;   } , set : function( param_eventFunction ){ e_BeforeOnDragged.push( param_eventFunction );     } },
        "BeforeOnMaximize"    : { get: function(){ return e_BeforeOnMaximize ;  } , set : function( param_eventFunction ){ e_BeforeOnMaximize.push( param_eventFunction );    } },
        "BeforeOnMinimize"    : { get: function(){ return e_BeforeOnMinimize ;  } , set : function( param_eventFunction ){ e_BeforeOnMinimize.push( param_eventFunction );    } },
        "BeforeOnMove"        : { get: function(){ return e_BeforeOnMove ;      } , set : function( param_eventFunction ){ e_BeforeOnMove.push( param_eventFunction );        } },
        "BeforeOnOpen"        : { get: function(){ return e_BeforeOnOpen ;      } , set : function( param_eventFunction ){ e_BeforeOnOpen.push( param_eventFunction );        } },
        "BeforeOnResized"     : { get: function(){ return e_BeforeOnResized ;   } , set : function( param_eventFunction ){ e_BeforeOnResized.push( param_eventFunction );     } },

        "OnClose"       : { get: function(){ return e_OnClose ;     } , set : function( param_eventFunction ){ e_OnClose.push( param_eventFunction );       } },
        "OnDragged "    : { get: function(){ return e_OnDragged ;   } , set : function( param_eventFunction ){ e_OnDragged.push( param_eventFunction );     } },
        "OnMaximize"    : { get: function(){ return e_OnMaximize ;  } , set : function( param_eventFunction ){ e_OnMaximize.push( param_eventFunction );    } },
        "OnMinimize"    : { get: function(){ return e_OnMinimize ;  } , set : function( param_eventFunction ){ e_OnMinimize.push( param_eventFunction );    } },
        "OnMove"        : { get: function(){ return e_OnMove ;      } , set : function( param_eventFunction ){ e_OnMove.push( param_eventFunction );        } },
        "OnOpen"        : { get: function(){ return e_OnOpen ;      } , set : function( param_eventFunction ){ e_OnOpen.push( param_eventFunction );        } },
        "OnResized"     : { get: function(){ return e_OnResized ;   } , set : function( param_eventFunction ){ e_OnResized.push( param_eventFunction );     } }
    });
    // ======================== // ======================== // ======================== // ======================== //
    // ======================== // ======================== // ======================== // ======================== //
    //          Definicion de Metodos Publicos 
    // ======================== // ======================== // ======================== // ======================== //
    
    obj_currentItem.Show = function(){
        property_Status = WindowStateOptions.MAXIMIZE;
        $( obj_currentItem.ElementDOM ).dialog("open");
    }
    obj_currentItem.Close = function(){
        for( var i = 0 ; i < e_BeforeOnClose.length ; i++ ){
            e_BeforeOnClose[i]( obj_currentItem );
        }

        $(obj_currentItem.ElementDOM ).dialog( "destroy" );
        $(obj_currentItem.ElementDOM ).remove();

        for( var i = 0 ; i < e_OnClose.length ; i++ ){
            e_OnClose[i]( obj_currentItem );
        }
    }
    obj_currentItem.Restore = function(){
        methodPrivate_ChangeState( WindowStateOptions.WINDOW );
    } 
    obj_currentItem.Maximize = function(){
        methodPrivate_ChangeState( WindowStateOptions.MAXIMIZE );
    } 
    obj_currentItem.Minimize = function(){
        methodPrivate_ChangeState( WindowStateOptions.MINIMIZE );
    } 
    obj_currentItem.Refresh = function(){
        if( $( obj_currentItem.ElementDOM ).find("iframe").length  ){
            m_loadingPanel.Show(1);
            $( obj_currentItem.ElementDOM ).find("iframe").get(0).contentWindow.location.reload();
        }
    } 
    // ======================== // ======================== // ======================== // ======================== //
    // ======================== // ======================== // ======================== // ======================== //
    //          Definicion de Metodos Privados 
    // ======================== // ======================== // ======================== // ======================== //
    function methodPrivate_CreateFrame(){
        m_loadingPanel = new jsNorLoading({ Element :  obj_currentItem.ElementDOM  });
        m_loadingPanel.Show(1);
        var elementIFRAME_Container = document.createElement("iframe");
        $(elementIFRAME_Container)
            .attr("data-role","content")
            .attr("src", property_url )
            .css({
                "height"    : "100%" ,
                "width"     : "100%" ,
                "margin":"0px"
            })
            .load(function(){
                elementIFRAME_Container.contentWindow.onbeforeunload = function () {
                    m_loadingPanel.Show(1);
                };
                elementIFRAME_Container.contentWindow.jsNorWindowOpener = obj_currentItem;
                obj_currentItem
                m_loadingPanel.Show(0);
            });
        return elementIFRAME_Container;
    }
    function methodPrivate_CreateContent(){
        var elementDIV_Container = document.createElement("div");
        $(elementDIV_Container)
            .attr("data-role","content")
            .append(property_content );
        return elementDIV_Container;
    }
    function methodPrivate_ChangeState( param_windowState ){
        switch( param_windowState ){
            case WindowStateOptions.MAXIMIZE :{
                property_Status = WindowStateOptions.MAXIMIZE ;
                $( obj_currentItem.ElementDOM ).parent().css({
                    "top" :"0px","left":"0px","width":"100%","height": $(window).height()
                });
                $( obj_currentItem.ElementDOM ).css({"height" : $(window).height() - 50 + "px" , "width": $(window).width() - 10+ "px" });
                //$( obj_currentItem.ElementDOM ).find("iframe").css({"height" : $(window).height() - 55 + "px" , "width": $(window).width() - 9 + "px" });
                
                $( obj_currentItem.ElementDOM ).dialog( "option", "resizable", false );
                $( obj_currentItem.ElementDOM ).parent().find(".btn-windowsState").show();
                $( obj_currentItem.ElementDOM ).parent().find(".btn-maximize").hide();
            }break;
            case WindowStateOptions.MINIMIZE :{
                property_Status = WindowStateOptions.MINIMIZE ;
                $( obj_currentItem.ElementDOM ).parent().css({
                    "width":"520","height":"52"
                });
                $( obj_currentItem.ElementDOM ).dialog( "option", "resizable", false );
                $( obj_currentItem.ElementDOM ).parent().find(".btn-windowsState").show();
                $( obj_currentItem.ElementDOM ).parent().find(".btn-minimize").hide();
                
            }break;
            case WindowStateOptions.WINDOW   :{
                property_Status = WindowStateOptions.WINDOW ;
                
                $( obj_currentItem.ElementDOM ).parent().css({
                    "width": property_width ,"height": property_height 
                });
                $( obj_currentItem.ElementDOM ).css({"height" : property_height - 50 + "px" , "width": property_width - 10 + "px" });
                //$( obj_currentItem.ElementDOM ).find("iframe").css({"height" : property_height - 55 + "px" , "width": property_width - 9 + "px" });
                
                $( obj_currentItem.ElementDOM ).dialog( "option", "resizable", property_resize );
                $( obj_currentItem.ElementDOM ).parent().find(".btn-windowsState").show();
                $( obj_currentItem.ElementDOM ).parent().find(".btn-restore").hide();
                $( obj_currentItem.ElementDOM ).dialog( "option", "position" , property_position);
            }break;
        }
    }
    function methodPrivate_CreateControls(){
        var array_buttons = [];
        
         if( property_url != null ){
            array_buttons.push(
                methodPrivate_CreateButton("<span class='glyphicon glyphicon-refresh'></span>" ,"btn btn-default", function(){
                    obj_currentItem.Refresh();
                } )
            );
         }
         array_buttons.push(
             methodPrivate_CreateButton("<span class='glyphicon glyphicon-minus'></span>" ,"btn-windowsState btn-minimize btn btn-default", function(){
                 obj_currentItem.Minimize();
             } )
         );
         array_buttons.push(
             methodPrivate_CreateButton("<span class='glyphicon glyphicon-modal-window'></span>" ,"btn-windowsState btn-restore btn btn-default", function(){
                obj_currentItem.Restore();
             } )
         );
         array_buttons.push(
             methodPrivate_CreateButton("<span class='glyphicon glyphicon-resize-full'></span>" ,"btn-windowsState btn-maximize btn btn-default", function(){
                obj_currentItem.Maximize();
             } )
         );
         array_buttons.push(
             methodPrivate_CreateButton("<span class='glyphicon glyphicon-remove'></span>" ,"btn btn-danger", function(){
               $(obj_currentItem.ElementDOM ).dialog( "close" );
             } )
         );
        return array_buttons.reverse();
    }
    function methodPrivate_CreateButton( param_Text , param_Class , param_CallBack ){
        var elementBUTTON = document.createElement("button");
        $(elementBUTTON)
            .css({"float":"right"})
            .addClass( param_Class )
            .append( param_Text )
            .click( param_CallBack );
        return elementBUTTON;
    }
    function methodPrivate_CreateDialog(){
        $( obj_currentItem.ElementDOM ).dialog({
            autoOpen        : false,
            closeOnEscape   : false,
            draggable       : property_draggable ,
            resizable       : property_resize ,
            modal           : property_modal  ,
            height          : property_height ,
            minWidth        : 520,
            minHeight       : 52 ,
            width           : property_width  ,
            title           : property_title,
            show            : { effect: "fade", duration: 200 },
            hide            : { effect: "fade", duration: 200 } ,
            dragStart: function( event, ui ) {
                if( property_Status == WindowStateOptions.MAXIMIZE ){
                    obj_currentItem.Restore();
                }
            },
            dragStop: function( event, ui ) {
                property_position = $( obj_currentItem.ElementDOM ).dialog( "option", "position" );
            },
            close : function( event ,  ui ){
                obj_currentItem.Close();
            },
            resize : function(  event, ui ){
                if( property_url != null  ){
                    property_width = ui.size.width ;    //$( obj_currentItem.ElementDOM ).parent().width();
                    property_height = ui.size.height;   //$( obj_currentItem.ElementDOM ).parent().height();
                    
                    $( obj_currentItem.ElementDOM ).css({"height" : property_height - 50 + "px" , "width": property_width - 10 + "px" });
                    //$( obj_currentItem.ElementDOM ).find("iframe").css({"height" : property_height - 70 + "px" });
                }
            }
        });
        $( obj_currentItem.ElementDOM ).css({
            "top" :"0px","left":"0px","width":"100%" , "padding":"0px"
        });
        $("[aria-describedby="+ obj_currentItem.ID+"]").find(".ui-dialog-titlebar button").remove();
        $("[aria-describedby="+ obj_currentItem.ID+"]").find(".ui-dialog-titlebar span").css("width","65%");
        $("[aria-describedby="+ obj_currentItem.ID+"]").find(".ui-dialog-titlebar").append( methodPrivate_CreateControls() );
        $(obj_currentItem.ElementDOM).append(function () { return property_url == null ? methodPrivate_CreateContent() : methodPrivate_CreateFrame(); });
    }
    function __Init() {
        jsNorBase.apply(obj_currentItem, [{ DataType: WidgetTypeOptions.jsNorWindow }]);
        property_Status     = WindowStateOptions.WINDOW ;
        
        /*********************************************************************
         * Asignacion automatica de las propiedades del elemento
         */
        for( propertyKey in param_ControlConfiguration ){
            if( param_ControlConfiguration[ propertyKey ] != null && obj_currentItem[ propertyKey ] != undefined ){
                obj_currentItem[ propertyKey ] = param_ControlConfiguration[ propertyKey ];
            }
        }
        /*********************************************************************
         * Asignacion de propiedades especificas
         */
        property_callBack   = param_ControlConfiguration.CallBack ? param_ControlConfiguration.CallBack     : null;
        property_resize     = param_ControlConfiguration.ReSize    != null && param_ControlConfiguration.ReSize     != undefined ? param_ControlConfiguration.ReSize       : true;
        property_draggable  = param_ControlConfiguration.Draggable != null && param_ControlConfiguration.Draggable  != undefined ? param_ControlConfiguration.Draggable    : true;
        property_modal      = param_ControlConfiguration.Modal     != null && param_ControlConfiguration.Modal      != undefined ? param_ControlConfiguration.Modal        :  true;
        property_url        = param_ControlConfiguration.Url      ? param_ControlConfiguration.Url          :  null ;
        property_content    = param_ControlConfiguration.Content  ? param_ControlConfiguration.Content      :  "";
        property_title      = param_ControlConfiguration.Title    ? param_ControlConfiguration.Title     :  "";
        property_height     = param_ControlConfiguration.Height   ? param_ControlConfiguration.Height    :  600;
        property_width      = param_ControlConfiguration.Width    ? param_ControlConfiguration.Width     :  800;
        
        methodPrivate_CreateDialog();
        property_position = $( obj_currentItem.ElementDOM ).dialog( "option", "position" );
        obj_currentItem.Restore();
    };
    __Init();
    return obj_currentItem;
}
// ======================== // ======================== // ======================== // ======================== //
// ======================== // ======================== // ======================== // ======================== //
//
function jsNorList(){
    var param_ControlConfiguration = arguments[0] ? arguments[0] : {};
    var // Propieades del Widget          ==============================
        obj_currentItem = new Object() ,
        obj_elementDOM          = null  ,
        obj_currentHEADER       = null  ,
        obj_currentTABLE        = null  ,
        
        property_columns        = []    ,
        property_isZebra        = false ,
        property_items          = []    ,
        property_rowsView       = -1    ,
        property_rowIndex       = -1    ,
        property_selectedIndex  = -1    ;
   var 
    event_OnComplete    = [] ,
    event_OnCreate      = [] ,
    event_OnCreateCell  = [] ,
    event_OnCreateRow   = [] ;
    
   Object.defineProperties( obj_currentItem , {
       "Columns" : {
           get: function(  ){
               return property_columns;
           },
           set : function( param_Attribute ){
               property_columns = param_Attribute;
               methodPrivate_BuildingHeader();
           }
       },
       "Items" : {
           get: function(  ){
               return property_items;
           },
           set : function( param_Attribute ){
               property_items = param_Attribute;
               methodPrivate_BuildingData();
           }
       }
   });
    
   Object.defineProperties( obj_currentItem , {
       "OnComplete" : {
           get: function(  ){
               return event_OnComplete;
           },
           set : function( param_Event ){
               event_OnComplete.push( param_Event );
           }
       },
       "OnCreate" : {
           get: function(  ){
               return event_OnCreate;
           },
           set : function( param_Event ){
               event_OnCreate.push( param_Event );
           }
       },
       "OnCreateCell" : {
           get: function(  ){
               return event_OnCreateCell;
           },
           set : function( param_Event ){
               event_OnCreateCell.push( param_Event );
           }
       },
       "OnCreateRow" : {
           get: function(  ){
               return event_OnCreateRow;
           },
           set : function( param_Event ){
               event_OnCreateRow.push( param_Event );
           }
       }
   });
   function methodPrivate_CreateCell( param_Text ){
       var elementTD_field = document.createElement("td");
       $(elementTD_field).html( param_Text );
       return elementTD_field;
   }
   function methodPrivate_CreateRow( param_dataITEM ){
       var elementTR_row = document.createElement("tr");
       for( var i = 0 ; i < property_columns.length ; i++ ){
           var item_cell = methodPrivate_CreateCell( param_dataITEM[ property_columns[i] ] );
            $(elementTR_row).append( item_cell );
            //==================================================================
            //              LLamada del evento OnCreateCell
            //==================================================================
            for( var event_i = 0 ; event_i < event_OnCreateCell.length ; event_i++ ){
               event_OnCreateCell[ event_i ]( obj_currentItem , param_dataITEM[ property_columns[i] ] , item_cell );
           }
       }
       return elementTR_row;
   }
    function methodPrivate_CreateTable( param_elementTABLE ){
        var elementTABLE_content = param_elementTABLE ? param_elementTABLE : document.createElement("table");
        $(elementTABLE_content)
        .addClass("table table-condensed");
        
        for( var i = 0 ; i < property_items.length ; i++ ){
            var item_row = methodPrivate_CreateRow( property_items[i] );
            $(elementTABLE_content).append( item_row );
            methodPrivate_DataBindRow( m_data[i] , i , item_row );
        }
        //==================================================================
        //              LLamada del evento OnCreate
        //==================================================================
        for( var event_i = 0 ; event_i < event_OnCreate.length ; event_i++ ){
            event_OnCreate[ event_i ]( obj_currentItem , property_items , elementTABLE_content );
        }
        return elementTABLE_content;
    }
    function methodPrivate_CreateHeader( param_elementTABLE ){
        var elementTABLE_header = param_elementTABLE ? param_elementTABLE : document.createElement("table");
        $(elementTABLE_header)
        .addClass("table table-condensed");
        
        var elementTR_rowHeader = document.createElement("tr");
        for( var i = 0 ; i < property_columns.length ; i++ ){
            var elementTH_header = document.createElement("th");
            $(elementTH_header).append( property_columns[i] );
            $(elementTR_rowHeader).append( elementTH_header );
        }
        $(elementTABLE_header).append( elementTR_rowHeader );
        return elementTABLE_header;
    }
    function methodPrivate_BuildingHeader(){
        $(obj_currentHEADER)
            .empty();
        methodPrivate_CreateHeader( obj_currentHEADER );
    }
    function methodPrivate_BuildingData(){
        $(obj_currentTABLE)
            .empty();
        methodPrivate_CreateTable( obj_currentTABLE );
    }
    function __Init(){
        param_ControlConfiguration.DataType = WidgetTypeOptions.jsNorList;
        jsNorBase.apply( obj_currentItem, [param_ControlConfiguration]);
        $(obj_currentItem.ElementDOM)
        .append(
            obj_currentHEADER = methodPrivate_CreateHeader()
        )
        .append(
            obj_currentTABLE = methodPrivate_CreateTable()
        );
        methodPrivate_BuildingData(null);
    }
    __Init();
   return obj_currentItem;
}
////////////////////////////////////////////////////////////////////////////////
//          Clase ObjectPoint
////////////////////////////////////////////////////////////////////////////////
function ObjectPoint( lng , lat ) {
    var
      m_currentItem  = this  ,
      m_marker       = null  ,
      m_latitud      = (lat ? lat : 0 ),
      m_longitud     = (lng ? lng : 0 ),
      m_state        = -1 ;      
    Object.defineProperties(m_currentItem ,{
      "Marker" : { get: function(){ return m_marker;    } , set:function( pValue ){ m_marker = pValue   }},
      "lat"    : { get:function(){ return m_latitud ;   } , set:function( pValue ){ m_latitud = pValue  }},
      "lng"    : { get:function(){ return m_longitud ;  } , set:function( pValue ){ m_longitud = pValue }},
      "State"    : { get:function(){ return m_state ;  } , set:function( pValue ){ m_state = pValue }}
   });
}
////////////////////////////////////////////////////////////////////////////////
//          Clase DrawManager
////////////////////////////////////////////////////////////////////////////////
function DrawManager(){
   var pConfiguration = arguments[0] ? arguments[0] : {};
   ////////////////////////////////////////////////////////////////////////////////
   //          Propiedades de Clase
  var
     m_currentItem  = this   ,
     m_id           = -1     , 
     m_element      = null   , // Elemento DOM que contiene al Mapa
     m_figure       = []     , // Figuras que visual generada en el mapa (poligono , circulo , sombra)
     m_links        = []     , // Conectores de puntos entre marcadores
     m_map          = null   , // mapa de google
     m_markers      = []     ; // Lista de puntos o marcadores del mapa
  Object.defineProperties( m_currentItem , {
     "ID"        : { get:function(){ return m_id        ; }},
     "Element"   : { get:function(){ return m_element   ; }},
     "Map"       : { get:function(){ return m_map       ; }}
  });
   var
      e_onClick      = [] ,
      e_onDrag       = [] ,
      e_onDragStart  = [] ,
      e_onDraEnd     = [] ,
      e_onDispose    = [] ;
   ////////////////////////////////////////////////////////////////////////////////
   //          Eventos de Clase
  Object.defineProperties( m_currentItem , {
     "OnClick"        : { get:function(){ return e_onClick     ; } , set : function( p_eValue ){ e_onClick.push( p_eValue);      }},
     "OnDrag"         : { get:function(){ return e_onDrag      ; } , set : function( p_eValue ){ e_onDrag.push( p_eValue);       }},
     "OnDragStart"    : { get:function(){ return e_onDragStart ; } , set : function( p_eValue ){ e_onDragStart.push( p_eValue);  }},
     "OnDragEnd"      : { get:function(){ return e_onDraEnd    ; } , set : function( p_eValue ){ e_onDraEnd.push( p_eValue);     }},
     "OnDipose"       : { get:function(){ return e_onDispose   ; } , set : function( p_eValue ){ e_onDispose.push( p_eValue);    }}
  });
   ////////////////////////////////////////////////////////////////////////////////
   //          Metodos Publicos de Clase
   // Limpia el mapa de cualquier elemento =============================================
   m_currentItem.ClearAll = function(){
       m_currentItem.ClearFigures();
       m_currentItem.ClearLinks();
       m_currentItem.ClearMarkers();
   };
   m_currentItem.ClearFigures = function(){
       // Elimina las figuras del mapa
       for( var i = 0 ; i < m_figure.length ; i++){
           m_figure[i].dispose();
           m_figure[i] = null;
       }
       m_figure = [];
   };
   m_currentItem.ClearLinks = function(){
       // Elimina las lineas que conectan a los puntos del mapa
       for( var i = 0 ; i < m_links.length ; i++){
           m_links[i].dispose();
           m_links[i] = null;
       }
       m_links = [];
   };
   m_currentItem.ClearMarkers = function(){
       // Elimina los puntos del mapa
       for( var i = 0 ; i < m_markers.length ; i++ ){
           m_markers[i].dispose();
           m_markers[i] = null;
       }
       m_markers = [];
   };
   //==============================================================================================
   // Crea nuevo marcador o punto en el mapa de acuerdo a la configuracion de los paramatros dados
   this.CreateMarker  = function(){
      switch ( arguments.length ) {
         case 1:return __CreateMarker(arguments[0].lng ,arguments[0].lat ,arguments[0].Status );
         case 2:return __CreateMarker(arguments[0]     ,arguments[1]     , 0 );
         case 3:return __CreateMarker(arguments[0]     ,arguments[1]     ,arguments[2]);
      }
   };
   //==============================================================================================
   // Crea una linea entre dos puntos o markadores
   this.CreateLine    = function(){
      switch ( arguments.length ) {
         case 2:return __CreateLine( arguments[0] ,arguments[1] );
         case 4:return __CreateLine( { lng :arguments[0] ,lat : arguments[1] } ,{ lng :arguments[2] , lat : arguments[3] } );
      }
   };
   //==============================================================================================
   // Crea un circulo con un punto de centro y un radio dado
   this.CreateCircle    = function(){
      var pRadio = 0;
      var pLatitud = 0;
      var pLongitud = 0;
      switch (arguments.length) {
         case 2: {
            pLatitud = arguments[0].lat;
            pLongitud = arguments[0].lng;
            pRadio = measure( arguments[0].lat  , arguments[0].lng , arguments[1].lat , arguments[1].lng );
         }
         break;
         case 3:{
            pLongitud = arguments[0];
            pLatitud = arguments[1];
            pRadio = arguments[2];
         }
         break;
         default:
      }
      return __CreateCircle( pLongitud   , pLatitud       , pRadio );
   };
   //==============================================================================================
   // Crea un poligono de una serie de puntos dados
   this.CreatePolygon   = function( pPARAMS ){
      if( pPARAMS.constructor == GeoCercasPoints )
         return __CreatePolygon( pPARAMS.Puntos );

      return __CreatePolygon( pPARAMS );
   };
   //==============================================================================================
   // Crea una linea de acuerdo a una serie de puntos dados
   this.CreateRute      = function(){
      var l_lines = [];
      if( arguments.constructor == GeoCercasPoints ){
         for( var i = 0 ; i < arguments.Puntos.length -1 ; i++ ){
            l_lines.push( __CreateLine( arguments.Puntos[i] , arguments.Puntos[i + 1] ) );
         }
      }
      else{
         for( var i = 0 ; i < arguments.length -1 ; i++ ){
            l_lines.push( __CreateLine( arguments[i] , arguments[i + 1] ) );
         }
      }
      return l_lines;
   };
   //==============================================================================================
   // Mueve un marcador a un punto dado
   this.MoveMarker = function( pMarker , pPosition ){
      __MoveMarker( pMarker , pPosition );
   }
   ////////////////////////////////////////////////////////////////////////////////
   //          Metodos Privados de Clase
  function __CreateID( MaxLength , pPrefix ){
     var text = "";
     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     for( var i=0; i <  MaxLength ; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
     if( pPrefix ){
        return pPrefix + "-" + text ;
     }
     return text;
  }
  function __CreateCircle( pLongitud , pLatitud  , pRadius ){
    var temp_circle = new H.map.Circle({lat: pLatitud , lng: pLongitud }, pRadius , { style: { fillColor : 'rgba(255, 100, 100, 0.5)' }});
    temp_circle.objectID = __CreateID( 5 , "DrawManager_Circle");
    m_figure.push( temp_circle );
    m_map.addObject(temp_circle);
    return temp_circle;
  }
  function __CreateLine( pPointStart , pPointEnd ){
    var strip = new H.geo.Strip();
    strip.pushPoint( pPointStart );
    strip.pushPoint( pPointEnd );

    var temp_polyline = new H.map.Polyline(strip, { style: { strokeColor : 'rgba( 10, 10, 10, 0.7)' , lineWidth: 6 } } );
    temp_polyline.objectID = __CreateID( 5 , "DrawManager_Line");
    m_figure.push(temp_polyline);
    m_map.addObject(temp_polyline);
    return temp_polyline;
  }
  function __CreatePolygon( pPoints ){
    var strip = new H.geo.Strip();
    pPoints.forEach(function (point) {
        strip.pushPoint(point);
    });

    var temp_polygon = new H.map.Polygon(strip, { style: { fillColor : 'rgba(255, 100, 100, 0.5)' }});
    temp_polygon.objectID = __CreateID( 5 , "DrawManager_Polygon");
    m_figure.push(temp_polygon);
    m_map.addObject(temp_polygon);
    return temp_polygon;
  }
  function __CreateMarker( pLongitud , pLatitud , pType ){
     var temp_marker = new H.map.Marker({ lat: pLatitud , lng: pLongitud  } );
     temp_marker.objectID = __CreateID( 5 , "DrawManager_Marker");
     temp_marker.draggable = true;
     m_markers.push( temp_marker );
     m_map.addObject(temp_marker);
     return temp_marker;
  }
  function __MoveMarker( pMarker , pPosition ){
     pMarker.setPosition( pPosition );
  }
   function CreateMap( sender , args ){
      var platform = new H.service.Platform({ 'app_id': 'G0icfq0wNOT09AcJ9xtL', 'app_code': 'hagAi081i-nlUYerpghDNg' });
      var defaultLayers = platform.createDefaultLayers();
      m_map = new H.Map( $(m_element).get(0) , defaultLayers.normal.map, { zoom: 5 , center: { lat: 20.574741, lng: -100.3248 } });
      var ui = H.ui.UI.createDefault( m_map , defaultLayers);
      var zoom = ui.getControl('zoom');
      var scalebar = ui.getControl('scalebar');

      zoom.setAlignment('top-left');
      scalebar.setAlignment('top-left');
      var mapEvents = new H.mapevents.MapEvents(m_map);
      // Instantiate the default behavior, providing the mapEvents object:
      var behavior = new H.mapevents.Behavior(mapEvents);
      // Add event listeners:
      m_map.addEventListener('mapviewchange', function () {
          var zoom = m_map.getZoom();
          if(zoom < 5 )  {
            m_map.setZoom( 5);
          }
          else if( zoom > 17){
            m_map.setZoom(17);
          }
      }, false);
      //=====================================================================
      m_map.addEventListener('dragstart', function(ev) {
         var target = ev.target;
         $($(m_element).get(0) ).css("cursor","move");
         if (target instanceof H.map.Marker) {
            behavior.disable();
         }
      }, false);
      //=====================================================================
      m_map.addEventListener('drag', function(evt) {
         var target = evt.target;
         var pos = m_map.screenToGeo( evt.currentPointer.viewportX, evt.currentPointer.viewportY);
         for( var i  = 0 ; i < e_onDrag.length ; i++){
            e_onDrag[i]( target ,  { args : evt.currentPointer , position :  pos } );
         }
      }, false);
      //=====================================================================
      m_map.addEventListener('dragend', function(ev) {
         var target = ev.target;
         $($(m_element).get(0) ).css("cursor","auto");
         if (target instanceof mapsjs.map.Marker) {
            behavior.enable();
         }
      }, false);
      //=====================================================================
      m_map.addEventListener('tap', function(evt) {
         var target = evt.target;
         var pos = m_map.screenToGeo( evt.currentPointer.viewportX, evt.currentPointer.viewportY);
         for( var i  = 0 ; i < e_onClick.length ; i++){
            e_onClick[i]( target ,  { args : evt.currentPointer , position :  pos } );
         }
      });
      //=====================================================================
   };
   function __Init(){
      m_map = pConfiguration.Map ? pConfiguration.Map : null ;
      if( m_map == null ){
         m_element = pConfiguration.Element ;
         CreateMap();
      }
   };
   __Init();
}

