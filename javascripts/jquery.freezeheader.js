/* ------------------------------------------------------------------------
 Class: freezeHeader
 Use:freeze header row in html table
 Example 1:  $('#tableid').freezeHeader();
 Example 2:  $("#tableid").freezeHeader({ 'height': '300px' });
 Example 3:  $("table").freezeHeader();
 Example 4:  $(".table2").freezeHeader();
 Example 5:  $("#tableid").freezeHeader({ 'offset': '50px' });
 Author(s): Laerte Mercier Junior
 
 Contributors:
 	https://github.com/lahendrix
 	https://github.com/waynebloss
 
 Version: 1.0.8
 -------------------------------------------------------------------------*/
(function($) {
	var TABLE_ID = 0;
	$.fn.freezeHeader = function(params) {

		var copiedHeader = false;

		function freezeHeader(elem) {
			var idObj = elem.attr('id') || ('tbl-' + (++TABLE_ID));
			if (elem.length > 0 && elem[0].tagName.toLowerCase() == "table") {

				var obj = {
					id : idObj,
					grid : elem,
					container : null,
					header : null,
					divScroll : null,
					openDivScroll : null,
					closeDivScroll : null,
					scroller : null
				};

				if (params && params.height !== undefined) {
					obj.divScroll = '<div id="hdScroll' + obj.id + '" style="height: ' + params.height + '; overflow-y: scroll">';
					obj.closeDivScroll = '</div>';
				}

				obj.header = obj.grid.find('thead');

				if (params && params.height !== undefined) {
					if ($('#hdScroll' + obj.id).length == 0) {
						obj.grid.wrapAll(obj.divScroll);
					}
				}

				obj.scroller = params && params.height !== undefined ? $('#hdScroll' + obj.id) : $(window);

				if (params && params.scrollListenerEl !== undefined) {
					obj.scroller = params.scrollListenerEl;
				}
				obj.scroller.on('scroll', function() {
					if ($('#hd' + obj.id).length == 0) {
						obj.grid.before('<div id="hd' + obj.id + '"></div>');
					}

					obj.container = $('#hd' + obj.id);

					if (obj.header.offset() != null) {
						if (limiteAlcancado(obj, params)) {
							if (!copiedHeader) {
								cloneHeaderRow(obj);
								copiedHeader = true;
							}

							// The following line was added - waynebloss
							obj.container.css("left", ("-" + obj.scroller.scrollLeft() + "px"));
						} else {

							if (($(document).scrollTop() > obj.header.offset().top)) {
								obj.container.css("position", "absolute");
								obj.container.css("top", (obj.grid.find("tr:last").offset().top - obj.header.height()) + "px");
								// The same exact line was added here (yuck!) - waynebloss
								obj.container.css("left", ("-" + obj.scroller.scrollLeft() + "px"));
							} else {
								obj.container.css("visibility", "hidden");
								obj.container.css("top", "0px");
								obj.container.width(0);
							}
							copiedHeader = false;
						}
					}

				});
			}
		}

		function limiteAlcancado(obj, params) {
			var offset = params.offset || "0";
			if (params && (params.height !== undefined || params.scrollListenerEl !== undefined)) {
				return (obj.header.offset().top <= obj.scroller.offset().top);
			} else {
				return ($(document).scrollTop() + parseInt(offset) > obj.header.offset().top && $(document).scrollTop() < (obj.grid.height() - obj.header.height() - obj.grid.find("tr:last").height()) + obj.header.offset().top);
			}
		}

		function cloneHeaderRow(obj) {
			obj.container.html('');
			obj.container.val('');
			var tabela = $('<table style="margin: 0 0;"></table>');
			var atributos = obj.grid.prop("attributes");

			$.each(atributos, function() {
				if (this.name != "id") {
					tabela.attr(this.name, this.value);
				}
			});

			tabela.append('<thead>' + obj.header.html() + '</thead>');

			obj.container.append(tabela);
			obj.container.width(obj.header.width());
			obj.container.height(obj.header.height);
			obj.container.find('th').each(function(index) {
				var cellWidth = obj.grid.find('th').eq(index).width();
				$(this).css('width', cellWidth);
			});

			obj.container.css("visibility", "visible");

			if (params && params.height !== undefined) {

				if (params.offset !== undefined) {
					obj.container.css("top", obj.scroller.offset().top + parseInt(params.offset) + "px");
				} else {
					obj.container.css("top", obj.scroller.offset().top + "px");
				}

				obj.container.css("position", "absolute");

			} else if (params && params.scrollListenerEl !== undefined) {
				obj.container.css("top", obj.scroller.find("thead > tr").innerHeight() + "px");
				obj.container.css("position", "absolute");
				obj.container.css("z-index", "2");
			} else if (params && params.offset !== undefined) {
				obj.container.css("top", params.offset);
				obj.container.css("position", "fixed");
			} else {
				obj.container.css("top", "0px");
				obj.container.css("position", "fixed");
			}
		}

		return this.each(function(i, e) {
			freezeHeader($(e));
		});

	};
})(jQuery);

