/**
 * Code to integrate the pfGrid JavaScript library into Page Forms.
 *
 * @author Yaron Koren
 */
/* global wgPageFormsGridParams, wgPageFormsGridValues */
(function(jsGrid, $, undefined) {
        //START ADDITIONAL CODE FOR NEW INPUT TYPE DATE.:- 
        /** Quick custom date-field or new date data type code rundown:- 
         *  The date data type is automatically set up the PF_FormPrinter.php file.
         *  Any date field in mediaWiki will use this system of the date and year input box with a month selector automatically. 
         * insertTemplate preprocess value and returns that to the grid cell to display; 
         * editTemplate/insertTemplate generate the edition/insertion forms. 
         * editValue/insertValue is in charge of putting the final values into the grid. 
         */

        //Defining Global variables to store edit and insert values to then used by editValue/insertValue functions to put them into the date field. 
        var Global_Edit_day_of_the_month;
        var Global_Edit_month;
        var Global_Edit_year;
        var Global_Insert_day_of_the_month;
        var Global_Insert_month;
        var Global_Insert_year;

        function buildSelect(def) { //Select Generator function
            var i18n_month_obj = mw.config.get(wgMonthNamesShort); //Gets an object with {month_name:null}
            var i18n_month_array = $.map(i18n_month_obj, function(value, index) {
                return index;
            }); //Converts it to an array with key value pairs
            var options = {
                "1": "Jan",
                "2": "Feb",
                "3": "Mar",
                "4": "Apr",
                "5": "May",
                "6": "Jun",
                "7": "Jul",
                "8": "Aug",
                "9": "Sep",
                "10": "Oct",
                "11": "Nov",
                "12": "Dec"
            };
            var str = '<select class="pf_jsGrid_month" style=" width: 100% !important; font-size:14px;">';
            var option;
            for (val=1; val<=12; val++) {
                if (val < 10) { //Adds a leading 0 to single digit months, ex 01 instead of 1; 
                    var val2 = "0" + val;
                } else {
                    var val2 = val;
                }
                if (val == def) {
                    option = '<option selected="selected" value="' + val2 + '">' + i18n_month_array[val] + '</option>';
                } else {
                    option = '<option value="' + val2 + '">' + i18n_month_array[val] + '</option>';
                }
                str += option;
            }
            str += '</select>';
            return str;
        }

        var MyDateField = function(config) {
            jsGrid.Field.call(this, config);
        };

        MyDateField.prototype = new jsGrid.Field({
            sorter: function(date1, date2) {
                return new Date(date1) - new Date(date2);
            },

            itemTemplate: function(value) {
                return value;
            },

            insertTemplate: function(value) {
			var html_date = '<div class="pf_jsGrid_ymd_form"><div style="float:left; width:19%;"><label style="display:block; text-align:center; font- size:14px;">DD:</label><input  class="pf_jsGrid_day" style=" font-size:14px; " type="text" value="" placeholder="DD"></input></div>';
			var html_year = '<div style="float:left; width:29%;"><label style="display:block; text-align:center; width:29%; font-size:14px;">YYYY:</label><input class="pf_jsGrid_year" style=" font-size:14px; " type="text" value="" placeholder="YYYY"></input></div>';
			var html_month = '<div style="float:left; width:48%; margin-left:2%; margin-right:2%;"><label style="display:block; text-align:center; font-size:14px;">MM:</label>' + buildSelect(1) + '</div>';
			if (!wgAmericanDates) { //check for date-style format. 
			    var html2 = html_date + html_month + html_year + '</div>';
			} else {
			    var html2 = html_month + html_date + html_year + '</div>';
			}
			//Set up Event listners on form input fields to capture value on any kind of change into the global variables.
			$('.pfJSGrid').on('click propertychange change keyup input paste', ".pf_jsGrid_day", function() {
			    Global_Insert_day_of_the_month = $('.pf_jsGrid_day').val();
			    Global_Insert_year = $('.pf_jsGrid_year').val();
			    Global_Insert_month = $('.pf_jsGrid_month').val();
			});
			$('.pfJSGrid').on('click propertychange change keyup input paste', ".pf_jsGrid_year", function() {
			    Global_Insert_day_of_the_month = $('.pf_jsGrid_day').val();
			    Global_Insert_year = $('.pf_jsGrid_year').val();
			    Global_Insert_month = $('.pf_jsGrid_month').val();
			});
			$('.pfJSGrid').on('click propertychange change keyup input paste', ".pf_jsGrid_month", function() {
				Global_Insert_day_of_the_month = $('.pf_jsGrid_day').val(); 
				Global_Insert_year = $('.pf_jsGrid_year').val();  
				Global_Insert_month = $('.pf_jsGrid_month').val();
			});
				return html2;
			},

                editTemplate: function(value) {
		        var dtObj = new Date(value);
		        var html_date = '<div class="pf_jsGrid_ymd_form"><div style="float:left; width:19%;"><label style="display:block; text-align:center; font-size:14px;">DD:</label><input  class="pf_jsGrid_day" style=" font-size:14px; " type="text" value=' + dtObj.getDate() + '></input></div>';
		        var html_year = '<div style="float:left; width:29%;"><label style="display:block; text-align:center; width:29%; font-size:14px;">YYYY:</label><input class="pf_jsGrid_year" style=" font-size:14px; " type="text" value=' + dtObj.getFullYear() + '></input></div>';
		        var html_month = '<div style="float:left; width:48%; margin-left:2%; margin-right:2%;"><label style="display:block; text-align:center; font-size:14px;">MM:</label>' + buildSelect(dtObj.getMonth() + 1) + '</div>';
		        if (!wgAmericanDates) {
		            var html = html_date + html_month + html_year + '</div>';
		        } else {
		            var html = html_month + html_date + html_year + '</div>';
		        }
			/*
			   *Always use eq(1) on the edit functions since jsGrid has a hidden insert row, so you have to ignore that row else you will capture 
			*/
		        $('.pfJSGrid').on('click propertychange change keyup input paste', ".pf_jsGrid_day", function() {
		            Global_Edit_day_of_the_month = $('.pf_jsGrid_day').eq(1).val();
		            Global_Edit_year = $('.pf_jsGrid_year').eq(1).val();
		            Global_Edit_month = $('.pf_jsGrid_month').eq(1).val();
		        });
		        $('.pfJSGrid').on('click propertychange change keyup input paste', ".pf_jsGrid_year", function() {
		            Global_Edit_day_of_the_month = ($('.pf_jsGrid_day').eq(1)).val();
		            Global_Edit_year = ($('.pf_jsGrid_year').eq(1)).val();
		            Global_Edit_month = $('.pf_jsGrid_month').eq(1).val();
		        });
		        $('.pfJSGrid').on('click propertychange change keyup input paste', ".pf_jsGrid_month", function() {
		            Global_Edit_day_of_the_month = ($('.pf_jsGrid_day').eq(1)).val();
		            Global_Edit_year = ($('.pf_jsGrid_year').eq(1)).val();
		            Global_Edit_month = $('.pf_jsGrid_month').eq(1).val();
		        });
		        return html;
		    },

                    insertValue: function() {
                        var ret = Global_Insert_year + "-" + Global_Insert_month + "-" + Global_Insert_day_of_the_month;
                        return ret;
                    },

                    editValue: function(value) {
                        var ret = Global_Edit_year + "-" + Global_Edit_month + "-" + Global_Edit_day_of_the_month;
                        return ret;
                    }
                });

       jsGrid.fields.date = MyDateField;
}(jsGrid, jQuery));


( function ( $, mw ) {

	$( '.pfJSGrid' ).each( function() {
		var wgPageFormsGridParams = mw.config.get( 'wgPageFormsGridParams' ),
			wgPageFormsGridValues = mw.config.get( 'wgPageFormsGridValues' );
		var $gridDiv = $( this );
		var templateName = $gridDiv.attr( 'data-template-name' );
		var gridHeight = $gridDiv.attr( 'height' );
		if ( gridHeight === undefined ) { gridHeight = '400px'; }
		// The slice() is necessary to do a clone, so that
		// wgPageFormsGridParams does not get modified.
		var templateParams = wgPageFormsGridParams[templateName].slice(0);
		templateParams.push( { type: 'control' } );

		$gridDiv.jsGrid({
			width: "100%",
			height: gridHeight,

			editing: true,
			inserting: true,
			confirmDeleting: false,

			data: wgPageFormsGridValues[templateName],
			fields: templateParams,

			onEditRowCreated: function( args ) {
				args.editRow.keypress( function( e ) {
					// Make the "Enter" key approve an update.
					if ( e.which === 13 ) {
						$gridDiv.jsGrid("updateItem");
						e.preventDefault();
					}
				});
				args.editRow.find( 'textarea' ).keypress( function( e ) {
					if ( e.which === 10 ) {
						$(this).addNewlineAtCursor();
					}
				});
			},

			onInsertRowCreated: function( args ) {
				args.insertRow.keypress( function( e ) {
					// Make the "Enter" key approve an insert.
					if ( e.which === 13 ) {
						$gridDiv.jsGrid("insertItem");
						$gridDiv.jsGrid("clearInsert");
						e.preventDefault();
					}
				});
				args.insertRow.find( 'textarea' ).keypress( function( e ) {
					if ( e.which === 10 ) {
						$(this).addNewlineAtCursor();
					}
				});

			}
		});

		var $gridData = $gridDiv.find( ".jsgrid-grid-body tbody" );
 
		// Copied from http://js-grid.com/demos/rows-reordering.html
		$gridData.sortable({
			update: function( e, ui ) {
				// array of indexes
				var clientIndexRegExp = /\s+client-(\d+)\s+/;
				var indexes = $.map( $gridData.sortable( "toArray", { attribute: "class" } ), function(classes) {
					return clientIndexRegExp.exec(classes)[1];
				});
 
				// arrays of items
				var items = $.map( $gridData.find("tr"), function(row) {
					return $(row).data("JSGridItem");
				});
			}
		});

	});

	$( "#pfForm" ).submit(function( event ) {
		// Add a hidden field for each value in the grid.
		$( "div.jsgrid-grid-body" ).each( function() {
			var $grid = $( this );
			var $gridDiv = $grid.parents( '.jsgrid' );
			var templateName = $gridDiv.attr( 'data-template-name' );

			var rowNum = 1;
			$grid.find( "tr" ).each( function() {
				var $row = $( this );
				if ( $row.hasClass( 'jsgrid-edit-row' ) || $row.hasClass( 'jsgrid-nodata-row' ) ) {
					// Continue.
					return;
				}
				var cellNum = 1;
				$row.find( "td" ).each( function() {
					var paramName = wgPageFormsGridParams[templateName][cellNum - 1].name;
					var value = $( this ).html();
					// If this isn't a checkbox, the value
					// will be neither true not false - it
					// will be undefined.
					var isChecked = $( this ).find( ':checkbox' ).prop( 'checked' );
					if ( isChecked === true ) {
						value = mw.msg( 'htmlform-yes' );
					} else if ( isChecked === false ) {
						value = mw.msg( 'htmlform-no' );
					}
					var inputName = templateName + '[' + rowNum + '][' + paramName + ']';
					$('<input>').attr( 'type', 'hidden' ).attr( 'name', inputName ).attr( 'value', value ).appendTo( '#pfForm' );
					cellNum++;
					if ( cellNum > wgPageFormsGridParams[templateName].length ) {
						// Break.
						return false;
					}
				});
				rowNum++;
			});
		});
	});

	$.fn.addNewlineAtCursor = function() {
		var curPos = $(this).getCursorPosition();
		var curVal = $(this).val();
		$(this).val( curVal.substring( 0, curPos ) + "\n" + curVal.substring( curPos ) );
		$(this).setCursorPosition( curPos + 1 );
	};

	// Copied from http://stackoverflow.com/a/1909997
	$.fn.getCursorPosition = function() {
		var el = $(this).get(0);
		var pos = 0;
		if ( 'selectionStart' in el ) {
			pos = el.selectionStart;
		} else if ( 'selection' in document ) {
			el.focus();
			var Sel = document.selection.createRange();
			var SelLength = document.selection.createRange().text.length;
			Sel.moveStart( 'character', -el.value.length );
			pos = Sel.text.length - SelLength;
		}
		return pos;
	};

	// Copied from http://stackoverflow.com/a/3651232
	$.fn.setCursorPosition = function( pos ) {
		this.each( function( index, elem ) {
			if ( elem.setSelectionRange ) {
				elem.setSelectionRange( pos, pos );
			} else if ( elem.createTextRange ) {
				var range = elem.createTextRange();
				range.collapse( true );
				range.moveEnd( 'character', pos );
				range.moveStart( 'character', pos );
				range.select();
			}
		});
		return this;
	};
}( jQuery, mediaWiki ) );








